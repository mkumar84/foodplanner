import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store'
import { SEED_MEAL_PLAN } from '@/lib/seedData'
import { generateMealPlan } from '@/lib/api'
import { ALLERGY_OPTIONS, DIET_STYLES, AVATAR_OPTIONS, NUTRITION_GOALS, CUISINE_OPTIONS } from '@/lib/utils'
import type { FamilyMember, FamilyProfile, DietStyle, NutritionGoal } from '@/types'
import { cn } from '@/lib/utils'

const STEPS = ['Your family', 'Dietary needs', 'Goals & budget']

const AGENT_STEPS = [
  { emoji: '🛡️', label: 'Safety agent', desc: 'Checking allergies and restrictions for every member…' },
  { emoji: '🔥', label: 'Nutrition agent', desc: 'Balancing proteins, carbs and calories for each person…' },
  { emoji: '🎲', label: 'Variety agent', desc: 'Mixing cuisines and flavours across the week…' },
  { emoji: '🛒', label: 'Grocery agent', desc: 'Building your shopping list by aisle…' },
  { emoji: '💰', label: 'Budget agent', desc: 'Keeping costs within your weekly budget…' },
]

function newMember(name = ''): FamilyMember {
  return {
    id: crypto.randomUUID(),
    name,
    age: 30,
    avatar: '👤',
    role: 'adult',
    dietary: { style: ['omnivore'], allergies: [], dislikes: [], goals: ['balanced'], cuisines: [] },
  }
}

