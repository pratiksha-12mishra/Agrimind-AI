from fastapi import APIRouter

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/")
def weather_placeholder():
    return {
        "status": "coming_soon",
        "message": "Weather module is under development."
    }