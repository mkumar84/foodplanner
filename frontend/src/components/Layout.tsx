import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { CalendarDays, ShoppingCart, BookOpen, Users, LogOut, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/planner', icon: CalendarDays, label: 'Planner' },
  { to: '/grocery', icon: ShoppingCart, label: 'Grocery' },
  { to: '/recipes', icon: BookOpen, label: 'Recipes' },
  { to: '/family', icon: Users, label: 'Family' },
]

export function Layout() {
  const navigate = useNavigate()
  const family = useAppStore((s) => s.family)

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Top nav — desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
        <NavLink to="/planner" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--green)' }}>
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base" style={{ fontFamily: 'Lora, serif', color: 'var(--green)' }}>
            {family?.familyName || 'Family Planner'}
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('btn-ghost flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive && 'bg-[var(--green-muted)] text-[var(--green)]')
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleSignOut} className="btn-ghost text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all',
                  isActive ? 'text-[var(--green)]' : 'text-gray-400')
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                    className={cn('p-1.5 rounded-xl', isActive && 'bg-[var(--green-muted)]')}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
