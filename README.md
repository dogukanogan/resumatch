# Resumatch

AI-powered CV analysis and job matching platform. Upload your CV, let AI parse and analyze it, then get matched with the best opportunities — complete with skill gap insights and LinkedIn alignment scoring. Built for both job seekers and companies.

---

## Features

- **CV Parsing** — Upload PDF or DOCX, AI extracts name, skills, experience, education automatically
- **Smart Job Matching** — Semantic matching beyond keyword search using vector embeddings
- **Skill Gap Analysis** — See exactly what's missing for your target role, with course recommendations
- **CV Quality Score** — ATS compatibility and completeness rating (0–100)
- **LinkedIn Alignment** — Compare your CV against your LinkedIn profile, surface inconsistencies
- **Company Panel** — Post jobs, browse applicants, auto-rank candidates

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI (Python 3.11+) |
| AI | Google Gemini 2.0 Flash |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth & Storage | Supabase |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- [Supabase](https://supabase.com) account (free)
- [Google AI Studio](https://aistudio.google.com) API key (free)

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Runs at `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
uvicorn main:app --reload
```

Runs at `http://localhost:8000` — API docs at `http://localhost:8000/docs`

---

## Environment Variables

### `backend/.env`

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_ai_studio_api_key
ENVIRONMENT=development
```

### `frontend/.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Project Structure

```
resumatch/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── upload/           # CV upload & analysis
│   │   ├── dashboard/        # User dashboard
│   │   └── matches/          # Job matches
│   ├── components/ui/        # shadcn/ui components
│   └── lib/                  # Supabase client, utilities
│
└── backend/                  # FastAPI server
    ├── main.py               # App entry point
    ├── api/
    │   ├── cv/               # CV upload & retrieval
    │   ├── jobs/             # Job listing CRUD
    │   └── ai/               # Matching & scoring endpoints
    ├── models/               # Pydantic schemas (CV, Job)
    ├── services/             # Business logic
    │   ├── cv_service.py     # PDF/DOCX parsing + AI extraction
    │   ├── job_service.py    # Job management
    │   └── matching_service.py # Semantic matching logic
    └── core/                 # Config, DB & AI clients
```

---

## Roadmap

- [x] Project scaffold (frontend + backend)
- [x] Google Gemini AI integration
- [x] Supabase setup
- [ ] Database schema (profiles, jobs, matches)
- [ ] CV upload → parse → store flow
- [ ] Job listing management
- [ ] Semantic job matching with pgvector
- [ ] Skill gap analysis
- [ ] CV quality scoring
- [ ] LinkedIn alignment score
- [ ] Company panel
