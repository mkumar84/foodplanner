import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FamilyProfile, MealPlan, GroceryList, AgentNote } from '@/types'
import { saveProfile, loadProfile } from '@/lib/supabase'

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

  // Cloud sync
  syncToSupabase: () => Promise<void>
  loadFromCloud: (data: {
    family?: unknown
    meal_plan?: unknown
    grocery_list?: unknown
    agent_notes?: unknown
    onboarding_complete?: boolean
  }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),

      family: null,
      setFamily: (f) => {
        set({ family: f })
        get().syncToSupabase()
      },

      mealPlan: null,
      setMealPlan: (mp) => {
        set({ mealPlan: mp })
        get().syncToSupabase()
      },
      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),

      groceryList: null,
      setGroceryList: (gl) => {
        set({ groceryList: gl as GroceryList | null })
        get().syncToSupabase()
      },
      toggleGroceryItem: (id) => {
        const gl = get().groceryList
        if (!gl) return
        const updated = {
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
        }
        set({ groceryList: updated })
        get().syncToSupabase()
      },

      agentNotes: [],
      setAgentNotes: (notes) => set({ agentNotes: notes }),
      addAgentNote: (note) =>
        set((s) => ({ agentNotes: [...s.agentNotes, note] })),

      onboardingComplete: false,
      setOnboardingComplete: (v) => {
        set({ onboardingComplete: v })
        get().syncToSupabase()
      },

      syncToSupabase: async () => {
        const { userId, family, mealPlan, groceryList, agentNotes, onboardingComplete } = get()
        if (!userId) return
        try {
          await saveProfile(userId, {
            family,
            meal_plan: mealPlan,
            grocery_list: groceryList,
            agent_notes: agentNotes,
            onboarding_complete: onboardingComplete,
          })
        } catch {
          // Supabase not configured or network error — data stays local only
        }
      },

      loadFromCloud: (data) => {
        // Direct set — bypasses syncing setters to avoid a write-back loop
        set({
          ...(data.family !== undefined && { family: data.family as FamilyProfile }),
          ...(data.meal_plan !== undefined && { mealPlan: data.meal_plan as MealPlan }),
          ...(data.grocery_list !== undefined && { groceryList: data.grocery_list as GroceryList | null }),
          ...(data.agent_notes !== undefined && { agentNotes: data.agent_notes as AgentNote[] }),
          ...(data.onboarding_complete !== undefined && { onboardingComplete: data.onboarding_complete }),
        })
      },
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
