# NextGen Agency OS - public site + API

- `frontend-public/` - client-facing website (React + Vite)
- `backend/` - FastAPI API (Postgres in production)

The Admin Panel is intentionally **not** part of this repository.

## Local run
    cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
    cp .env.example .env && uvicorn app.main:app --reload
    cd ../frontend-public && npm install && npm run dev

Tests: `cd backend && pip install pytest && pytest tests`

Secrets are read from environment variables only - never commit `.env`.
See `PUBLISH.md` for deployment.
