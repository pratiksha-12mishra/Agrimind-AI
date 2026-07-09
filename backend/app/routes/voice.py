from fastapi import APIRouter

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.get("/")
def voice_placeholder():
    return {
        "status": "coming_soon",
        "message": "Voice module is under development."
    }