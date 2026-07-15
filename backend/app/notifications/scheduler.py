from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlmodel import Session, select

from app.db.database import engine
from app.db.models import SensorReading, Notification
from app.engine.decision_engine import decide_irrigation
from app.weather.openweather_client import get_weather
from app.notifications.push import send_web_push

DEFAULT_CROP = "wheat"
DEFAULT_STAGE = "vegetative"
DEFAULT_CITY = "Jabalpur"


def get_latest_sensor_reading():
    with Session(engine) as session:
        return session.exec(
            select(SensorReading).order_by(SensorReading.created_at.desc())
        ).first()


async def check_and_notify():
    try:
        print("\n========== CHECK AND NOTIFY START ==========")

        latest = get_latest_sensor_reading()
        print("Latest sensor:", latest)

        if not latest:
            print("⏭️ No sensor readings found")
            return

        weather = get_weather(DEFAULT_CITY)
        print("Weather:", weather)

        if "error" in weather:
            print("❌ Weather fetch failed")
            return

        result = decide_irrigation(
            crop=DEFAULT_CROP,
            growth_stage=DEFAULT_STAGE,
            soil_moisture=latest.soil_moisture,
            temperature=latest.temperature if latest.temperature is not None else weather["temperature"],
            humidity=latest.humidity if latest.humidity is not None else weather["humidity"],
            rain_probability=weather["rain_probability"],
        )

        print("Decision:", result)

        notification_data = {
            "title": "AgriMind AI — Farm Update",
            "message": result["explanation"],
            "decision": result["decision"],
            "soil_moisture": latest.soil_moisture,
            "timestamp": datetime.utcnow().isoformat(),
        }

        with Session(engine) as session:
            notification = Notification(
                title=notification_data["title"],
                message=notification_data["message"],
            )
            session.add(notification)
            session.commit()

        print("Notification saved to DB")

        send_web_push(notification_data)

        print("Web push function completed")
        print("========== CHECK AND NOTIFY END ==========\n")

    except Exception as e:
        import traceback
        print("\n========== ERROR ==========")
        traceback.print_exc()
        print("===========================\n")
        raise


scheduler = AsyncIOScheduler()
scheduler.add_job(check_and_notify, "interval", hours=1)


def start_scheduler():
    scheduler.start()
    print("✅ Hourly notification scheduler started")