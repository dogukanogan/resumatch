from typing import Optional
from models.job import JobCreate
from models.filters import WorkMode, JobType, ExperienceLevel, DatePosted


class JobService:
    async def list_jobs(
        self,
        query: Optional[str] = None,
        country: Optional[str] = None,
        city: Optional[str] = None,
        work_mode: Optional[list[WorkMode]] = None,
        job_type: Optional[list[JobType]] = None,
        experience_level: Optional[list[ExperienceLevel]] = None,
        date_posted: Optional[DatePosted] = None,
        salary_min: Optional[int] = None,
        salary_max: Optional[int] = None,
    ) -> list:
        # Will be replaced with Supabase query once DB tables are created
        return []

    async def create_job(self, job: JobCreate) -> dict:
        return job.model_dump()

    async def get_job(self, job_id: str) -> dict | None:
        return None
