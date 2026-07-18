from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)

    email: str = Field(unique=True, index=True)
    hashed_password: str

    created_at: datetime = Field(default_factory=datetime.utcnow)


class Farm(SQLModel, table=True):
    __tablename__ = "farm"

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    city: str
    crop: str
    growth_stage: str
    area: float
    soil_type: str
    irrigation_method: str

    device_id: Optional[str] = Field(default=None, unique=True, index=True)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")


class MotorLog(SQLModel, table=True):
    __tablename__ = "motor_log"

    id: Optional[int] = Field(default=None, primary_key=True)

    farm_id: int
    action: str          # "start" or "stop"
    status: str          # "sent", "success", "failed"

    created_at: datetime = Field(default_factory=datetime.utcnow)


class Notification(SQLModel, table=True):
    __tablename__ = "notification"

    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    message: str
    farm_id: Optional[int] = Field(default=None, foreign_key="farm.id")
    is_read: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)


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


class SensorReading(SQLModel, table=True):
    __tablename__ = "sensor_reading"

    id: Optional[int] = Field(default=None, primary_key=True)

    device_id: str
    soil_moisture: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    motor_running: Optional[bool] = None

    crop: Optional[str] = None
    growth_stage: Optional[str] = None
    city: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)


class PushSubscription(SQLModel, table=True):
    __tablename__ = "push_subscription"

    id: Optional[int] = Field(default=None, primary_key=True)

    endpoint: str
    p256dh: str
    auth: str
    farm_id: Optional[int] = Field(default=None, foreign_key="farm.id")

    created_at: datetime = Field(default_factory=datetime.utcnow)