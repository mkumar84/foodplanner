import { useState } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, X, ShieldCheck, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store'
import { generateMealPlan, suggestMeal } from '@/lib/api'
import { SEED_MEAL_PLAN } from '@/lib/seedData'
import { NutritionRing } from '@/components/ui/NutritionRing'
import { AgentNoteCard } from '@/components/ui/AgentNoteCard'
import { Spinner } from '@/components/ui/Spinner'
import { DAYS_SHORT, MEAL_TYPES } from '@/lib/utils'
import type { Meal, MealSlot, AgentNote } from '@/types'
import { cn } from '@/lib/utils'

const MEAL_LABEL: Record<string, string> = {
  breakfast: '☀️ Breakfast',
  lunch: '🌤️ Lunch',
  dinner: '🌙 Dinner',
}

function MealCell({
  slot,
  onClick,
  onSuggest,
  suggesting,
}: {
  slot: MealSlot
  onClick: () => void
  onSuggest: () => void
  suggesting: boolean
}) {
  const meal = slot.meal
  if (!meal) {
    return (
      <button
        onClick={onSuggest}
        disabled={suggesting}
        className="w-full h-full min-h-[80px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-green-300 hover:text-green-400 transition-all gap-1"
      >
        {suggesting ? <Spinner size="sm" className="text-green-400" /> : <span className="text-xl">+</span>}
        {!suggesting && <span className="text-[10px]">AI suggest</span>}
      </button>
    )
  }

  return (
    <motion.div className="relative group">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full text-left card p-3 hover:shadow-md transition-all cursor-pointer border-transparent hover:border-green-200"
      >
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xl">{meal.emoji}</span>
          <NutritionRing calories={meal.calories} protein={meal.protein} carbs={meal.carbs} fat={meal.fat} size={32} />
        </div>
        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{meal.name}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {meal.safeFor.length >= 4 ? (
            <span className="chip chip-sage text-[10px] py-0.5 px-2">All safe ✓</span>
          ) : (
            <span className="chip chip-amber text-[10px] py-0.5 px-2">⚠️ Check</span>
          )}
        </div>
      </motion.button>

      {/* Swap button on hover */}
      <button
        onClick={onSuggest}
        disabled={suggesting}
        title="AI suggest a different meal"
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-300"
      >
        {suggesting ? <Spinner size="sm" /> : <RefreshCw className="w-3 h-3" />}
      </button>
    </motion.div>
  )
}

