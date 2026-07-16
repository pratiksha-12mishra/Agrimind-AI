from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Farm, User
from app.auth.dependencies import get_current_user

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


@router.get("/mine", response_model=List[Farm])
def list_my_farms(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    farms = session.exec(
        select(Farm).where(Farm.owner_id == current_user.id)
    ).all()
    return farms


# -----------------------------
# Device claiming
# -----------------------------

class ClaimDeviceRequest(BaseModel):
    device_id: str


@router.post("/{farm_id}/claim-device")
def claim_device(
    farm_id: int,
    data: ClaimDeviceRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    farm = session.exec(select(Farm).where(Farm.id == farm_id)).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    if farm.owner_id is not None and farm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Farm belongs to another user")

    existing = session.exec(
        select(Farm).where(Farm.device_id == data.device_id)
    ).first()
    if existing and existing.id != farm_id:
        raise HTTPException(status_code=400, detail="Device already claimed by another farm")

    farm.device_id = data.device_id
    farm.owner_id = current_user.id
    session.add(farm)
    session.commit()
    session.refresh(farm)

    return {"status": "claimed", "farm": farm.name, "device_id": farm.device_id}