"""
FastAPI Backend App Entrypoint.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
import uvicorn

# Import routers from the routes package
from routes.transcription import router as transcription_router
from routes.editing import router as editing_router
from routes.document import router as document_router
from routes.nlp import router as nlp_router

# Initialize the main FastAPI application
app = FastAPI(
    title="AI Voice Editor Backend",
    description="Backend services for transcription, AI editing, and document processing.",
    version="1.0.0",
)

# Load configuration settings
settings = get_settings()

# Setup Cross-Origin Resource Sharing (CORS)
# This allows the Vite UI (usually at http://localhost:8080 or port 5173) to reach this server.
origins = [
    settings.frontend_origin,
    "http://localhost:5173", # Vite's default port
    "http://localhost:8080", # Vite's alternative port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all module routers under the main app
app.include_router(transcription_router)
app.include_router(editing_router)
app.include_router(document_router)
app.include_router(nlp_router)

@app.get("/", tags=["Health"])
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "app": "AI Voice Editor System"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
