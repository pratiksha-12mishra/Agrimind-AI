from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class RecommendationHistory(SQLModel, table=True):
    __tablename__ = "recommendation_history"

    id: Optional[int] = Field(default=None, primary_key=True)

    city: str
    crop: str
    growth_stage: str

    soil_moisture: float
    temperature: float
    humidity: float
    rain_probability: float

    decision: str
    water_required: str
    confidence: float

    created_at: datetime = Field(default_factory=datetime.utcnow)

class Farm(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    city: str

    crop: str
    growth_stage: str

    area: float

    soil_type: str

    irrigation_method: str