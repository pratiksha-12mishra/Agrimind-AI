from fastapi import APIRouter
from pydantic import BaseModel
import json
import os

from app.mqtt.client import publish

router = APIRouter(prefix="/motor", tags=["Motor"])

TOPIC = os.getenv("MQTT_TOPIC_MOTOR")


class MotorRequest(BaseModel):
    action: str  # ON or OFF


@router.post("/")
@router.post("/")
def control_motor(data: MotorRequest):

    message = {
        "action": data.action.upper()
    }

    print("TOPIC =", TOPIC)
    print("MESSAGE =", json.dumps(message))

    publish(TOPIC, json.dumps(message))

    return {
        "status": "published",
        "topic": TOPIC,
        "message": message
    }