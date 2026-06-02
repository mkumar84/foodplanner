import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import plan

load_dotenv()

app = FastAPI(title="Family Food Planner API", version="1.0.0")

_cors_env = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:4173")
_origins = [o.strip() for o in _cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan.router)


@app.get("/health")
def health():
    return {"status": "ok"}
