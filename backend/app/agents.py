"""
Five AI agents powered by Claude. Each focuses on one concern and returns
structured output + a human-readable note explaining its decision.
"""
import json
import os
import anthropic
from .models import FamilyProfile, FamilyMember

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MEAL_TYPES = ["breakfast", "lunch", "dinner"]


def _family_context(family: FamilyProfile) -> str:
    lines = [f"Family: {family.familyName}", f"Budget: ${family.budget.total}/week"]
    for m in family.members:
        d = m.dietary
        cuisines = getattr(d, 'cuisines', []) or []
        cuisine_str = f", preferred cuisines={cuisines}" if cuisines else ", no cuisine preference (choose freely)"
        line = (
            f"- {m.name} ({m.age}y, {m.role}): style={d.style}, allergies={d.allergies}, "
            f"dislikes={d.dislikes}, goals={d.goals}{cuisine_str}"
        )
        lines.append(line)
    return "\n".join(lines)


def run_meal_plan_agent(family: FamilyProfile) -> dict:
    """
    Orchestrator agent — generates a full 7-day, 3-meal-per-day plan.
    Returns JSON matching MealPlan structure.
    """
    context = _family_context(family)
    prompt = f"""You are a professional nutritionist and family meal planner.
Generate a 7-day meal plan (21 meals total) for this family:

{context}

CRITICAL RULES:
- NEVER include ingredients that any member is allergic to in meals served to them.
- For vegetarian/vegan members, provide plant-based alternatives.
- Keep meals appropriately spiced for children.
- STRONGLY prefer cuisine types listed as "preferred cuisines" for each member. When the family shares overlapping preferences, lean into those cuisines. If a member has no preference, vary freely.

Return a JSON object with this exact structure:
{{
  "slots": [
    {{
      "day": 0,  // 0=Mon ... 6=Sun
      "mealType": "breakfast",
      "meal": {{
        "id": "unique_id",
        "name": "Meal Name",
        "description": "Brief appetizing description",
        "cuisine": "Indian/Italian/etc",
        "prepTime": 20,
        "calories": 400,
        "protein": 20,
        "carbs": 50,
        "fat": 12,
        "emoji": "🍳",
        "safeFor": ["member_id1", "member_id2"],
        "agentNote": "Brief note explaining safety/nutrition decisions",
        "ingredients": [
          {{"name": "ingredient", "quantity": "2", "unit": "cups", "aisle": "pantry", "estimatedCost": 1.20}}
        ],
        "steps": [
          "Brief step 1",
          "Brief step 2",
          "Brief step 3",
          "Brief step 4"
        ]
      }}
    }}
  ],
  "estimatedCost": 115.50,
  "agentNotes": [
    {{"agent": "safety", "message": "All peanut products removed for Aditya", "type": "success"}},
    {{"agent": "nutrition", "message": "...", "type": "info"}},
    {{"agent": "variety", "message": "...", "type": "info"}},
    {{"agent": "budget", "message": "...", "type": "info"}}
  ]
}}

Member IDs: {[m.id for m in family.members]}
Aisle options: produce, dairy, meat, pantry, frozen, bakery, beverages, snacks, spices
Include 4-6 brief cooking steps per meal (imperative sentences, under 15 words each).
Return ONLY valid JSON. No markdown, no explanation outside the JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    # Strip markdown code blocks if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def run_suggest_meal_agent(day: int, meal_type: str, family: FamilyProfile) -> dict:
    """Suggest a single replacement meal for a given slot."""
    context = _family_context(family)
    day_name = DAYS[day]

    prompt = f"""You are a family meal planner. Suggest ONE meal for {day_name} {meal_type}.

Family context (respect each member's preferred cuisines, allergies, and dietary style):
{context}

Return a JSON object:
{{
  "meal": {{
    "id": "unique_id",
    "name": "Meal Name",
    "description": "Brief description",
    "cuisine": "Cuisine type",
    "prepTime": 25,
    "calories": 450,
    "protein": 22,
    "carbs": 55,
    "fat": 14,
    "emoji": "🍽️",
    "safeFor": {[m.id for m in family.members]},
    "agentNote": "Why this meal works for the family",
    "ingredients": [],
    "steps": [
      "Brief step 1",
      "Brief step 2",
      "Brief step 3",
      "Brief step 4"
    ]
  }},
  "note": {{
    "agent": "variety",
    "message": "Suggested based on...",
    "type": "info"
  }}
}}

Return ONLY valid JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def run_ask_agent(user_prompt: str, family: FamilyProfile) -> str:
    """Conversational assistant — answers meal/nutrition questions about this family."""
    context = _family_context(family)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system=f"""You are a helpful family nutrition assistant. You know this family:
{context}

Answer questions concisely and helpfully. Consider each member's dietary needs in your answers.""",
        messages=[{"role": "user", "content": user_prompt}],
    )
    return message.content[0].text
