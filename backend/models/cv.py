from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Experience(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None


class Education(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    year: Optional[str] = None


class Links(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    other: list[str] = []


class ParsedCV(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: list[str] = []
    languages: list[str] = []
    links: Optional[Links] = None
    experience: list[Experience] = []
    education: list[Education] = []


class CVProfile(BaseModel):
    id: str
    user_id: str
    file_name: str
    parsed_cv: ParsedCV
    cv_score: Optional[int] = None
    created_at: datetime
