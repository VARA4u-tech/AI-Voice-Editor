"""
AI editing routes — uses GPT-4o to improve/edit transcribed text.
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from auth import verify_supabase_token
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI

from config import Settings, get_settings

router = APIRouter(prefix="/edit", tags=["AI Text Editing"])


def get_openai_client(settings: Settings = Depends(get_settings)) -> AsyncOpenAI:
    if not settings.openrouter_api_key:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    return AsyncOpenAI(
        api_key=settings.openrouter_api_key,
        base_url="https://openrouter.ai/api/v1",
    )


class EditRequest(BaseModel):
    text: str
    instruction: str = "Fix grammar, punctuation, and clarity. Keep the original meaning."
    model: str = "openai/gpt-4o-mini"


class EditResponse(BaseModel):
    original: str
    edited: str
    model: str


class ChatRequest(BaseModel):
    model: str
    messages: List[Dict[str, Any]]
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = 1024


SYSTEM_PROMPT = (
    "You are an expert editor for spoken-word transcriptions. "
    "The user will give you a raw transcription and an editing instruction. "
    "Apply the instruction precisely. Output ONLY the edited text — no explanations, no markdown."
)


@router.post("/text", response_model=EditResponse)
async def edit_text(
    body: EditRequest,
    client: AsyncOpenAI = Depends(get_openai_client),
    user=Depends(verify_supabase_token),
):
    """Edit / improve a transcription with GPT."""
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    user_message = f"Instruction: {body.instruction}\n\nText:\n{body.text}"

    try:
        response = await client.chat.completions.create(
            model=body.model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {exc}") from exc

    edited = response.choices[0].message.content or ""
    return EditResponse(original=body.text, edited=edited.strip(), model=body.model)


@router.post("/text/stream")
async def edit_text_stream(
    body: EditRequest,
    client: AsyncOpenAI = Depends(get_openai_client),
    user=Depends(verify_supabase_token),
):
    """Stream edited text token-by-token using Server-Sent Events."""
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    user_message = f"Instruction: {body.instruction}\n\nText:\n{body.text}"

    async def token_generator():
        try:
            async with client.chat.completions.stream(
                model=body.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                temperature=0.3,
            ) as stream:
                async for text in stream.text_stream:
                    yield f"data: {text}\n\n"
        except Exception as exc:
            yield f"data: [ERROR] {exc}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(token_generator(), media_type="text/event-stream")

@router.post("/chat")
async def proxy_chat(
    body: ChatRequest,
    client: AsyncOpenAI = Depends(get_openai_client),
    user=Depends(verify_supabase_token),
):
    """Secure proxy for frontend chat completions."""
    try:
        response = await client.chat.completions.create(
            model=body.model,
            messages=body.messages,
            temperature=body.temperature,
            max_tokens=body.max_tokens,
        )
        # return the raw dict so it matches OpenAI response format expected by frontend
        return response.model_dump()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {exc}") from exc
