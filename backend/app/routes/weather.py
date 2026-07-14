from fastapi import APIRouter, HTTPException, Query
from app.weather.openweather_client import (
    get_weather,
    get_weather_by_coordinates,
    get_forecast,
)

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


# Current weather by city
@router.get("/{city}")
def weather(city: str):
    data = get_weather(city)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data


# Current weather by GPS location
@router.get("/location/current")
def weather_by_location(
    latitude: float = Query(...),
    longitude: float = Query(...)
):
    data = get_weather_by_coordinates(latitude, longitude)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data


# 5-day forecast
@router.get("/forecast/{city}")
def forecast(city: str):
    data = get_forecast(city)

    if isinstance(data, dict) and "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data