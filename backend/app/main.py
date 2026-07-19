from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.weather.openweather_client import get_weather
from app.engine.decision_engine import decide_irrigation
from pydantic import BaseModel, Field
from app.routes import farms
from app.routes import weather
from app.routes import history
from app.routes import notifications
from app.routes import motor
from app.routes import voice
from app.routes import schedule
from app.db.database import create_db_and_tables
from fastapi import Depends
from sqlmodel import Session
from app.db.database import get_session
from app.db.models import RecommendationHistory
from app.mqtt.client import connect
from app.notifications.scheduler import start_scheduler
from app.routes import auth
from app.routes import sensors
from typing import Optional


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    connect()
    start_scheduler()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farms.router)
app.include_router(weather.router)
app.include_router(history.router)
app.include_router(notifications.router)
app.include_router(motor.router)
app.include_router(voice.router)
app.include_router(schedule.router)
app.include_router(auth.router)
app.include_router(sensors.router)


class RecommendationRequest(BaseModel):
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
    sensor_temperature: Optional[float] = Field(default=None, description="Live DHT11 temperature, overrides OpenWeather if provided")
    sensor_humidity: Optional[float] = Field(default=None, ge=0, le=100, description="Live DHT11 humidity, overrides OpenWeather if provided")


@app.get("/")
def root():
    return {"message": "AgriMind AI API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend")
def recommend(
    data: RecommendationRequest,
    session: Session = Depends(get_session)
):

    weather = get_weather(data.city)

    if "error" in weather:
        raise HTTPException(
            status_code=404,
            detail=weather["error"]
        )

    # Use live sensor values when provided, fall back to OpenWeather otherwise
    temperature = data.sensor_temperature if data.sensor_temperature is not None else weather["temperature"]
    humidity = data.sensor_humidity if data.sensor_humidity is not None else weather["humidity"]

    # Rain probability always comes from OpenWeather — no sensor equivalent exists
    rain_probability = weather["rain_probability"]

    result = decide_irrigation(
        crop=data.crop,
        growth_stage=data.growth_stage,
        soil_moisture=data.soil_moisture,
        temperature=temperature,
        humidity=humidity,
        rain_probability=rain_probability,
    )

    history = RecommendationHistory(
        city=data.city,
        crop=data.crop,
        growth_stage=data.growth_stage,
        soil_moisture=data.soil_moisture,
        temperature=temperature,
        humidity=humidity,
        rain_probability=rain_probability,
        decision=result["decision"],
        water_required=result["water_required"],
        confidence=result["confidence"],
    )

    session.add(history)
    session.commit()

    return {
        "weather": weather,
        "recommendation": result
    }