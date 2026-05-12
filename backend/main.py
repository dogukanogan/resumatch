from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.cv.router import router as cv_router
from api.jobs.router import router as jobs_router
from api.ai.router import router as ai_router

app = FastAPI(title="Resumatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router, prefix="/api/cv", tags=["cv"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["jobs"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
