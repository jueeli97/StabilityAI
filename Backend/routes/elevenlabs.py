from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx, os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

class SpeakRequest(BaseModel):
    text: str

@router.post("/")
async def speak(body: SpeakRequest):
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")
    api_key = os.getenv("ELEVENLABS_API_KEY")

    print(f"DEBUG: voice_id={voice_id}, api_key starts with={api_key[:8] if api_key else 'MISSING'}")
    print(f"DEBUG: Calling ElevenLabs API...")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={
                "xi-api-key": api_key,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg"
            },
            json={
                "text": body.text,
                "model_id": "eleven_turbo_v2",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
            },
            timeout=30
        )
        print(f"DEBUG: ElevenLabs response status={response.status_code}")
        print(f"DEBUG: Response content length={len(response.content)}")

    return StreamingResponse(
        iter([response.content]),
        media_type="audio/mpeg"
    )