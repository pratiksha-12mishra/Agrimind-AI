import os
import ssl
import json

from dotenv import load_dotenv
import paho.mqtt.client as mqtt

from app.db.database import engine
from app.db.models import SensorReading
from sqlmodel import Session

load_dotenv()

BROKER = os.getenv("MQTT_BROKER")
PORT = int(os.getenv("MQTT_PORT", 8883))
USERNAME = os.getenv("MQTT_USERNAME")
PASSWORD = os.getenv("MQTT_PASSWORD")

SENSOR_TOPIC = "agrimind/sensor"


client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION2,
    client_id="agrimind-backend"
)

client.username_pw_set(USERNAME, PASSWORD)
client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)


def save_sensor_reading(payload: dict):
    """Save an incoming sensor payload to the sensor_reading table."""
    try:
        reading = SensorReading(
            device_id=payload.get("device_id", "unknown"),
            soil_moisture=payload["soil_moisture"],
            temperature=payload.get("temperature"),
            humidity=payload.get("humidity"),
            motor_running=payload.get("motor_running"),
        )
        with Session(engine) as session:
            session.add(reading)
            session.commit()
        print(f"✅ Saved sensor reading: {payload}")
    except Exception as e:
        print(f"❌ Failed to save sensor reading: {e}")

def on_message(client, userdata, message):
    try:
        payload = json.loads(message.payload.decode())
        print(f"📩 Received on {message.topic}: {payload}")
        if message.topic == SENSOR_TOPIC:
            save_sensor_reading(payload)
    except Exception as e:
        print(f"❌ Failed to process message: {e}")


client.on_message = on_message


def connect():
    try:
        print("Connecting to HiveMQ...")

        client.connect(BROKER, PORT, keepalive=60)

        client.loop_start()

        client.subscribe(SENSOR_TOPIC)

        print(f"✅ Connected to HiveMQ, subscribed to {SENSOR_TOPIC}")

    except Exception as e:
        print(f"❌ MQTT connection failed: {e}")
        raise


def publish(topic: str, message: str):
    result = client.publish(topic, message)

    if result.rc == mqtt.MQTT_ERR_SUCCESS:
        print(f"✅ Published to {topic}: {message}")
    else:
        print(f"❌ Publish failed. Code: {result.rc}")