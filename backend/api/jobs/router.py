from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models.job import JobCreate
from models.filters import WorkMode, JobType, ExperienceLevel, DatePosted
from models.filters import WORK_MODE_LABELS, JOB_TYPE_LABELS, EXPERIENCE_LEVEL_LABELS, DATE_POSTED_LABELS
from services.job_service import JobService

router = APIRouter()
job_service = JobService()


@router.get("/filters")
async def get_filter_options():
    return {
        "work_mode": [{"value": k.value, "label": v} for k, v in WORK_MODE_LABELS.items()],
        "job_type": [{"value": k.value, "label": v} for k, v in JOB_TYPE_LABELS.items()],
        "experience_level": [{"value": k.value, "label": v} for k, v in EXPERIENCE_LEVEL_LABELS.items()],
        "date_posted": [{"value": k.value, "label": v} for k, v in DATE_POSTED_LABELS.items()],
    }


@router.get("/")
async def list_jobs(
    query: Optional[str] = Query(None, description="Search by title or keyword"),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    work_mode: Optional[list[WorkMode]] = Query(None),
    job_type: Optional[list[JobType]] = Query(None),
    experience_level: Optional[list[ExperienceLevel]] = Query(None),
    date_posted: Optional[DatePosted] = Query(None),
    salary_min: Optional[int] = Query(None),
    salary_max: Optional[int] = Query(None),
):
    return await job_service.list_jobs(
        query=query,
        country=country,
        city=city,
        work_mode=work_mode,
        job_type=job_type,
        experience_level=experience_level,
        date_posted=date_posted,
        salary_min=salary_min,
        salary_max=salary_max,
    )


@router.post("/")
async def create_job(job: JobCreate):
    return await job_service.create_job(job)


@router.get("/{job_id}")
async def get_job(job_id: str):
    job = await job_service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
