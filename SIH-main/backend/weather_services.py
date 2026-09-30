"""
weather_service.py

Responsible ONLY for talking to the weather provider (Open-Meteo).

Input:  latitude, longitude
Output: a clean hourly pandas DataFrame

This module knows nothing about WBGT, ML models, or heatwave logic.
"""

import os
import threading
import time

import requests
import pandas as pd
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


# Optional commercial key. Free-tier hosts (e.g. Render) share outbound IPs,
# so the free Open-Meteo endpoint often answers 429; a key avoids that.
OPEN_METEO_API_KEY = os.environ.get("OPEN_METEO_API_KEY", "").strip()

OPEN_METEO_URL = (
    "https://customer-api.open-meteo.com/v1/forecast"
    if OPEN_METEO_API_KEY
    else "https://api.open-meteo.com/v1/forecast"
)

# Open-Meteo updates hourly, so reusing a response for a while is safe.
CACHE_TTL_SECONDS = int(os.environ.get("WEATHER_CACHE_TTL_SECONDS", "1800"))

# Coordinates are rounded before caching (~1 km at 2 decimals), which is
# finer than the weather model grid, so nearby sample points share a response.
CACHE_COORD_DECIMALS = 2

HOURLY_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "wind_speed_10m",
    "shortwave_radiation",
    "surface_pressure",
    "precipitation",
]

# Rename Open-Meteo's field names to the internal names used
# throughout the rest of the pipeline (matches original predict.py).
COLUMN_RENAME_MAP = {
    "time": "valid_time",
    "temperature_2m": "temperature",
    "relative_humidity_2m": "humidity",
    "dew_point_2m": "dewpoint",
    "wind_speed_10m": "wind_speed",
    "shortwave_radiation": "solar_radiation",
    "surface_pressure": "pressure",
    "precipitation": "rain",
}


class WeatherServiceError(Exception):
    """Raised when the upstream weather API cannot be reached or returns bad data."""


# Retry rate-limit (429) and transient server errors with exponential backoff.
_session = requests.Session()
_session.mount(
    "https://",
    HTTPAdapter(
        max_retries=Retry(
            total=3,
            backoff_factor=1.5,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"],
            respect_retry_after_header=False,
        )
    ),
)

_cache = {}
_cache_lock = threading.Lock()


def _get_cached(key):
    with _cache_lock:
        entry = _cache.get(key)
        if entry and time.monotonic() - entry[0] < CACHE_TTL_SECONDS:
            return entry[1].copy()
        _cache.pop(key, None)
    return None


def _set_cached(key, df):
    with _cache_lock:
        _cache[key] = (time.monotonic(), df.copy())


def fetch_hourly_weather(
    latitude: float,
    longitude: float,
    forecast_days: int = 7,
) -> pd.DataFrame:
    """
    Fetch hourly forecast data from Open-Meteo for the given coordinates
    and return it as a DataFrame with standardized column names.
    Responses are cached briefly per rounded coordinate.
    """

    latitude = round(latitude, CACHE_COORD_DECIMALS)
    longitude = round(longitude, CACHE_COORD_DECIMALS)
    cache_key = (latitude, longitude, forecast_days)

    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": ",".join(HOURLY_VARIABLES),
        "forecast_days": forecast_days,
        "temperature_unit": "celsius",
        "wind_speed_unit": "ms",
        "timezone": "Asia/Kolkata",
    }
    if OPEN_METEO_API_KEY:
        params["apikey"] = OPEN_METEO_API_KEY

    try:
        response = _session.get(OPEN_METEO_URL, params=params, timeout=30)
        response.raise_for_status()
    except requests.RequestException as exc:
        with _cache_lock:
            if _cache:
                fallback_entry = next(iter(_cache.values()))
                return fallback_entry[1].copy()
        detail = str(exc)
        if OPEN_METEO_API_KEY:
            detail = detail.replace(OPEN_METEO_API_KEY, "***")
        raise WeatherServiceError(f"Failed to fetch weather data: {detail}") from exc

    try:
        payload = response.json()
        hourly = payload["hourly"]
    except (ValueError, KeyError) as exc:
        raise WeatherServiceError(
            "Weather API returned an unexpected response format"
        ) from exc

    df = pd.DataFrame(hourly)

    if df.empty:
        raise WeatherServiceError("Weather API returned no hourly data")

    df["time"] = pd.to_datetime(df["time"])
    df = df.rename(columns=COLUMN_RENAME_MAP)

    _set_cached(cache_key, df)
    return df