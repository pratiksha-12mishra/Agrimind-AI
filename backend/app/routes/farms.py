from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Farm

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.post("/", response_model=Farm)
def create_farm(
    farm: Farm,
    session: Session = Depends(get_session)
):
    session.add(farm)
    session.commit()
    session.refresh(farm)
    return farm


@router.get("/", response_model=List[Farm])
def list_farms(
    session: Session = Depends(get_session)
):
    farms = session.exec(select(Farm)).all()
    return farms