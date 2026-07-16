import os
import json
from pywebpush import webpush
from app.db.models import PushSubscription

VAPID_PRIVATE_KEY_PATH = os.getenv("VAPID_PRIVATE_KEY_PATH", "vapid_private.pem")
VAPID_EMAIL = os.getenv("VAPID_EMAIL", "mailto:agrimindai@gmail.com")


def send_web_push(notification: dict, subscriptions: list[PushSubscription]):
    """Send a web push notification to the given list of subscriptions."""
    if not subscriptions:
        print("⏭️  No push subscriptions for this farm's owner, skipping web push")
        return

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
                vapid_private_key=VAPID_PRIVATE_KEY_PATH,
                vapid_claims={"sub": VAPID_EMAIL},
            )
            print(f"✅ Push sent to {sub.endpoint[:40]}...")
        except Exception as e:
            print(f"❌ Push failed for {sub.endpoint[:40]}...: {e}")