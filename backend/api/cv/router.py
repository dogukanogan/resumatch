from fastapi import APIRouter, UploadFile, File, HTTPException
from services.cv_service import CVService

router = APIRouter()
cv_service = CVService()


@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted")

    content = await file.read()
    result = await cv_service.process_cv(content, file.filename, file.content_type)
    return result


@router.get("/")
async def list_cvs():
    return await cv_service.list_cvs()


@router.get("/{cv_id}")
async def get_cv(cv_id: str):
    cv = await cv_service.get_cv(cv_id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    return cv
