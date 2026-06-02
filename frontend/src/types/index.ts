export interface FamilyMember {
  id: string
  name: string
  age: number
  avatar: string // emoji
  role: 'adult' | 'teen' | 'child' | 'toddler'
  dietary: DietaryProfile
}

export interface DietaryProfile {
  style: DietStyle[]
  allergies: string[]
  dislikes: string[]
  goals: NutritionGoal[]
  cuisines: string[]  // preferred cuisines — referenced for every meal recommendation
}

export type DietStyle =
  | 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian'
  | 'gluten-free' | 'dairy-free' | 'keto' | 'athlete'

export type NutritionGoal = 'high-protein' | 'low-carb' | 'heart-healthy' | 'weight-loss' | 'balanced'

export interface Meal {
  id: string
  name: string
  description: string
  cuisine: string
  prepTime: number // minutes
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: Ingredient[]
  safeFor: string[] // member ids
  agentNote?: string // AI reasoning
  emoji: string
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  aisle: GroceryAisle
  estimatedCost: number
}

export type GroceryAisle =
  | 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen'
  | 'bakery' | 'beverages' | 'snacks' | 'spices'

export interface MealPlan {
  id: string
  weekStart: string // ISO date
  slots: MealSlot[]
  generatedAt: string
  totalBudget: number
  estimatedCost: number
}

export interface MealSlot {
  day: number // 0=Mon ... 6=Sun
  mealType: 'breakfast' | 'lunch' | 'dinner'
  meal: Meal | null
}

export interface GroceryItem {
  id: string
  ingredient: Ingredient
  checked: boolean
  usedIn: string[] // meal names
  quantity: number
  totalCost: number
}

export interface GroceryList {
  items: GroceryItem[]
  byAisle: Record<GroceryAisle, GroceryItem[]>
  totalCost: number
}

export interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  emoji: string
  tags: string[]
  ingredients: Ingredient[]
  steps: string[]
  nutrition: { calories: number; protein: number; carbs: number; fat: number }
  safeFor: DietStyle[]
}

export interface WeekBudget {
  total: number
  perDay: number
  currency: 'USD' | 'INR' | 'GBP' | 'EUR'
}

export interface FamilyProfile {
  id: string
  familyName: string
  members: FamilyMember[]
  budget: WeekBudget
  cuisinePreferences: string[]
  mealsPerDay: number
}

export interface AgentNote {
  agent: 'safety' | 'nutrition' | 'grocery' | 'variety' | 'budget'
  message: string
  type: 'info' | 'warning' | 'success'
}
