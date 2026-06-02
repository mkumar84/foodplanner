import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'
import { Layout } from '@/components/Layout'
import { Landing } from '@/pages/Landing'
import { Onboarding } from '@/pages/Onboarding'
import { Planner } from '@/pages/Planner'
import { Grocery } from '@/pages/Grocery'
import { Recipes } from '@/pages/Recipes'
import { Family } from '@/pages/Family'
import { supabase, loadProfile } from '@/lib/supabase'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function AuthHandler() {
  const navigate = useNavigate()
  const { setUserId, loadFromCloud } = useAppStore()

  useEffect(() => {
    let unsub: (() => void) | null = null
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUserId(session.user.id)
          try {
            const profile = await loadProfile(session.user.id)
            if (profile) {
              loadFromCloud(profile)
              navigate(profile.onboarding_complete ? '/planner' : '/onboarding', { replace: true })
            } else {
              // First sign-in — no cloud profile yet. Clear demo/local data so user starts fresh.
              loadFromCloud({ family: null, meal_plan: null, grocery_list: null, agent_notes: [], onboarding_complete: false })
              navigate('/onboarding', { replace: true })
            }
          } catch {
            // Profile load failed — keep existing local state, let routing handle it
          }
        } else if (event === 'SIGNED_OUT') {
          setUserId(null)
        }
      })
      unsub = () => data.subscription.unsubscribe()
    } catch {
      // Supabase not configured — auth disabled, app works in local-only mode
    }
    return () => unsub?.()
  }, [])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/planner" element={<Planner />} />
          <Route path="/grocery" element={<Grocery />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/family" element={<Family />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
