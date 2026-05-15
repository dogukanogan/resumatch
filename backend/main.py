from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.cv.router import router as cv_router
from api.jobs.router import router as jobs_router
from api.ai.router import router as ai_router
from api.ai.skill_gap_router import router as skill_gap_router

app = FastAPI(title="Resumatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router, prefix="/api/cv", tags=["cv"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])
app.include_router(skill_gap_router, prefix="/api/ai", tags=["skill-gap"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