function GeneratingScreen({ familyName }: { familyName: string }) {
  const [agentIdx, setAgentIdx] = useState(0)

  // Cycle through agent steps every 2.5 s
  useState(() => {
    const id = setInterval(() => setAgentIdx((i) => Math.min(i + 1, AGENT_STEPS.length - 1)), 2500)
    return () => clearInterval(id)
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm"
      >
        <div className="text-6xl mb-6">🍽️</div>
        <h1 className="text-2xl font-bold mb-2">Personalising your plan</h1>
        <p className="text-gray-500 mb-10 text-sm">
          5 AI agents are reading every preference and restriction for {familyName}…
        </p>

        <div className="space-y-3 text-left mb-10">
          {AGENT_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: i <= agentIdx ? 1 : 0.25, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl transition-all',
                i < agentIdx ? 'bg-[var(--sage-muted)]' : i === agentIdx ? 'bg-[var(--green-muted)]' : 'bg-gray-50'
              )}
            >
              <span className="text-xl shrink-0">{step.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', i <= agentIdx ? 'text-gray-800' : 'text-gray-400')}>
                  {step.label}
                </p>
                {i === agentIdx && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500 mt-0.5"
                  >
                    {step.desc}
                  </motion.p>
                )}
              </div>
              {i < agentIdx && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
              {i === agentIdx && <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: 'var(--green)' }} />}
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-gray-400">This takes about 15–30 seconds</p>
      </motion.div>
    </div>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const { setFamily, setMealPlan, setAgentNotes, setOnboardingComplete, setIsGenerating } = useAppStore()

  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState<FamilyMember[]>([newMember()])
  const [activeMember, setActiveMember] = useState(0)
  const [budget, setBudget] = useState(150)

  function updateMember(idx: number, patch: Partial<FamilyMember>) {
    setMembers((ms) => ms.map((m, i) => (i === idx ? { ...m, ...patch } : m)))
  }

  function updateDietary<K extends keyof FamilyMember['dietary']>(
    idx: number, key: K, value: FamilyMember['dietary'][K]
  ) {
    setMembers((ms) =>
      ms.map((m, i) => i === idx ? { ...m, dietary: { ...m.dietary, [key]: value } } : m)
    )
  }

  function toggleStyle(idx: number, style: DietStyle) {
    const cur = members[idx].dietary.style
    updateDietary(idx, 'style', cur.includes(style) ? cur.filter(s => s !== style) : [...cur, style])
  }

  function toggleAllergy(idx: number, a: string) {
    const cur = members[idx].dietary.allergies
    updateDietary(idx, 'allergies', cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a])
  }

  function toggleGoal(idx: number, g: NutritionGoal) {
    const cur = members[idx].dietary.goals
    updateDietary(idx, 'goals', cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g])
  }

  function toggleCuisine(idx: number, c: string) {
    const cur = members[idx].dietary.cuisines
    updateDietary(idx, 'cuisines', cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c])
  }

  async function handleFinish() {
    const family: FamilyProfile = {
      id: crypto.randomUUID(),
      familyName,
      members,
      budget: { total: budget, perDay: Math.round(budget / 7), currency: 'USD' },
      cuisinePreferences: [],
      mealsPerDay: 3,
    }

    setFamily(family)
    setGenerating(true)
    setIsGenerating(true)

    try {
      // Call AI agents with the real family profile — every allergy, preference, and goal is sent
      const { plan, notes } = await generateMealPlan(family)
      setMealPlan(plan)
      setAgentNotes(notes)
    } catch {
      // Backend unavailable — use seed data but flag it clearly
      setMealPlan(SEED_MEAL_PLAN)
      setAgentNotes([{
        agent: 'safety',
        message: 'Showing demo plan — start the backend with your ANTHROPIC_API_KEY to generate a personalised plan built around your family\'s exact preferences and restrictions.',
        type: 'warning',
      }])
    } finally {
      setIsGenerating(false)
      setOnboardingComplete(true)
      navigate('/planner')
    }
  }

  if (generating) {
    return <GeneratingScreen familyName={familyName} />
  }

  const cur = members[activeMember]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Progress header */}
      <header className="px-6 py-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--green)' }}>
            🍽️
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--green)' }}>Family Planner</span>
        </div>

        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                  i < step ? 'text-white' : i === step ? 'text-white' : 'text-gray-400 bg-gray-100'
                )} style={i <= step ? { background: 'var(--green)' } : {}}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-gray-800' : 'text-gray-400')}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ background: i < step ? 'var(--green)' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── Step 0: Who's in your family ── */}
            {step === 0 && (
              <div className="py-8">
                <h1 className="text-3xl font-bold mb-2">Who's in your family?</h1>
                <p className="text-gray-500 mb-8">
                  Add every member — their preferences and restrictions will shape every meal recommendation.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family name</label>
                  <input
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base bg-white"
                    placeholder="e.g. The Smith Family"
                  />
                </div>

                <div className="space-y-3 mb-4">
                  {members.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card p-4 flex items-center gap-4"
                    >
                      <select
                        value={m.avatar}
                        onChange={(e) => updateMember(i, { avatar: e.target.value })}
                        className="text-3xl bg-transparent border-none cursor-pointer appearance-none pr-0"
                        style={{ WebkitAppearance: 'none' }}
                      >
                        {AVATAR_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>

                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          value={m.name}
                          onChange={(e) => updateMember(i, { name: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                          placeholder="Name"
                        />
                        <input
                          type="number"
                          value={m.age}
                          onChange={(e) => updateMember(i, { age: Number(e.target.value) })}
                          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white w-full"
                          placeholder="Age"
                          min={0} max={120}
                        />
                      </div>

                      {members.length > 1 && (
                        <button
                          onClick={() => {
                            setMembers((ms) => ms.filter((_, j) => j !== i))
                            if (activeMember >= i) setActiveMember(Math.max(0, i - 1))
                          }}
                          className="text-gray-300 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => setMembers((ms) => [...ms, newMember()])}
                  className="btn-secondary w-full justify-center py-3"
                >
                  <Plus className="w-4 h-4" /> Add family member
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  You'll set dietary preferences for each person in the next step
                </p>
              </div>
            )}

            {/* ── Step 1: Dietary needs (per member) ── */}
            {step === 1 && (
              <div className="py-8">
                <h1 className="text-3xl font-bold mb-1">Dietary needs</h1>
                <p className="text-gray-500 mb-2 text-sm">
                  These are read by the AI before <em>every</em> meal recommendation. Be specific — the more you add, the better the plan.
                </p>

                {/* Safety reminder */}
                <div className="flex items-start gap-2 p-3 rounded-xl mb-6 text-xs"
                  style={{ background: 'var(--coral-muted)', color: '#9B2C1E' }}>
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>Allergies are treated as hard rules — the AI will <strong>never</strong> include an allergen in a meal for that member.</span>
                </div>

                {/* Member tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {members.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMember(i)}
                      className={cn('chip whitespace-nowrap', activeMember === i ? 'chip-active' : 'chip-default')}
                    >
                      {m.avatar} {m.name || `Member ${i + 1}`}
                      {m.dietary.allergies.length > 0 && (
                        <span className="ml-1 text-red-400 text-[10px]">⚠️{m.dietary.allergies.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {cur && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Eating style for {cur.name || 'this member'}
                      </label>
                      <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
                      <div className="flex flex-wrap gap-2">
                        {DIET_STYLES.map(({ value, label, emoji }) => (
                          <button
                            key={value}
                            onClick={() => toggleStyle(activeMember, value as DietStyle)}
                            className={cn('chip', cur.dietary.style.includes(value as DietStyle) ? 'chip-active' : 'chip-default')}
                          >
                            {emoji} {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Allergies & intolerances
                      </label>
                      <p className="text-xs text-gray-400 mb-3">These are enforced as hard rules — no exceptions</p>
                      <div className="flex flex-wrap gap-2">
                        {ALLERGY_OPTIONS.map((a) => (
                          <button
                            key={a}
                            onClick={() => toggleAllergy(activeMember, a)}
                            className={cn('chip', cur.dietary.allergies.includes(a) ? 'chip-coral' : 'chip-default')}
                          >
                            {cur.dietary.allergies.includes(a) && '⚠️ '}{a}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Foods {cur.name || 'they'} dislike
                      </label>
                      <input
                        value={cur.dietary.dislikes.join(', ')}
                        onChange={(e) =>
                          updateDietary(activeMember, 'dislikes',
                            e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white"
                        placeholder="e.g. mushrooms, liver, broccoli"
                      />
                      <p className="text-xs text-gray-400 mt-1">Separate with commas · AI will avoid or minimise these</p>
                    </div>

                    {/* Cuisine preferences */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Favourite cuisines for {cur.name || 'this member'}
                      </label>
                      <p className="text-xs text-gray-400 mb-3">
                        Select all they enjoy — the AI will prioritise these when suggesting meals
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CUISINE_OPTIONS.map(({ value, label, emoji }) => (
                          <button
                            key={value}
                            onClick={() => toggleCuisine(activeMember, value)}
                            className={cn('chip', cur.dietary.cuisines.includes(value) ? 'chip-active' : 'chip-default')}
                          >
                            {emoji} {label}
                          </button>
                        ))}
                      </div>
                      {cur.dietary.cuisines.length === 0 && (
                        <p className="text-xs text-amber-600 mt-2">
                          💡 No cuisines selected — the AI will choose freely. Pick some to get more personalised suggestions.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Goals & budget ── */}
            {step === 2 && (
              <div className="py-8">
                <h1 className="text-3xl font-bold mb-1">Goals & budget</h1>
                <p className="text-gray-500 mb-6 text-sm">
                  The AI optimises nutrition for each person's goal while keeping the total cost under your budget.
                </p>

                {/* Member tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {members.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMember(i)}
                      className={cn('chip whitespace-nowrap', activeMember === i ? 'chip-active' : 'chip-default')}
                    >
                      {m.avatar} {m.name || `Member ${i + 1}`}
                    </button>
                  ))}
                </div>

                {cur && (
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nutrition goals for {cur.name || 'this member'}
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Affects macro ratios (protein, carbs, fats) in every meal</p>
                    <div className="flex flex-wrap gap-2">
                      {NUTRITION_GOALS.map(({ value, label, emoji }) => (
                        <button
                          key={value}
                          onClick={() => toggleGoal(activeMember, value as NutritionGoal)}
                          className={cn('chip', cur.dietary.goals.includes(value as NutritionGoal) ? 'chip-active' : 'chip-default')}
                        >
                          {emoji} {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weekly grocery budget</label>
                  <p className="text-xs text-gray-400 mb-4">
                    The budget agent alerts you when a meal pushes costs too high and will suggest cheaper alternatives.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold" style={{ color: 'var(--green)' }}>${budget}</span>
                    <input
                      type="range" min={50} max={500} step={10}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="flex-1 accent-green-700"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$50</span><span>$500/week</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    ≈ <strong>${Math.round(budget / 7)}/day</strong> · <strong>
                    ${Math.round(budget / 7 / members.length)} per person/day</strong>
                  </p>
                </div>

                {/* Summary of what's set */}
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--green-muted)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--green)' }}>
                    ✓ Your AI will respect these rules for every meal:
                  </p>
                  <ul className="space-y-1.5">
                    {members.map(m => {
                      const parts = []
                      if (m.dietary.allergies.length) parts.push(`no ${m.dietary.allergies.join(', ')}`)
                      if (m.dietary.style.some(s => s !== 'omnivore')) parts.push(m.dietary.style.filter(s => s !== 'omnivore').join(', '))
                      if (m.dietary.dislikes.length) parts.push(`avoids ${m.dietary.dislikes.slice(0, 2).join(', ')}`)
                      if (m.dietary.cuisines.length) parts.push(`prefers ${m.dietary.cuisines.join(', ')}`)
                      return (
                        <li key={m.id} className={parts.length > 0 ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}>
                          <strong>{m.avatar} {m.name}</strong>:{' '}
                          {parts.length > 0 ? parts.join(' · ') : 'no restrictions or preferences'}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between py-8">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className={cn('btn-ghost', step === 0 && 'opacity-0 pointer-events-none')}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => { setStep((s) => s + 1); setActiveMember(0) }} className="btn-primary">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary">
              Generate my plan <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
