"""
schemas.py

Pydantic models defining the API's request and response contracts.
"""

from typing import List, Optional
from pydantic import BaseModel


class Location(BaseModel):
    latitude: float
    longitude: float


class TemperatureInfo(BaseModel):
    max: float
    mean: float


class WBGTInfo(BaseModel):
    max: float
    mean: float


class RainInfo(BaseModel):
    total: float
    status: str


class HeatStressTiming(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None
    hours: int = 0
    label: str


class DailyForecast(BaseModel):
    date: str
    heatwave: bool
    risk: str
    heatwave_timing: Optional[HeatStressTiming] = None
    temperature: TemperatureInfo
    wbgt: WBGTInfo
    rain: RainInfo


class ForecastResponse(BaseModel):
    location: Location
    forecast: List[DailyForecast]


class HealthResponse(BaseModel):
    status: str


class ErrorResponse(BaseModel):
    error: str