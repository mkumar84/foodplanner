import axios from 'axios'
import type { FamilyProfile, MealPlan, GroceryList, AgentNote } from '@/types'

const BASE = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 60000,
})

export async function generateMealPlan(
  family: FamilyProfile,
  onNote?: (note: AgentNote) => void
): Promise<{ plan: MealPlan; notes: AgentNote[] }> {
  // Stream agent notes via SSE if available, fallback to POST
  const response = await api.post('/generate-plan', { family })
  return response.data
}

export async function buildGroceryList(plan: MealPlan): Promise<GroceryList> {
  const response = await api.post('/grocery-list', { plan })
  return response.data
}

export async function askAI(prompt: string, family: FamilyProfile): Promise<string> {
  const response = await api.post('/ask', { prompt, family })
  return response.data.answer
}

export async function suggestMeal(
  day: number,
  mealType: string,
  family: FamilyProfile
): Promise<{ meal: MealPlan['slots'][0]['meal']; note: AgentNote }> {
  const response = await api.post('/suggest-meal', { day, mealType, family })
  return response.data
}

// Mock Instacart integration
export async function sendToInstacart(groceryList: GroceryList): Promise<{ cartUrl: string }> {
  // Simulate API call delay
  await new Promise((r) => setTimeout(r, 1500))
  return {
    cartUrl: 'https://www.instacart.com/store/checkout_redirect?partner=demo',
  }
}
