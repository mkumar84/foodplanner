# Family Food Planner

An AI-powered weekly meal planner for families. Enter your family members, their dietary restrictions, allergies, and cuisine preferences — the app generates a personalised 7-day meal plan and grocery list.

## Features

- Per-member dietary profiles (allergies, diet style, nutrition goals, cuisine preferences)
- AI-generated 7-day meal plan via Claude (Anthropic)
- Swap any meal with one click — AI suggests a replacement
- Auto-generated grocery list grouped by supermarket aisle
- Mock Instacart cart export
- Google sign-in via Supabase (optional — works without auth in demo mode)

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| State | Zustand (persisted to localStorage) |
| Backend | Python FastAPI + Anthropic Claude API |
| Auth | Supabase Google OAuth (optional) |
| Deploy | Vercel (frontend) + Render (backend) |

## Project structure

```
Food Planner/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # Onboarding, Planner, Family, Grocery, Recipes
│   │   ├── store/     # Zustand store
│   │   ├── lib/       # API client, utils, seed data
│   │   └── types/     # TypeScript interfaces
│   └── vercel.json    # SPA routing config
└── backend/           # FastAPI app
    ├── main.py
    ├── app/
    │   ├── agents.py  # Claude AI agents
    │   ├── models.py  # Pydantic models
    │   └── routers/
    └── render.yaml    # Render deploy config
```

## Local development

### Prerequisites

- Node.js 18+
- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com/)

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api` to `http://localhost:8000` automatically.

## Deployment (Vercel + Render)

### 1. Deploy backend on Render

1. New → Web Service → connect your GitHub repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment variables:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `CORS_ORIGINS` — your Vercel frontend URL (fill in after step 2)

Note your Render URL (e.g. `https://food-planner-api.onrender.com`).

### 2. Deploy frontend on Vercel

1. New Project → import your GitHub repo
2. Root directory: `frontend`
3. Framework preset: Vite (auto-detected)
4. Environment variables:
   - `VITE_API_URL` — your Render backend URL (no trailing slash)
5. Deploy

Note your Vercel URL (e.g. `https://food-planner.vercel.app`).

### 3. Update CORS on Render

Set `CORS_ORIGINS` to your Vercel URL. Render redeploys automatically.

## Environment variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `CORS_ORIGINS` | Yes (prod) | Comma-separated list of allowed frontend origins |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes (prod) | Backend base URL — leave unset for local dev |
| `VITE_SUPABASE_URL` | No | Supabase project URL (auth is disabled without this) |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key |
