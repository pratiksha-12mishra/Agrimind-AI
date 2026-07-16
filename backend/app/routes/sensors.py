from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import SensorReading

router = APIRouter(prefix="/sensors", tags=["Sensors"])


@router.get("/latest")
def get_latest_sensor_reading(
    session: Session = Depends(get_session)
):
    reading = session.exec(
        select(SensorReading).order_by(SensorReading.created_at.desc())
    ).first()

    if not reading:
        return {
            "soil_moisture": None,
            "temperature": None,
            "humidity": None,
            "motor_running": None,
            "device_id": None,
            "last_seen": None,
        }

    return {
        "soil_moisture": reading.soil_moisture,
        "temperature": reading.temperature,
        "humidity": reading.humidity,
        "motor_running": reading.motor_running,
        "device_id": reading.device_id,
        "last_seen": reading.created_at.isoformat(),
    }