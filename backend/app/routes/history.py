from fastapi import APIRouter

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/")
def history_placeholder():
    return {
        "status": "coming_soon",
        "message": "History module is under development."
    }