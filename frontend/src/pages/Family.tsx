import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Check, X, ShieldCheck, Target, AlertTriangle, Plus, Trash2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'
import { generateMealPlan } from '@/lib/api'
import { SEED_MEAL_PLAN } from '@/lib/seedData'
import { DIET_STYLES, NUTRITION_GOALS, formatCurrency, ALLERGY_OPTIONS, AVATAR_OPTIONS, CUISINE_OPTIONS } from '@/lib/utils'
import type { FamilyMember, DietStyle, NutritionGoal } from '@/types'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

const WEEKLY_INSIGHTS = [
  { icon: '🥦', message: 'Aditya\'s vegetable intake is below his daily target.', type: 'warning' },
  { icon: '💪', message: 'Raj hit his protein goal 5 out of 7 days this week — great job!', type: 'success' },
  { icon: '🧁', message: 'Meera\'s sugar intake is slightly high this week. Consider swapping Friday snack.', type: 'warning' },
  { icon: '✅', message: 'No allergy conflicts detected in any meal this week.', type: 'success' },
]

function newMember(): FamilyMember {
  return {
    id: crypto.randomUUID(),
    name: '',
    age: 30,
    avatar: '👤',
    role: 'adult',
    dietary: { style: ['omnivore'], allergies: [], dislikes: [], goals: ['balanced'], cuisines: [] },
  }
}

