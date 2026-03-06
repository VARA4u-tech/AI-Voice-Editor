"""
Document routes — upload a PDF and extract its text content.
"""
import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from auth import verify_supabase_token
import PyPDF2

router = APIRouter(prefix="/document", tags=["Document Processing"])


@router.post("/extract-text")
async def extract_text_from_pdf(
    file: UploadFile = File(..., description="PDF file to extract text from"),
    user=Depends(verify_supabase_token),
):
    """
    Extract plain text from an uploaded PDF file.
    Returns page-by-page text content.
    """
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=415,
            detail="Only PDF files are supported.",
        )

    pdf_bytes = await file.read()
    if len(pdf_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 25MB.")
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    try:
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages.append({"page": i + 1, "text": text.strip()})

        full_text = "\n\n".join(p["text"] for p in pages if p["text"])

    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}") from exc

    return JSONResponse({
        "filename": file.filename,
        "total_pages": len(reader.pages),
        "full_text": full_text,
        "pages": pages,
    })
