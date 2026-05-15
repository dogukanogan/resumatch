from fastapi import APIRouter
from services.matching_service import MatchingService

router = APIRouter()
matching_service = MatchingService()


@router.post("/match/{cv_id}")
async def match_jobs(cv_id: str):
    matches = await matching_service.match_jobs(cv_id)
    return {"matches": matches}


@router.get("/matches/{cv_id}")
async def get_matches(cv_id: str):
    matches = await matching_service.get_matches(cv_id)
    return {"matches": matches}


@router.get("/score/{cv_id}")
async def get_cv_score(cv_id: str):
    score = await matching_service.calculate_cv_score(cv_id)
    return {"score": score}
