from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobListing(BaseModel):
    id: Optional[str] = None
    company_id: Optional[str] = None
    title: str
    company_name: str
    description: str
    requirements: list[str] = []
    location: Optional[str] = None
    remote: bool = False
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    created_at: Optional[datetime] = None


class JobCreate(BaseModel):
    title: str
    company_name: str
    description: str
    requirements: list[str] = []
    location: Optional[str] = None
    remote: bool = False
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
