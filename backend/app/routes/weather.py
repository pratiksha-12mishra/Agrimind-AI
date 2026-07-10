from fastapi import APIRouter, HTTPException
from app.weather.openweather_client import get_weather

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


@router.get("/{city}")
def weather(city: str):
    data = get_weather(city)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])

    return data