function MealDetail({ slot, onClose }: { slot: MealSlot; onClose: () => void }) {
  const meal = slot.meal
  if (!meal) return null
  const family = useAppStore.getState().family

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        className="relative card w-full max-w-md max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-4xl mb-3">{meal.emoji}</div>
        <h2 className="text-xl font-bold mb-1">{meal.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{meal.description}</p>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Calories', value: meal.calories, unit: 'kcal', color: 'var(--green)' },
            { label: 'Protein', value: meal.protein, unit: 'g', color: '#2D5016' },
            { label: 'Carbs', value: meal.carbs, unit: 'g', color: 'var(--sage)' },
            { label: 'Fat', value: meal.fat, unit: 'g', color: 'var(--amber)' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
              <p className="text-lg font-bold" style={{ color }}>{value}</p>
              <p className="text-[10px] text-gray-400">{unit}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: 'var(--sage-muted)' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700">
            {meal.safeFor.length === family?.members.length
              ? 'Safe for the entire family'
              : `Safe for: ${meal.safeFor.map(id => family?.members.find(m => m.id === id)?.name).filter(Boolean).join(', ')}`}
          </p>
        </div>

        {meal.agentNote && (
          <div className="mb-5">
            <AgentNoteCard note={{ agent: 'safety', message: meal.agentNote, type: 'info' }} />
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h3>
          <div className="space-y-1.5">
            {meal.ingredients.map((ing) => (
              <div key={ing.name} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-700">{ing.name}</span>
                <span className="text-gray-400 text-xs">{ing.quantity} {ing.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {meal.steps && meal.steps.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">How to make it</h3>
            <ol className="space-y-2.5">
              {meal.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                    style={{ background: 'var(--green)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-gray-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <span className="chip chip-default text-xs">{meal.cuisine}</span>
          <span className="chip chip-default text-xs">⏱️ {meal.prepTime} min</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Planner() {
  const { mealPlan, family, isGenerating, agentNotes, setMealPlan, setAgentNotes, setIsGenerating, setGroceryList } = useAppStore()
  const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(null)
  const [showNotes, setShowNotes] = useState(false)
  const [suggestingSlot, setSuggestingSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!mealPlan || !family) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500">Generating your personalised meal plan…</p>
        <p className="text-xs text-gray-400">Checking preferences and restrictions for all {family?.members.length ?? ''} members</p>
      </div>
    )
  }

  async function handleRegenerate() {
    if (!family || isGenerating) return
    setIsGenerating(true)
    setError(null)
    setGroceryList(null) // clear stale grocery list
    try {
      const { plan, notes } = await generateMealPlan(family)
      setMealPlan(plan)
      setAgentNotes(notes)
      setShowNotes(true)
    } catch {
      // Fall back gracefully
      setMealPlan(SEED_MEAL_PLAN)
      setAgentNotes([{
        agent: 'safety',
        message: 'Could not reach the backend. Showing demo plan. Start the backend with your ANTHROPIC_API_KEY to generate a personalised plan.',
        type: 'warning',
      }])
      setShowNotes(true)
      setError('Backend unreachable — showing demo plan.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSuggest(day: number, mealType: string) {
    if (!family || !mealPlan) return
    const key = `${day}-${mealType}`
    setSuggestingSlot(key)
    try {
      const { meal, note } = await suggestMeal(day, mealType, family)
      if (meal) {
        setMealPlan({
          ...mealPlan,
          slots: mealPlan.slots.map(s =>
            s.day === day && s.mealType === mealType ? { ...s, meal } : s
          ),
        })
        if (note) setAgentNotes([...agentNotes, note as AgentNote])
      }
    } catch {
      // silently fail — backend not available
    } finally {
      setSuggestingSlot(null)
    }
  }

  const totalCal = mealPlan.slots.reduce((acc, s) => acc + (s.meal?.calories || 0), 0)
  const avg = Math.round(totalCal / (mealPlan.slots.filter(s => s.meal).length || 1))

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">This week's meals</h1>
          <p className="text-sm text-gray-500">
            {family.familyName} · ~${mealPlan.estimatedCost} est. · {avg} kcal avg/meal
          </p>
        </div>

        <div className="flex items-center gap-2">
          {agentNotes.length > 0 && (
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={cn('btn-ghost text-sm flex items-center gap-1.5', showNotes && 'bg-[var(--green-muted)] text-[var(--green)]')}
            >
              <ShieldCheck className="w-4 h-4" />
              {agentNotes.length} agent note{agentNotes.length !== 1 ? 's' : ''}
              <ChevronDown className={cn('w-3 h-3 transition-transform', showNotes && 'rotate-180')} />
            </button>
          )}
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="btn-primary text-sm"
          >
            {isGenerating
              ? <Spinner size="sm" className="text-white" />
              : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Planning…' : 'Regenerate week'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'var(--amber-muted)', color: '#92650A' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Preferences summary — always visible so user knows what was applied */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">Applied to all meals:</span>
        {family.members.flatMap(m =>
          m.dietary.allergies.map(a => (
            <span key={`${m.id}-${a}`} className="chip chip-coral text-xs py-0.5 px-2">
              {m.avatar} No {a}
            </span>
          ))
        )}
        {family.members.filter(m => m.dietary.style.some(s => s !== 'omnivore')).map(m => (
          <span key={m.id} className="chip chip-active text-xs py-0.5 px-2">
            {m.avatar} {m.dietary.style.filter(s => s !== 'omnivore').join(', ')}
          </span>
        ))}
        {family.members.flatMap(m => m.dietary.allergies).length === 0 &&
         family.members.every(m => m.dietary.style.every(s => s === 'omnivore')) && (
          <span className="text-xs text-gray-400">No restrictions set — <a href="/family" className="underline">edit family</a></span>
        )}
      </div>

      {/* Agent notes panel */}
      <AnimatePresence>
        {showNotes && agentNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="card p-4 space-y-2">
              {agentNotes.map((note, i) => (
                <AgentNoteCard key={i} note={note} delay={i * 0.05} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget bar */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Estimated cost</span>
            <span>${mealPlan.estimatedCost} / ${mealPlan.totalBudget}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: mealPlan.estimatedCost / mealPlan.totalBudget > 0.9 ? 'var(--coral)' : 'var(--green)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (mealPlan.estimatedCost / mealPlan.totalBudget) * 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          ${(mealPlan.totalBudget - mealPlan.estimatedCost).toFixed(0)} under budget
        </span>
      </div>

      {/* Meal grid — desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-8 gap-3">
          <div className="col-span-1" />
          {DAYS_SHORT.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2">
              {day}
            </div>
          ))}
          {MEAL_TYPES.map((mealType) => (
            <React.Fragment key={mealType}>
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-400 text-right w-full pr-1">
                  {MEAL_LABEL[mealType]}
                </span>
              </div>
              {[0,1,2,3,4,5,6].map((day) => {
                const slot = mealPlan.slots.find(s => s.day === day && s.mealType === mealType)
                const key = `${day}-${mealType}`
                return (
                  <div key={key}>
                    {slot ? (
                      <MealCell
                        slot={slot}
                        onClick={() => setSelectedSlot(slot)}
                        onSuggest={() => handleSuggest(day, mealType)}
                        suggesting={suggestingSlot === key}
                      />
                    ) : (
                      <button
                        onClick={() => handleSuggest(day, mealType)}
                        className="w-full h-[80px] rounded-xl border-2 border-dashed border-gray-100 hover:border-green-200 transition-all text-gray-300 hover:text-green-400 flex items-center justify-center text-xl"
                      >
                        +
                      </button>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Meal grid — mobile */}
      <div className="md:hidden space-y-4">
        {[0,1,2,3,4,5,6].map((day) => (
          <div key={day}>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {DAYS_SHORT[day]}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {MEAL_TYPES.map((mealType) => {
                const slot = mealPlan.slots.find(s => s.day === day && s.mealType === mealType)
                const key = `${day}-${mealType}`
                return slot ? (
                  <MealCell
                    key={mealType}
                    slot={slot}
                    onClick={() => setSelectedSlot(slot)}
                    onSuggest={() => handleSuggest(day, mealType)}
                    suggesting={suggestingSlot === key}
                  />
                ) : (
                  <button
                    key={mealType}
                    onClick={() => handleSuggest(day, mealType)}
                    className="h-[80px] rounded-xl border-2 border-dashed border-gray-100 hover:border-green-200 transition-all text-gray-300 flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSlot && (
          <MealDetail slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
