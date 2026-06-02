# Family Food Planner — Setup Guide

## Quick start (frontend only, demo mode)

```powershell
cd frontend
npm run dev
```
Open http://localhost:5173 — the app works fully in demo mode without any backend or Supabase.

---

## Full setup (AI meal generation)

### 1. Backend `.env`
Edit `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 2. Frontend `.env` (optional — for Google login)
Edit `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Supabase setup:**
1. Create a project at supabase.com
2. Go to Authentication → Providers → enable Google
3. Copy your Project URL and anon key into `frontend/.env`

### 3. Start both servers
```powershell
.\start.ps1
```
Or separately:
```powershell
# Terminal 1
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2
cd frontend && npm run dev
```

---

## What each page does

| Page | URL | What it shows |
|---|---|---|
| Landing | `/` | Marketing page with CTA |
| Onboarding | `/onboarding` | 3-step family setup |
| Planner | `/planner` | 7-day meal grid with budget bar |
| Grocery | `/grocery` | Shopping list by aisle + Instacart |
| Recipes | `/recipes` | Recipe library with search/filter |
| Family | `/family` | Member profiles + AI insights |

## Deploying to Render

**Backend:**
- Root dir: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add env var: `ANTHROPIC_API_KEY`

**Frontend:**
- Root dir: `frontend`
- Build: `npm run build`
- Publish dir: `dist`
- Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
