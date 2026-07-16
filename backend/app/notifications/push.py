import os
import json
from pywebpush import webpush, WebPushException
from sqlmodel import Session, select

from app.db.database import engine
from app.db.models import PushSubscription

VAPID_PRIVATE_KEY_PATH = os.getenv("VAPID_PRIVATE_KEY_PATH", "vapid_private.pem")
VAPID_EMAIL = os.getenv("VAPID_EMAIL", "mailto:agrimindai@gmail.com")


def _load_vapid_private_key() -> str:
    with open(VAPID_PRIVATE_KEY_PATH, "r") as f:
        return f.read()


def send_web_push(notification: dict):
    """Send a web push notification to all subscribed clients."""
    with Session(engine) as session:
        subscriptions = session.exec(select(PushSubscription)).all()

    if not subscriptions:
        print("⏭️  No push subscriptions yet, skipping web push")
        return

    private_key = _load_vapid_private_key()

    payload = json.dumps({
        "title": notification["title"],
        "body": notification["message"],
        "decision": notification.get("decision"),
    })

    for sub in subscriptions:
        subscription_info = {
            "endpoint": sub.endpoint,
            "keys": {
                "p256dh": sub.p256dh,
                "auth": sub.auth,
            },
        }
        try:
            webpush(
                subscription_info=subscription_info,
                data=payload,
                vapid_private_key=private_key,
                vapid_claims={"sub": VAPID_EMAIL},
            )
            print(f"✅ Push sent to {sub.endpoint[:40]}...")
        except WebPushException as e:
            print(f"❌ Push failed for {sub.endpoint[:40]}...: {e}")