function MemberCard({
  member,
  canDelete,
  onUpdate,
  onDelete,
}: {
  member: FamilyMember
  canDelete: boolean
  onUpdate: (patch: Partial<FamilyMember>) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(member)

  function toggleStyle(s: DietStyle) {
    const cur = draft.dietary.style
    setDraft(d => ({ ...d, dietary: { ...d.dietary, style: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] } }))
  }
  function toggleAllergy(a: string) {
    const cur = draft.dietary.allergies
    setDraft(d => ({ ...d, dietary: { ...d.dietary, allergies: cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a] } }))
  }
  function toggleGoal(g: NutritionGoal) {
    const cur = draft.dietary.goals
    setDraft(d => ({ ...d, dietary: { ...d.dietary, goals: cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g] } }))
  }
  function toggleCuisine(c: string) {
    const cur = draft.dietary.cuisines ?? []
    setDraft(d => ({ ...d, dietary: { ...d.dietary, cuisines: cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c] } }))
  }

  function save() { onUpdate(draft); setEditing(false) }
  function cancel() { setDraft(member); setEditing(false) }

  const dietLabels = member.dietary.style
    .filter(s => s !== 'omnivore')
    .map(s => DIET_STYLES.find(d => d.value === s)?.label)
    .filter(Boolean)

  return (
    <motion.div layout className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'var(--green-muted)' }}>
            {member.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-base">{member.name || 'New member'}</h3>
            <p className="text-xs text-gray-400">
              {member.age} yrs{dietLabels.length > 0 ? ` · ${dietLabels.join(', ')}` : ' · No restrictions'}
            </p>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="btn-ghost p-2" title="Edit profile">
                <Edit2 className="w-4 h-4" />
              </button>
              {canDelete && (
                <button onClick={onDelete} className="btn-ghost p-2 text-gray-300 hover:text-red-400" title="Remove member">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={cancel} className="btn-ghost p-2 text-gray-400"><X className="w-4 h-4" /></button>
              <button onClick={save} className="btn-primary py-2 px-3 text-xs"><Check className="w-4 h-4" /></button>
            </>
          )}
        </div>
      </div>

      {!editing ? (
        <div className="space-y-3">
          {member.dietary.allergies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" /> Allergies — enforced in every meal
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.dietary.allergies.map(a => (
                  <span key={a} className="chip chip-coral text-xs py-0.5 px-2">{a}</span>
                ))}
              </div>
            </div>
          )}
          {member.dietary.dislikes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Dislikes — AI minimises these</p>
              <div className="flex flex-wrap gap-1.5">
                {member.dietary.dislikes.map(d => (
                  <span key={d} className="chip chip-default text-xs py-0.5 px-2">{d}</span>
                ))}
              </div>
            </div>
          )}
          {member.dietary.goals.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3" /> Nutrition goals
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.dietary.goals.map(g => {
                  const meta = NUTRITION_GOALS.find(x => x.value === g)
                  return meta ? (
                    <span key={g} className="chip chip-active text-xs py-0.5 px-2">{meta.emoji} {meta.label}</span>
                  ) : null
                })}
              </div>
            </div>
          )}
          {(member.dietary.cuisines ?? []).length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">🌍 Cuisine preferences</p>
              <div className="flex flex-wrap gap-1.5">
                {(member.dietary.cuisines ?? []).map(c => {
                  const meta = CUISINE_OPTIONS.find(x => x.value === c)
                  return meta ? (
                    <span key={c} className="chip chip-active text-xs py-0.5 px-2">{meta.emoji} {meta.label}</span>
                  ) : null
                })}
              </div>
            </div>
          )}
          {member.dietary.allergies.length === 0 && member.dietary.dislikes.length === 0 && member.dietary.goals.length === 0 && (member.dietary.cuisines ?? []).length === 0 && (
            <p className="text-sm text-gray-400 italic">No preferences set — <button className="underline" onClick={() => setEditing(true)}>add some</button></p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Avatar + name + age */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Avatar</label>
              <select
                value={draft.avatar}
                onChange={e => setDraft(d => ({ ...d, avatar: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-lg bg-white"
              >
                {AVATAR_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Name</label>
              <input
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Age</label>
              <input
                type="number"
                value={draft.age}
                onChange={e => setDraft(d => ({ ...d, age: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                min={0} max={120}
              />
            </div>
          </div>

          {/* Diet style */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Eating style</label>
            <div className="flex flex-wrap gap-1.5">
              {DIET_STYLES.map(({ value, label, emoji }) => (
                <button key={value} onClick={() => toggleStyle(value as DietStyle)}
                  className={cn('chip text-xs', draft.dietary.style.includes(value as DietStyle) ? 'chip-active' : 'chip-default')}>
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Allergies <span className="text-red-400">(enforced as hard rules)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGY_OPTIONS.map(a => (
                <button key={a} onClick={() => toggleAllergy(a)}
                  className={cn('chip text-xs', draft.dietary.allergies.includes(a) ? 'chip-coral' : 'chip-default')}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Dislikes */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Dislikes <span className="text-gray-400 font-normal">(AI minimises these)</span>
            </label>
            <input
              value={draft.dietary.dislikes.join(', ')}
              onChange={e => setDraft(d => ({
                ...d,
                dietary: { ...d.dietary, dislikes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
              }))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
              placeholder="e.g. mushrooms, liver — separate with commas"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nutrition goals</label>
            <div className="flex flex-wrap gap-1.5">
              {NUTRITION_GOALS.map(({ value, label, emoji }) => (
                <button key={value} onClick={() => toggleGoal(value as NutritionGoal)}
                  className={cn('chip text-xs', draft.dietary.goals.includes(value as NutritionGoal) ? 'chip-active' : 'chip-default')}>
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine preferences */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Favourite cuisines <span className="text-gray-400 font-normal">(AI prioritises these)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CUISINE_OPTIONS.map(({ value, label, emoji }) => (
                <button key={value} onClick={() => toggleCuisine(value)}
                  className={cn('chip text-xs', (draft.dietary.cuisines ?? []).includes(value) ? 'chip-active' : 'chip-default')}>
                  {emoji} {label}
                </button>
              ))}
            </div>
            {(draft.dietary.cuisines ?? []).length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No cuisines selected — AI will choose freely</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function Family() {
  const navigate = useNavigate()
  const { family, setFamily, setMealPlan, setAgentNotes, setGroceryList, isGenerating, setIsGenerating } = useAppStore()
  const [planStale, setPlanStale] = useState(false)

  if (!family) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
        <h2 className="text-xl font-bold mb-2">No family profile yet</h2>
        <p className="text-gray-500">Complete onboarding to set up your family profile.</p>
      </div>
    )
  }

  function updateMember(id: string, patch: Partial<FamilyMember>) {
    if (!family) return
    setFamily({ ...family, members: family.members.map(m => m.id === id ? { ...m, ...patch } : m) })
    setPlanStale(true)
  }

  function addMember() {
    if (!family) return
    setFamily({ ...family, members: [...family.members, newMember()] })
    setPlanStale(true)
  }

  function deleteMember(id: string) {
    if (!family || family.members.length <= 1) return
    setFamily({ ...family, members: family.members.filter(m => m.id !== id) })
    setPlanStale(true)
  }

  async function handleRegenerate() {
    if (!family) return
    setIsGenerating(true)
    setGroceryList(null)
    try {
      const { plan, notes } = await generateMealPlan(family)
      setMealPlan(plan)
      setAgentNotes(notes)
      setPlanStale(false)
      navigate('/planner')
    } catch {
      setMealPlan(SEED_MEAL_PLAN)
      setAgentNotes([{
        agent: 'safety',
        message: 'Could not reach backend. Showing demo plan. Add your ANTHROPIC_API_KEY to backend/.env to generate a personalised plan.',
        type: 'warning',
      }])
      setPlanStale(false)
      navigate('/planner')
    } finally {
      setIsGenerating(false)
    }
  }

  const uniqueAllergies = [...new Set(family.members.flatMap(m => m.dietary.allergies))]

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{family.familyName}</h1>
        <p className="text-sm text-gray-500">
          {family.members.length} members · {formatCurrency(family.budget.total)}/week budget
        </p>
      </div>

      {/* Stale plan banner */}
      {planStale && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          style={{ background: 'var(--amber-muted)', borderColor: 'var(--amber)' }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 mb-0.5">Profile updated — meal plan is outdated</p>
            <p className="text-xs text-amber-700">
              Your family's preferences changed. Regenerate so every meal reflects the latest allergies, restrictions, and goals.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="btn-primary text-sm whitespace-nowrap shrink-0"
          >
            {isGenerating ? <Spinner size="sm" className="text-white" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating…' : 'Regenerate plan'}
          </button>
        </motion.div>
      )}

      {/* Active allergy alert */}
      {uniqueAllergies.length > 0 && (
        <div className="card p-4 mb-6 flex items-start gap-3"
          style={{ background: 'var(--coral-muted)', borderColor: 'var(--coral)' }}>
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">Active allergy alerts</p>
            <div className="flex flex-wrap gap-1.5">
              {uniqueAllergies.map(a => <span key={a} className="chip chip-coral text-xs py-0.5 px-2">{a}</span>)}
            </div>
            <p className="text-xs text-red-600 mt-2">
              These are hard rules — the AI will never include these in a meal for the affected member.
            </p>
          </div>
        </div>
      )}

      {/* AI insights */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">This week's insights</h2>
        <div className="space-y-2">
          {WEEKLY_INSIGHTS.map(({ icon, message, type }) => (
            <div key={message} className={cn(
              'flex items-start gap-3 p-3 rounded-xl text-sm',
              type === 'success' ? 'bg-[var(--sage-muted)]' : 'bg-[var(--amber-muted)]'
            )}>
              <span className="text-base shrink-0">{icon}</span>
              <p className={cn(type === 'success' ? 'text-emerald-700' : 'text-amber-800')}>{message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Family members</h2>
        <button onClick={addMember} className="btn-secondary text-xs py-2 px-3">
          <Plus className="w-3.5 h-3.5" /> Add member
        </button>
      </div>

      <div className="space-y-4">
        {family.members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            canDelete={family.members.length > 1}
            onUpdate={(patch) => updateMember(member.id, patch)}
            onDelete={() => deleteMember(member.id)}
          />
        ))}
      </div>

      {/* Budget */}
      <div className="card p-5 mt-6">
        <h3 className="font-semibold mb-1">Weekly budget</h3>
        <p className="text-xs text-gray-400 mb-4">The budget agent keeps meal costs within this limit.</p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold" style={{ color: 'var(--green)' }}>
            {formatCurrency(family.budget.total)}
          </span>
          <input
            type="range" min={50} max={500} step={10}
            value={family.budget.total}
            onChange={(e) => {
              setFamily({
                ...family,
                budget: { ...family.budget, total: Number(e.target.value), perDay: Math.round(Number(e.target.value) / 7) }
              })
              setPlanStale(true)
            }}
            className="flex-1 accent-green-700"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ≈ {formatCurrency(family.budget.perDay)}/day · {formatCurrency(Math.round(family.budget.total / 7 / family.members.length))} per person/day
        </p>
      </div>
    </div>
  )
}
