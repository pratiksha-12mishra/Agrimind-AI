import os
import ssl

from dotenv import load_dotenv
import paho.mqtt.client as mqtt

load_dotenv()

BROKER = os.getenv("MQTT_BROKER")
PORT = int(os.getenv("MQTT_PORT", 8883))
USERNAME = os.getenv("MQTT_USERNAME")
PASSWORD = os.getenv("MQTT_PASSWORD")


client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION2,
    client_id="agrimind-backend"
)

client.username_pw_set(USERNAME, PASSWORD)
client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)


def connect():
    client.connect(BROKER, PORT)
    client.loop_start()
    print("✅ Connected to HiveMQ")


def publish(topic: str, message: str):
    result = client.publish(topic, message)

    if result.rc == mqtt.MQTT_ERR_SUCCESS:
        print(f"✅ Published to {topic}: {message}")
    else:
        print(f"❌ Publish failed. Code: {result.rc}")