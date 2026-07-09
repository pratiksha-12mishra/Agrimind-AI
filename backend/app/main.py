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

app = FastAPI()
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

@app.get("/")
def root():
    return {"message": "AgriMind AI API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/weather/{city}")
def weather(city: str):
    return get_weather(city)

@app.post("/recommend")
def recommend(data: RecommendationRequest):

    weather = get_weather(data.city)

    if "error" in weather:
        raise HTTPException(
            status_code=404,
            detail=weather["error"]
        )

    temperature = weather["temperature"]
    humidity = weather["humidity"]

    rain_probability = weather["rain_probability"]

    result = decide_irrigation(
        crop=data.crop,
        growth_stage=data.growth_stage,
        soil_moisture=data.soil_moisture,
        temperature=temperature,
        humidity=humidity,
        rain_probability=rain_probability,
    )

    return {
        "weather": weather,
        "recommendation": result
    }