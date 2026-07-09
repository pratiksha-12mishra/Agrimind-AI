from fastapi import APIRouter

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.get("/")
def get_farms():
    return {
        "status": "coming_soon",
        "message": "Farm endpoints are under development."
    }