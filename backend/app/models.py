from pydantic import BaseModel
from typing import Optional

class DietaryProfile(BaseModel):
    style: list[str] = []
    allergies: list[str] = []
    dislikes: list[str] = []
    goals: list[str] = []
    cuisines: list[str] = []

class FamilyMember(BaseModel):
    id: str
    name: str
    age: int
    avatar: str
    role: str
    dietary: DietaryProfile

class WeekBudget(BaseModel):
    total: float
    perDay: float
    currency: str = "USD"

class FamilyProfile(BaseModel):
    id: str
    familyName: str
    members: list[FamilyMember]
    budget: WeekBudget
    cuisinePreferences: list[str] = []
    mealsPerDay: int = 3

class GeneratePlanRequest(BaseModel):
    family: FamilyProfile

class SuggestMealRequest(BaseModel):
    day: int
    mealType: str
    family: FamilyProfile

class AskRequest(BaseModel):
    prompt: str
    family: FamilyProfile
