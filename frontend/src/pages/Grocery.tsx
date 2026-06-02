import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, Loader2, ExternalLink } from 'lucide-react'
import { useAppStore } from '@/store'
import { SEED_MEAL_PLAN } from '@/lib/seedData'
import { AISLE_LABELS, formatCurrency } from '@/lib/utils'
import { sendToInstacart } from '@/lib/api'
import type { GroceryItem, GroceryAisle, GroceryList } from '@/types'
import { cn } from '@/lib/utils'

function buildGroceryList(plan: typeof SEED_MEAL_PLAN): GroceryList {
  const map = new Map<string, GroceryItem>()

  plan.slots.forEach((slot) => {
    if (!slot.meal) return
    slot.meal.ingredients.forEach((ing) => {
      const key = ing.name.toLowerCase()
      if (map.has(key)) {
        const existing = map.get(key)!
        map.set(key, {
          ...existing,
          quantity: existing.quantity + 1,
          totalCost: existing.totalCost + ing.estimatedCost,
          usedIn: [...existing.usedIn, slot.meal!.name],
        })
      } else {
        map.set(key, {
          id: crypto.randomUUID(),
          ingredient: ing,
          checked: false,
          usedIn: [slot.meal!.name],
          quantity: 1,
          totalCost: ing.estimatedCost,
        })
      }
    })
  })

  const items = Array.from(map.values())
  const byAisle = {} as GroceryList['byAisle']
  const aisles: GroceryAisle[] = ['produce', 'meat', 'dairy', 'pantry', 'frozen', 'bakery', 'spices', 'snacks', 'beverages']
  aisles.forEach((a) => {
    byAisle[a] = items.filter((i) => i.ingredient.aisle === a)
  })

  return {
    items,
    byAisle,
    totalCost: items.reduce((s, i) => s + i.totalCost, 0),
  }
}

export function Grocery() {
  const { mealPlan, groceryList, setGroceryList, toggleGroceryItem, family } = useAppStore()
  const [cartLoading, setCartLoading] = useState(false)
  const [cartUrl, setCartUrl] = useState<string | null>(null)

  // Build or use persisted grocery list
  const gl = useMemo(() => {
    if (groceryList) return groceryList
    if (!mealPlan) return null
    const built = buildGroceryList(mealPlan)
    setGroceryList(built)
    return built
  }, [groceryList, mealPlan])

  if (!gl) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-2">No grocery list yet</h2>
        <p className="text-gray-500">Set up your meal plan first to generate a grocery list.</p>
      </div>
    )
  }

  const checkedCount = gl.items.filter(i => i.checked).length
  const progress = gl.items.length > 0 ? (checkedCount / gl.items.length) * 100 : 0

  async function handleInstacart() {
    setCartLoading(true)
    try {
      const { cartUrl } = await sendToInstacart(gl!)
      setCartUrl(cartUrl)
    } finally {
      setCartLoading(false)
    }
  }

  const aisles = (Object.keys(AISLE_LABELS) as GroceryAisle[]).filter(a => gl.byAisle[a]?.length > 0)

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Grocery list</h1>
          <p className="text-sm text-gray-500">
            {gl.items.length} items · {formatCurrency(gl.totalCost)} est.
            {family && ` · Budget ${formatCurrency(family.budget.total)}`}
          </p>
        </div>
        <button
          onClick={handleInstacart}
          disabled={cartLoading}
          className="btn-primary text-sm"
        >
          {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          {cartLoading ? 'Sending…' : 'Order via Instacart'}
        </button>
      </div>

      {/* Instacart success */}
      {cartUrl && (
        <motion.a
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          href={cartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm font-medium"
          style={{ background: 'var(--sage-muted)', color: 'var(--green)' }}
        >
          <Check className="w-4 h-4 shrink-0" />
          Cart sent to Instacart! Tap to open and checkout.
          <ExternalLink className="w-3.5 h-3.5 ml-auto" />
        </motion.a>
      )}

      {/* Progress */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Shopping progress</span>
          <span className="text-gray-400">{checkedCount} / {gl.items.length} items</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all"
            style={{ background: progress === 100 ? 'var(--sage)' : 'var(--green)', width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {progress === 100 && (
          <p className="text-sm text-emerald-600 font-medium mt-2">🎉 All done! Happy cooking!</p>
        )}
      </div>

      {/* Budget meter */}
      {family && (
        <div className="card p-4 mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Weekly spend estimate</span>
            <span className={cn('font-semibold', gl.totalCost > family.budget.total ? 'text-red-500' : 'text-gray-700')}>
              {formatCurrency(gl.totalCost)} / {formatCurrency(family.budget.total)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (gl.totalCost / family.budget.total) * 100)}%`,
                background: gl.totalCost > family.budget.total ? 'var(--coral)' : 'var(--amber)',
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {gl.totalCost <= family.budget.total
              ? `${formatCurrency(family.budget.total - gl.totalCost)} under budget`
              : `${formatCurrency(gl.totalCost - family.budget.total)} over budget`}
          </p>
        </div>
      )}

      {/* Items by aisle */}
      <div className="space-y-6">
        {aisles.map((aisle, aisleIdx) => (
          <motion.div
            key={aisle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: aisleIdx * 0.06 }}
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {AISLE_LABELS[aisle]}
            </h3>
            <div className="card overflow-hidden">
              {gl.byAisle[aisle].map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => toggleGroceryItem(item.id)}
                  className={cn(
                    'w-full flex items-center gap-4 px-4 py-3.5 text-left transition-all hover:bg-gray-50',
                    i < gl.byAisle[aisle].length - 1 && 'border-b border-gray-50'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                    item.checked
                      ? 'border-transparent'
                      : 'border-gray-300'
                  )} style={item.checked ? { background: 'var(--green)' } : {}}>
                    {item.checked && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', item.checked && 'line-through text-gray-400')}>
                      {item.ingredient.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.ingredient.quantity} {item.ingredient.unit}
                      {item.usedIn.length > 1 && ` · ${item.usedIn.length} meals`}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 shrink-0">
                    {formatCurrency(item.totalCost)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-8" />
    </div>
  )
}
