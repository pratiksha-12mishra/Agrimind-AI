from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


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