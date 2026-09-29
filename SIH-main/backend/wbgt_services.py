"""
wbgt_service.py

Responsible ONLY for calculating WBGT and
WBGT-based heatwave indicators.

Input:
    Hourly weather DataFrame

Output:
    Hourly DataFrame containing WBGT values
"""


import numpy as np
import pandas as pd

try:
    from pywbgt import wbgt
    from metpy.units import units
    _HAS_PYWBGT = True
except Exception:
    wbgt = None
    units = None
    _HAS_PYWBGT = False


# ============================================================
# WBGT CALCULATION
# ============================================================

def calculate_wbgt_stull(temperature, humidity, solar_radiation, wind_speed):
    """
    Standard Stull outdoor WBGT approximation using air temperature,
    relative humidity, solar radiation, and wind speed.
    Matches the verified formula in predict.py.
    """
    temp = np.asarray(temperature, dtype=float)
    rh = np.clip(np.asarray(humidity, dtype=float), 0.0, 100.0)
    solar = np.clip(np.asarray(solar_radiation, dtype=float), 0.0, None)
    wind = np.clip(np.asarray(wind_speed, dtype=float), 0.0, None)

    # Stull natural wet-bulb approximation
    wet_bulb = (
        temp * np.arctan(0.151977 * np.sqrt(rh + 8.313659))
        + np.arctan(temp + rh)
        - np.arctan(rh - 1.676331)
        + 0.00391838 * (rh ** 1.5) * np.arctan(0.023101 * rh)
        - 4.686035
    )

    # Globe temperature approximation
    globe_temp = temp + 0.025 * solar - 0.1 * wind

    # Standard outdoor WBGT: 70% wet bulb, 20% globe, 10% dry bulb
    return 0.7 * wet_bulb + 0.2 * globe_temp + 0.1 * temp


def calculate_hourly_wbgt(
    df: pd.DataFrame,
    latitude: float,
    longitude: float
) -> pd.DataFrame:
    """
    Calculate hourly WBGT from weather data.

    Expected columns:

        valid_time
        temperature
        humidity
        dewpoint
        wind_speed
        solar_radiation
        pressure
    """

    required_columns = [
        "valid_time",
        "temperature",
        "dewpoint",
        "wind_speed",
        "solar_radiation",
        "pressure",
    ]

    missing = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing required weather columns: {missing}"
        )

    result_df = df.copy()

    # Ensure humidity is present (compute via Magnus formula if absent)
    if "humidity" not in result_df.columns:
        a = 17.625
        b = 243.04
        t = result_df["temperature"].values
        td = result_df["dewpoint"].values
        result_df["humidity"] = 100.0 * (
            np.exp((a * td) / (b + td)) / np.exp((a * t) / (b + t))
        )

    computed = False
    if _HAS_PYWBGT and units is not None:
        try:
            temp_air = (result_df["temperature"].values + 273.15) * units.kelvin
            temp_dew = (result_df["dewpoint"].values + 273.15) * units.kelvin
            wind = (result_df["wind_speed"].values * units.meter / units.second)
            solar = (result_df["solar_radiation"].values * units.watt / units.meter**2)
            pressure = (result_df["pressure"].values * 100) * units.pascal
            datetime = pd.DatetimeIndex(result_df["valid_time"])
            lat_array = np.full(len(result_df), latitude)
            lon_array = np.full(len(result_df), longitude)

            wbgt_result = wbgt(
                datetime=datetime,
                lat=lat_array,
                lon=lon_array,
                solar=solar,
                pres=pressure,
                temp_air=temp_air,
                temp_dew=temp_dew,
                speed=wind,
                method="liljegren"
            )
            wbgt_values = wbgt_result[3]
            result_df["WBGT_C"] = wbgt_values.magnitude
            computed = True
        except Exception:
            computed = False

    if not computed:
        result_df["WBGT_C"] = calculate_wbgt_stull(
            result_df["temperature"],
            result_df["humidity"],
            result_df["solar_radiation"],
            result_df["wind_speed"],
        )

    return result_df


# ============================================================
# DAILY WBGT INDICATORS
# ============================================================

