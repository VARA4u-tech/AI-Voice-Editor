"""
Transcription routes — uses OpenAI Whisper to transcribe uploaded audio.
"""
import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from openai import AsyncOpenAI

from config import Settings, get_settings

router = APIRouter(prefix="/transcribe", tags=["Transcription"])


def get_openai_client(settings: Settings = Depends(get_settings)) -> AsyncOpenAI:
    if not settings.openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    return AsyncOpenAI(api_key=settings.openai_api_key)


@router.post("/audio")
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file (wav, mp3, webm, ogg, m4a)"),
    client: AsyncOpenAI = Depends(get_openai_client),
):
    """
    Transcribe an audio file using OpenAI Whisper.
    Accepts any browser-recordable format.
    """
    allowed_types = {
        "audio/wav", "audio/mpeg", "audio/mp3",
        "audio/webm", "audio/ogg", "audio/mp4",
        "audio/m4a", "audio/x-m4a", "video/webm",
    }

    content_type = file.content_type or ""
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported media type: {content_type}. Use wav, mp3, webm, ogg, or m4a.",
        )

    audio_bytes = await file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = file.filename or "audio.webm"

    try:
        transcript = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Whisper API error: {exc}") from exc

    return JSONResponse({
        "text": transcript.text,
        "language": getattr(transcript, "language", None),
        "duration": getattr(transcript, "duration", None),
        "segments": [
            {
                "id": s.id,
                "start": s.start,
                "end": s.end,
                "text": s.text,
            }
            for s in (getattr(transcript, "segments", None) or [])
        ],
    })
