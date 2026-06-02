# Frontend — Family Food Planner

React 19 + TypeScript + Vite + Tailwind CSS

See the [root README](../README.md) for full setup and deployment instructions.

## Local development

```bash
npm install
npm run dev       # starts on http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL. Leave unset locally — the Vite dev server proxies `/api` to `http://localhost:8000` automatically. Set to the Render URL in production. |
| `VITE_SUPABASE_URL` | Supabase project URL. Optional — auth is disabled if not set. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key. Optional. |
