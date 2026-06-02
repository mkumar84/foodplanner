import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

export const ALLERGY_OPTIONS = [
  'Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat / Gluten',
  'Soy', 'Fish', 'Shellfish', 'Sesame', 'Sulfites',
]

export const DIET_STYLES = [
  { value: 'omnivore', label: 'Eats everything', emoji: '🍖' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { value: 'gluten-free', label: 'Gluten-free', emoji: '🌾' },
  { value: 'dairy-free', label: 'Dairy-free', emoji: '🥛' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'athlete', label: 'High-performance', emoji: '💪' },
]

export const NUTRITION_GOALS = [
  { value: 'high-protein', label: 'High protein', emoji: '🥩' },
  { value: 'low-carb', label: 'Low carb', emoji: '🥦' },
  { value: 'heart-healthy', label: 'Heart healthy', emoji: '❤️' },
  { value: 'weight-loss', label: 'Weight loss', emoji: '⚖️' },
  { value: 'balanced', label: 'Balanced', emoji: '✨' },
]

export const AVATAR_OPTIONS = ['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶']

export const CUISINE_OPTIONS = [
  { value: 'Indian',           label: 'Indian',             emoji: '🇮🇳' },
  { value: 'Chinese',          label: 'Chinese',            emoji: '🥢' },
  { value: 'Japanese',         label: 'Japanese',           emoji: '🍱' },
  { value: 'Korean',           label: 'Korean',             emoji: '🌶️' },
  { value: 'Southeast Asian',  label: 'Southeast Asian',    emoji: '🌏' },
  { value: 'Mediterranean',    label: 'Mediterranean',      emoji: '🫒' },
  { value: 'Italian',          label: 'Italian',            emoji: '🍝' },
  { value: 'Middle Eastern',   label: 'Middle Eastern',     emoji: '🥙' },
  { value: 'Mexican',          label: 'Mexican',            emoji: '🌮' },
  { value: 'American',         label: 'American',           emoji: '🍔' },
  { value: 'French',           label: 'French',             emoji: '🥐' },
  { value: 'African',          label: 'African',            emoji: '🌍' },
]

export const AISLE_LABELS: Record<string, string> = {
  produce: '🥦 Produce',
  dairy: '🧀 Dairy',
  meat: '🥩 Meat & Seafood',
  pantry: '🫙 Pantry',
  frozen: '🧊 Frozen',
  bakery: '🍞 Bakery',
  beverages: '🥤 Beverages',
  snacks: '🍿 Snacks',
  spices: '🌶️ Spices & Herbs',
}
