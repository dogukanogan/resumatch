from fastapi import APIRouter
from pydantic import BaseModel
from services.skill_gap_service import SkillGapService

router = APIRouter()
service = SkillGapService()

class SkillGapRequest(BaseModel):
    cv_id: str
    target_role: str

@router.post("/skill-gap")
async def analyze_skill_gap(body: SkillGapRequest):
    result = await service.analyze(body.cv_id, body.target_role)
    return result
