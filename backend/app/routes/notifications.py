from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/")
def notifications_placeholder():
    return {
        "status": "coming_soon",
        "message": "Notifications module is under development."
    }