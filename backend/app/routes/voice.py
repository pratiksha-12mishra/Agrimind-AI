from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.voice.gemini_voice import get_voice_response

router = APIRouter(prefix="/voice", tags=["Voice"])


class VoiceRequest(BaseModel):
    query: str
    language: str = "en"
    farm_context: Optional[dict] = None


@router.post("/")
def voice_assistant(data: VoiceRequest):
    try:
        result = get_voice_response(
            query=data.query,
            language=data.language,
            farm_context=data.farm_context,
        )
        return result

    except Exception as e:
        print(f"[VOICE ERROR] {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Voice assistant failed: {str(e)}"
        )