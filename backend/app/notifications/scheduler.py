from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlmodel import Session, select

from app.db.database import engine
from app.db.models import SensorReading, Notification, Farm, PushSubscription
from app.engine.decision_engine import decide_irrigation
from app.weather.openweather_client import get_weather
from app.notifications.push import send_web_push


def get_farms_with_devices():
    with Session(engine) as session:
        return session.exec(
            select(Farm).where(Farm.device_id.is_not(None))
        ).all()


def get_latest_reading_for_device(device_id: str):
    with Session(engine) as session:
        return session.exec(
            select(SensorReading)
            .where(SensorReading.device_id == device_id)
            .order_by(SensorReading.created_at.desc())
        ).first()


def get_subscriptions_for_user(user_id: int):
    with Session(engine) as session:
        return session.exec(
            select(PushSubscription).where(PushSubscription.user_id == user_id)
        ).all()


async def check_and_notify():
    try:
        print("\n========== CHECK AND NOTIFY START ==========")

        farms = get_farms_with_devices()
        print(f"Farms with claimed devices: {len(farms)}")

        if not farms:
            print("⏭️  No farms with claimed devices yet, skipping")
            print("========== CHECK AND NOTIFY END ==========\n")
            return

        for farm in farms:
            print(f"\n--- Checking farm: {farm.name} (device={farm.device_id}) ---")

            latest = get_latest_reading_for_device(farm.device_id)
            print("Latest sensor:", latest)

            if not latest:
                print(f"⏭️  No sensor readings yet for {farm.device_id}, skipping")
                continue

            weather = get_weather(farm.city)
            print("Weather:", weather)

            if "error" in weather:
                print(f"❌ Weather fetch failed for {farm.city}")
                continue

            result = decide_irrigation(
                crop=farm.crop,
                growth_stage=farm.growth_stage,
                soil_moisture=latest.soil_moisture,
                temperature=latest.temperature if latest.temperature is not None else weather["temperature"],
                humidity=latest.humidity if latest.humidity is not None else weather["humidity"],
                rain_probability=weather["rain_probability"],
            )
            print("Decision:", result)

            notification_data = {
                "title": f"AgriMind AI — {farm.name} Update",
                "message": result["explanation"],
                "decision": result["decision"],
                "soil_moisture": latest.soil_moisture,
                "timestamp": datetime.utcnow().isoformat(),
            }

            with Session(engine) as session:
                notification = Notification(
                    title=notification_data["title"],
                    message=notification_data["message"],
                    farm_id=farm.id,
                )
                session.add(notification)
                session.commit()

            print("Notification saved to DB")

            if farm.owner_id:
                subscriptions = get_subscriptions_for_user(farm.owner_id)
                send_web_push(notification_data, subscriptions)
            else:
                print("⏭️  Farm has no owner, skipping push")

            print(f"✅ Done: {farm.name} — {result['decision']}")

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