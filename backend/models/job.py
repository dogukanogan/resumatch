from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.filters import WorkMode, JobType, ExperienceLevel


class JobListing(BaseModel):
    id: Optional[str] = None
    company_id: Optional[str] = None
    title: str
    company_name: str
    description: str
    requirements: list[str] = []
    country: Optional[str] = None
    city: Optional[str] = None
    work_mode: Optional[WorkMode] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    created_at: Optional[datetime] = None


class JobCreate(BaseModel):
    title: str
    company_name: str
    description: str
    requirements: list[str] = []
    country: Optional[str] = None
    city: Optional[str] = None
    work_mode: Optional[WorkMode] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"


class JobFilters(BaseModel):
    query: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    work_mode: Optional[list[WorkMode]] = None
    job_type: Optional[list[JobType]] = None
    experience_level: Optional[list[ExperienceLevel]] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
