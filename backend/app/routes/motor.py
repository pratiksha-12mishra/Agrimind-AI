from fastapi import APIRouter

router = APIRouter(prefix="/motor", tags=["Motor"])


@router.get("/")
def motor_placeholder():
    return {
        "status": "coming_soon",
        "message": "Motor module is under development."
    }