# Resumatch

AI-powered CV analysis and job matching platform. Upload your CV, get it parsed by AI, match with job listings, discover skill gaps, and receive a LinkedIn alignment score.

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python)
- **AI**: Claude API
- **Database**: Supabase (PostgreSQL + pgvector)
- **Auth & Storage**: Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account
- Anthropic API key

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your environment variables
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your environment variables
uvicorn main:app --reload
```

## Project Structure

```
resumatch/
├── frontend/     # Next.js app
│   ├── app/      # App router pages
│   ├── components/
│   └── lib/
└── backend/      # FastAPI server
    ├── api/      # Route handlers
    ├── models/   # Pydantic models
    ├── services/ # Business logic
    └── core/     # Config, DB clients
```
