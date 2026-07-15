import os

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Farm, MotorLog
from app.mqtt.client import publish

router = APIRouter(tags=["Motor"])

TOPIC = os.getenv("MQTT_TOPIC_MOTOR")


class MotorRequest(BaseModel):
    action: str


# ---------------------------------------------------------
# Legacy endpoint (kept for compatibility)
# ---------------------------------------------------------
@router.post("/motor/")
def control_motor(data: MotorRequest):

    action = data.action.lower()

    if action not in ["start", "stop"]:
        raise HTTPException(
            status_code=400,
            detail="Action must be 'start' or 'stop'"
        )

    publish(TOPIC, action)

    return {
        "status": "published",
        "topic": TOPIC,
        "message": action
    }


# ---------------------------------------------------------
# Roadmap endpoint
# ---------------------------------------------------------
@router.post("/farms/{farm_id}/motor")
def control_farm_motor(
    farm_id: int,
    data: MotorRequest,
    session: Session = Depends(get_session)
):
    farm = session.exec(
        select(Farm).where(Farm.id == farm_id)
    ).first()

    if not farm:
        raise HTTPException(
            status_code=404,
            detail="Farm not found"
        )

    action = data.action.lower()

    if action not in ["start", "stop"]:
        raise HTTPException(
            status_code=400,
            detail="Action must be 'start' or 'stop'"
        )

    publish(TOPIC, action)

    log = MotorLog(
        farm_id=farm_id,
        action=action,
        status="sent"
    )

    session.add(log)
    session.commit()

    return {
        "status": "published",
        "farm": farm.name,
        "topic": TOPIC,
        "message": action
    }