def calculate_daily_wbgt_indicators(
    hourly_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Convert hourly WBGT data into daily WBGT indicators.
    """

    df = hourly_df.copy()

    # --------------------------------------------------------
    # Create date
    # --------------------------------------------------------

    df["date"] = pd.to_datetime(
        df["valid_time"]
    ).dt.date

    # --------------------------------------------------------
    # Daily statistics
    # --------------------------------------------------------

    daily = df.groupby("date").agg(

        max_WBGT=(
            "WBGT_C",
            "max"
        ),

        mean_WBGT=(
            "WBGT_C",
            "mean"
        ),

        max_temperature=(
            "temperature",
            "max"
        ),

        mean_temperature=(
            "temperature",
            "mean"
        ),

        max_humidity=(
            "humidity",
            "max"
        ),

        mean_humidity=(
            "humidity",
            "mean"
        ),

        max_dewpoint=(
            "dewpoint",
            "max"
        ),

        mean_dewpoint=(
            "dewpoint",
            "mean"
        ),

        max_wind_speed=(
            "wind_speed",
            "max"
        ),

        mean_wind_speed=(
            "wind_speed",
            "mean"
        ),

        max_solar_radiation=(
            "solar_radiation",
            "max"
        ),

        mean_solar_radiation=(
            "solar_radiation",
            "mean"
        ),

        mean_pressure=(
            "pressure",
            "mean"
        )

    ).reset_index()

    # --------------------------------------------------------
    # Number of hours with WBGT >= 30°C
    # --------------------------------------------------------

    high_hours = (
        df[df["WBGT_C"] >= 30]
        .groupby("date")
        .size()
        .rename("high_WBGT_hours")
    )

    daily = daily.merge(
        high_hours,
        on="date",
        how="left"
    )

    daily["high_WBGT_hours"] = (
        daily["high_WBGT_hours"]
        .fillna(0)
    )

    # --------------------------------------------------------
    # Rain
    # --------------------------------------------------------

    if "rain" in df.columns:

        rain_daily = (
            df.groupby("date")["rain"]
            .sum()
            .rename("total_rain")
        )

        daily = daily.merge(
            rain_daily,
            on="date",
            how="left"
        )

        daily["total_rain"] = (
            daily["total_rain"]
            .fillna(0)
        )

        def _classify_rain(val):
            if val < 0.1:
                return "No rain"
            elif val < 2.5:
                return "Light rain"
            elif val < 15.0:
                return "Moderate rain"
            else:
                return "Heavy rain"

        daily["rain_status"] = daily["total_rain"].apply(_classify_rain)

    else:

        daily["total_rain"] = 0.0

        daily["rain_status"] = "Unknown"

    return daily


# ============================================================
# PREDICTED HEAT-STRESS TIMING
# ============================================================

def calculate_heatwave_timing(
    hourly_df: pd.DataFrame,
    wbgt_threshold: float = 30.0,
    minimum_high_hours: int = 3,
) -> dict:
    """
    Return the predicted daily WBGT heat-stress window.

    The window is derived from the hourly forecast produced by the
    prediction service, not from a fixed clock range such as 11 AM-4 PM.
    For each day, the longest consecutive run with WBGT >= threshold is
    selected. A heat-stress window is reported only when that run reaches
    the minimum duration used by the heatwave rule.
    """
    df = hourly_df.copy()
    df["valid_time"] = pd.to_datetime(df["valid_time"])
    df = df.sort_values("valid_time")
    df["date"] = df["valid_time"].dt.date
    df["above_threshold"] = df["WBGT_C"] >= wbgt_threshold

    result = {}
    for date, group in df.groupby("date"):
        rows = group[["valid_time", "above_threshold"]].reset_index(drop=True)
        best_start = best_end = None
        run_start = None
        previous_time = None

        for i, row in rows.iterrows():
            current_time = row["valid_time"]
            continuous = (
                previous_time is not None
                and current_time - previous_time == pd.Timedelta(hours=1)
            )

            if bool(row["above_threshold"]):
                if run_start is None or not continuous:
                    run_start = current_time
                run_end = current_time
            else:
                if run_start is not None:
                    if best_start is None or run_end - run_start > best_end - best_start:
                        best_start, best_end = run_start, run_end
                    run_start = None
            previous_time = current_time

        if run_start is not None:
            if best_start is None or run_end - run_start > best_end - best_start:
                best_start, best_end = run_start, run_end

        if best_start is not None:
            hours = int(round((best_end - best_start) / pd.Timedelta(hours=1))) + 1
            if hours >= minimum_high_hours:
                # End time is the end of the last qualifying hourly interval.
                result[str(date)] = {
                    "start": best_start.strftime("%I:%M %p"),
                    "end": best_end.strftime("%I:%M %p"),
                    "hours": hours,
                    "label": f"{best_start.strftime('%I:%M %p').lstrip('0')}–{best_end.strftime('%I:%M %p').lstrip('0')}",
                }
                continue

        result[str(date)] = {
            "start": None,
            "end": None,
            "hours": 0,
            "label": "No elevated heat-stress period predicted",
        }

    return result


# ============================================================
# HEATWAVE DECISION
# ============================================================

def determine_heatwave(
    daily_df: pd.DataFrame,
    wbgt_threshold: float = 30.0,
    minimum_high_hours: int = 3
) -> pd.DataFrame:
    """
    Determine heatwave conditions using the WBGT rule.

    Heatwave condition:

        WBGT >= 30°C
        for at least 3 hours
    """

    result = daily_df.copy()

    result["heatwave_prediction"] = np.where(
        result["high_WBGT_hours"] >= minimum_high_hours,
        "Heatwave",
        "No Heatwave"
    )

    return result