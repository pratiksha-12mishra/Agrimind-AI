from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import RecommendationHistory

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/", response_model=List[RecommendationHistory])
def get_history(
    session: Session = Depends(get_session)
):
    history = session.exec(
        select(RecommendationHistory).order_by(
            RecommendationHistory.created_at.desc()
        )
    ).all()

    return history