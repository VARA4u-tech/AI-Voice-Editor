"""
Routes package — exposes all API routers.
"""
from routes.transcription import router as transcription_router
from routes.editing import router as editing_router
from routes.document import router as document_router
from routes.nlp import router as nlp_router

__all__ = ["transcription_router", "editing_router", "document_router", "nlp_router"]
