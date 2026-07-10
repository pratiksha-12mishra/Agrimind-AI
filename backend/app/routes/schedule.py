from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.weather.openweather_client import get_forecast
from app.engine.decision_engine import generate_weekly_schedule

router = APIRouter(prefix="/schedule", tags=["Schedule"])


class ScheduleRequest(BaseModel):
    crop: str = Field(
        ...,
        pattern="^(wheat|rice|cotton|maize|sugarcane|soybean|groundnut|potato|tomato|onion|chickpea|mustard)$"
    )
    growth_stage: str = Field(
        ...,
        pattern="^(seedling|vegetative|flowering|maturity)$"
    )
    soil_moisture: float = Field(..., ge=0, le=100)
    city: str = Field(..., min_length=2, max_length=50)


@router.post("/")
def generate_schedule(data: ScheduleRequest):

    forecast = get_forecast(data.city)

    if isinstance(forecast, dict) and "error" in forecast:
        raise HTTPException(
            status_code=404,
            detail=forecast["error"]
        )

    schedule = generate_weekly_schedule(
        crop=data.crop,
        growth_stage=data.growth_stage,
        soil_moisture=data.soil_moisture,
        forecast=forecast,
    )

    return {
        "city": data.city,
        "days": len(schedule),
        "schedule": schedule
    }