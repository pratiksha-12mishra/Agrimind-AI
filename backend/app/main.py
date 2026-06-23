from fastapi import FastAPI
from backend.app.weather.openweather_client import get_weather
from pydantic import BaseModel
from backend.app.engine.decision_engine import decide_irrigation
app = FastAPI()

class RecommendationRequest(BaseModel):
    crop: str
    growth_stage: str
    soil_moisture: float
    city: str

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

    temperature = weather["temperature"]
    humidity = weather["humidity"]

    rain_probability = 20

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