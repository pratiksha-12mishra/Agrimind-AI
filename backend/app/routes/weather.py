from fastapi import APIRouter, HTTPException, Query
from app.weather.openweather_client import get_weather, get_weather_by_coordinates

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


# Existing endpoint (keep this)
@router.get("/{city}")
def weather(city: str):
    data = get_weather(city)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data


# New endpoint for live GPS location
@router.get("/location/current")
def weather_by_location(
    latitude: float = Query(...),
    longitude: float = Query(...)
):
    data = get_weather_by_coordinates(latitude, longitude)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data