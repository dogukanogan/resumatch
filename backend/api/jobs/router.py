from fastapi import APIRouter, HTTPException
from models.job import JobCreate
from services.job_service import JobService

router = APIRouter()
job_service = JobService()


@router.get("/")
async def list_jobs():
    return await job_service.list_jobs()


@router.post("/")
async def create_job(job: JobCreate):
    return await job_service.create_job(job)


@router.get("/{job_id}")
async def get_job(job_id: str):
    job = await job_service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
