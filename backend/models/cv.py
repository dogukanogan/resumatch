from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class Education(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    year: Optional[str] = None


class ParsedCV(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: list[str] = []
    languages: list[str] = []
    experience: list[Experience] = []
    education: list[Education] = []


class CVProfile(BaseModel):
    id: str
    user_id: str
    file_name: str
    parsed_cv: ParsedCV
    cv_score: Optional[int] = None
    created_at: datetime
