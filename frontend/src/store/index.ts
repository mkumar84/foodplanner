import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FamilyProfile, MealPlan, GroceryList, AgentNote } from '@/types'

interface AppState {
  // Auth
  userId: string | null
  setUserId: (id: string | null) => void

  // Family
  family: FamilyProfile | null
  setFamily: (f: FamilyProfile) => void

  // Meal plan
  mealPlan: MealPlan | null
  setMealPlan: (mp: MealPlan) => void
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void

  // Grocery
  groceryList: GroceryList | null
  setGroceryList: (gl: GroceryList | null) => void
  toggleGroceryItem: (id: string) => void

  // Agent notes
  agentNotes: AgentNote[]
  setAgentNotes: (notes: AgentNote[]) => void
  addAgentNote: (note: AgentNote) => void

  // UI
  onboardingComplete: boolean
  setOnboardingComplete: (v: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),

      family: null,
      setFamily: (f) => set({ family: f }),

      mealPlan: null,
      setMealPlan: (mp) => set({ mealPlan: mp }),
      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),

      groceryList: null,
      setGroceryList: (gl) => set({ groceryList: gl as GroceryList | null }),
      toggleGroceryItem: (id) => {
        const gl = get().groceryList
        if (!gl) return
        set({
          groceryList: {
            ...gl,
            items: gl.items.map((item) =>
              item.id === id ? { ...item, checked: !item.checked } : item
            ),
            byAisle: Object.fromEntries(
              Object.entries(gl.byAisle).map(([aisle, items]) => [
                aisle,
                items.map((item) =>
                  item.id === id ? { ...item, checked: !item.checked } : item
                ),
              ])
            ) as GroceryList['byAisle'],
          },
        })
      },

      agentNotes: [],
      setAgentNotes: (notes) => set({ agentNotes: notes }),
      addAgentNote: (note) =>
        set((s) => ({ agentNotes: [...s.agentNotes, note] })),

      onboardingComplete: false,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
    }),
    {
      name: 'food-planner-store',
      partialize: (s) => ({
        family: s.family,
        mealPlan: s.mealPlan,
        groceryList: s.groceryList,
        onboardingComplete: s.onboardingComplete,
        agentNotes: s.agentNotes,
      }),
    }
  )
)
