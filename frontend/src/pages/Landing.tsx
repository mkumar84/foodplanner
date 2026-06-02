import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Flame, ShoppingCart, Clock, Star } from 'lucide-react'
import { signInWithGoogle } from '@/lib/supabase'
import { useAppStore } from '@/store'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: ShieldCheck, emoji: '🛡️', title: 'Allergy-safe meals', desc: 'Every meal is checked against each family member\'s allergies and dietary restrictions — automatically.' },
  { icon: Flame, emoji: '🔥', title: 'Nutrition that fits', desc: 'From athletes to picky eaters, the AI balances each person\'s protein, carbs and calorie targets.' },
  { icon: ShoppingCart, emoji: '🛒', title: 'Grocery list, done', desc: 'One tap generates a full shopping list sorted by aisle — ready to send to Instacart.' },
  { icon: Clock, emoji: '⏱️', title: 'Save 5+ hours/week', desc: 'Stop the daily "what\'s for dinner?" loop. Your week is planned before Monday morning.' },
]

const TESTIMONIALS = [
  { quote: 'Aditya\'s peanut allergy used to make every meal stressful. Now I know every dinner is safe before I start cooking.', name: 'Priya K.', role: 'Mum of 2' },
  { quote: 'The grocery list by aisle is a game-changer. I\'m in and out of the supermarket in 20 minutes.', name: 'James T.', role: 'Dad of 3' },
  { quote: 'We actually eat more variety now. The AI keeps suggesting things we\'d never have thought of.', name: 'Fatima A.', role: 'Family of 5' },
]

export function Landing() {
  const navigate = useNavigate()
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle()
    } catch {
      // Supabase not configured — go straight to onboarding for demo
      navigate(onboardingComplete ? '/planner' : '/onboarding')
    }
  }

  function handleDemo() {
    navigate(onboardingComplete ? '/planner' : '/onboarding')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--green)' }}>
            <span className="text-white text-sm">🍽️</span>
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'Lora, serif', color: 'var(--green)' }}>
            Family Planner
          </span>
        </div>
        <button onClick={handleGoogleLogin} className="btn-ghost text-sm">
          Sign in
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--green-muted)', color: 'var(--green)' }}>
            <span>✨</span> AI-powered meal planning for real families
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'Lora, serif', color: 'var(--text)' }}>
            Dinner sorted.<br />
            <span style={{ color: 'var(--green)' }}>Every single week.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tell us who's in your family — allergies, preferences, goals.
            Our AI plans 21 meals, generates your grocery list, and keeps everyone happy and healthy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleDemo} className="btn-primary text-base px-8 py-4">
              Start planning free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleGoogleLogin} className="btn-secondary text-base px-8 py-4">
              <span>🔐</span> Sign in with Google
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-4">No credit card · Takes 2 minutes to set up</p>
        </motion.div>

        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 card p-6 md:p-10 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['🥣','🥑','🍌','🍚','🍳','🥞','🍱',
              '🫕','🌯','🥣','🥪','🥗','🫓','🥕',
              '🍗','🍝','🐟','🫕','🍕','🥙','🍛'].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                className="aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
                style={{ background: i % 5 === 0 ? 'var(--green-muted)' : i % 5 === 1 ? 'var(--amber-muted)' : i % 5 === 2 ? 'var(--sage-muted)' : '#F3F4F6' }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>This week's plan · 21 meals · $118 estimated</span>
            <span className="chip chip-sage text-xs">All family safe ✓</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ fontFamily: 'Lora, serif' }}>
          Thoughtful, not just smart
        </h2>
        <p className="text-gray-500 text-center mb-12 text-lg">
          Five AI agents work together so you don't have to juggle it all.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ emoji, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{emoji}</div>
              <h3 className="font-semibold text-base mb-2" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text)' }}>
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" style={{ color: 'var(--amber)' }} />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm italic">"{quote}"</p>
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-gray-400">{role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card p-10"
          style={{ background: 'var(--green)', border: 'none' }}
        >
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Lora, serif' }}>
            Ready to end the dinner dilemma?
          </h2>
          <p className="text-green-200 mb-8">Set up your family profile in 2 minutes. It's free.</p>
          <button onClick={handleDemo} className="bg-white px-8 py-4 rounded-xl font-semibold text-base inline-flex items-center gap-2 hover:bg-green-50 transition-colors" style={{ color: 'var(--green)' }}>
            Start planning free <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        Built with ❤️ for families · Powered by Claude AI
      </footer>
    </div>
  )
}
