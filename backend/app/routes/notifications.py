from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Notification, PushSubscription

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# -----------------------------
# Notification CRUD
# -----------------------------

class NotificationRequest(BaseModel):
    title: str
    message: str


@router.post("/", response_model=Notification)
def create_notification(
    data: NotificationRequest,
    session: Session = Depends(get_session)
):
    notification = Notification(
        title=data.title,
        message=data.message,
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification


@router.get("/", response_model=List[Notification])
def get_notifications(
    session: Session = Depends(get_session)
):
    notifications = session.exec(
        select(Notification).order_by(
            Notification.created_at.desc()
        )
    ).all()

    return notifications


# -----------------------------
# Web Push Subscription
# -----------------------------

class PushKeys(BaseModel):
    p256dh: str
    auth: str


class PushSubscriptionRequest(BaseModel):
    endpoint: str
    keys: PushKeys
    farm_id: int


@router.post("/push/subscribe")
def subscribe_push(
    data: PushSubscriptionRequest,
    session: Session = Depends(get_session),
):
    existing = session.exec(
        select(PushSubscription).where(
            PushSubscription.endpoint == data.endpoint
        )
    ).first()

    if existing:
        existing.farm_id = data.farm_id
        session.add(existing)
        session.commit()
        return {"status": "already subscribed, farm updated"}

    try:
        subscription = PushSubscription(
            endpoint=data.endpoint,
            p256dh=data.keys.p256dh,
            auth=data.keys.auth,
            farm_id=data.farm_id,
        )

        session.add(subscription)
        session.commit()

        return {
            "status": "subscribed",
            "endpoint": data.endpoint,
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save subscription: {str(e)}"
        )


# -----------------------------
# Manual Notification Trigger
# -----------------------------

@router.post("/trigger-check")
async def trigger_check():
    """
    Manually trigger the hourly irrigation check.
    Useful during hackathon demo.
    """
    from app.notifications.scheduler import check_and_notify

    await check_and_notify()

    return {
        "status": "triggered"
    }

@router.get("/debug/vapid-key")
def debug_vapid_key():
    from py_vapid import Vapid
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
    import base64
    import os

    path = os.getenv("VAPID_PRIVATE_KEY_PATH", "vapid_private.pem")

    try:
        v = Vapid.from_file(private_key_file=path)
        raw = v.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
        b64 = base64.urlsafe_b64encode(raw).rstrip(b'=').decode()
        return {
            "resolved_path": os.path.abspath(path),
            "file_exists": os.path.exists(path),
            "public_key": b64,
        }
    except Exception as e:
        return {
            "resolved_path": os.path.abspath(path),
            "file_exists": os.path.exists(path),
            "error": str(e),
        }