from models.job import JobCreate


class JobService:
    async def list_jobs(self) -> list:
        return []

    async def create_job(self, job: JobCreate) -> dict:
        return job.model_dump()

    async def get_job(self, job_id: str) -> dict | None:
        return None
