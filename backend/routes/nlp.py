"""
NLP routes — Text analysis and language identification.
"""
from fastapi import APIRouter, HTTPException, Depends
from auth import verify_supabase_token
from pydantic import BaseModel
import langdetect
from langdetect.lang_detect_exception import LangDetectException

# Ensure consistent results
langdetect.DetectorFactory.seed = 0

router = APIRouter(prefix="/nlp", tags=["NLP Processing"])

class TextRequest(BaseModel):
    text: str

# Dictionary mapping ISO 639-1 language codes to human-readable names
# This covers Hindi, Telugu, and English as priorities, plus generic fallback.
LANGUAGE_MAP = {
    "hi": "Hindi",
    "te": "Telugu",
    "en": "English",
    "ta": "Tamil",
    "ml": "Malayalam",
    "kn": "Kannada",
    "mr": "Marathi",
    "gu": "Gujarati",
    "bn": "Bengali",
    "pa": "Punjabi",
    "ur": "Urdu",
    "fr": "French",
    "es": "Spanish",
    "de": "German"
}

@router.post("/detect-language")
async def detect_language(
    body: TextRequest,
    user=Depends(verify_supabase_token),
):
    """
    Identifies the language of the provided text.
    Specifically supports detecting Hindi ('hi') and Telugu ('te').
    """
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    try:
        # Detect top matches and probabilities
        langs = langdetect.detect_langs(body.text)
        
        detections = []
        for l in langs:
            lang_name = LANGUAGE_MAP.get(l.lang, l.lang) # Fallback to code if unknown
            detections.append({
                "language_code": l.lang,
                "language_name": lang_name,
                "probability": l.prob
            })
            
        return {
            "detected_code": detections[0]["language_code"],
            "detected_name": detections[0]["language_name"],
            "confidence": detections[0]["probability"],
            "all_matches": detections
        }
        
    except LangDetectException as exc:
        raise HTTPException(status_code=422, detail="Text is too short or ambiguous to detect language.") from exc
