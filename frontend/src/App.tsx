import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store'
import { Layout } from '@/components/Layout'
import { Landing } from '@/pages/Landing'
import { Onboarding } from '@/pages/Onboarding'
import { Planner } from '@/pages/Planner'
import { Grocery } from '@/pages/Grocery'
import { Recipes } from '@/pages/Recipes'
import { Family } from '@/pages/Family'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
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
