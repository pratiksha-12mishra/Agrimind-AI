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


@router.post("/push/subscribe")
def subscribe_push(
    data: PushSubscriptionRequest,
    session: Session = Depends(get_session)
):
    existing = session.exec(
        select(PushSubscription).where(
            PushSubscription.endpoint == data.endpoint
        )
    ).first()

    if existing:
        return {"status": "already subscribed"}

    try:
        subscription = PushSubscription(
            endpoint=data.endpoint,
            p256dh=data.keys.p256dh,
            auth=data.keys.auth,
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