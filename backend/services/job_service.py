from typing import Optional
from core.supabase import supabase
from models.job import JobCreate
from models.filters import WorkMode, JobType, ExperienceLevel, DatePosted
from datetime import datetime, timedelta, timezone


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
        q = supabase.table("job_listings").select("*")

        if country:
            q = q.ilike("country", f"%{country}%")
        if city:
            q = q.ilike("city", f"%{city}%")
        if work_mode:
            q = q.in_("work_mode", [m.value for m in work_mode])
        if job_type:
            q = q.in_("job_type", [t.value for t in job_type])
        if experience_level:
            q = q.in_("experience_level", [l.value for l in experience_level])
        if salary_min:
            q = q.gte("salary_max", salary_min)
        if salary_max:
            q = q.lte("salary_min", salary_max)
        if date_posted and date_posted != DatePosted.ANY_TIME:
            delta = {
                DatePosted.PAST_24H: timedelta(hours=24),
                DatePosted.PAST_WEEK: timedelta(weeks=1),
                DatePosted.PAST_MONTH: timedelta(days=30),
            }.get(date_posted)
            if delta:
                since = (datetime.now(timezone.utc) - delta).isoformat()
                q = q.gte("created_at", since)

        result = q.order("created_at", desc=True).execute()

        jobs = result.data
        if query:
            query_lower = query.lower()
            jobs = [j for j in jobs if query_lower in j["title"].lower() or query_lower in j["description"].lower()]

        return jobs

    async def create_job(self, job: JobCreate) -> dict:
        row = job.model_dump()
        if row.get("work_mode"):
            row["work_mode"] = row["work_mode"].value if hasattr(row["work_mode"], "value") else row["work_mode"]
        if row.get("job_type"):
            row["job_type"] = row["job_type"].value if hasattr(row["job_type"], "value") else row["job_type"]
        if row.get("experience_level"):
            row["experience_level"] = row["experience_level"].value if hasattr(row["experience_level"], "value") else row["experience_level"]

        result = supabase.table("job_listings").insert(row).execute()
        return result.data[0]

    async def get_job(self, job_id: str) -> dict | None:
        result = supabase.table("job_listings").select("*").eq("id", job_id).execute()
        return result.data[0] if result.data else None
