from fastapi import APIRouter, HTTPException
from ..models import GeneratePlanRequest, SuggestMealRequest, AskRequest
from ..agents import run_meal_plan_agent, run_suggest_meal_agent, run_ask_agent
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["plan"])


@router.post("/generate-plan")
async def generate_plan(req: GeneratePlanRequest):
    try:
        result = run_meal_plan_agent(req.family)
        plan = {
            "id": str(uuid.uuid4()),
            "weekStart": datetime.utcnow().isoformat(),
            "generatedAt": datetime.utcnow().isoformat(),
            "totalBudget": req.family.budget.total,
            "estimatedCost": result.get("estimatedCost", 0),
            "slots": result.get("slots", []),
        }
        return {
            "plan": plan,
            "notes": result.get("agentNotes", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest-meal")
async def suggest_meal(req: SuggestMealRequest):
    try:
        return run_suggest_meal_agent(req.day, req.mealType, req.family)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask")
async def ask(req: AskRequest):
    try:
        answer = run_ask_agent(req.prompt, req.family)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/grocery-list")
async def grocery_list(body: dict):
    """Build grocery list from meal plan (done client-side, this is a passthrough)."""
    return body.get("groceryList", {})
