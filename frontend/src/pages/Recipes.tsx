import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, ChefHat, X, Plus } from 'lucide-react'
import { SEED_RECIPES } from '@/lib/seedData'
import { NutritionRing } from '@/components/ui/NutritionRing'
import type { Recipe } from '@/types'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'All', value: '' },
  { label: '⚡ Quick (<20 min)', value: 'quick' },
  { label: '🥗 Vegetarian', value: 'vegetarian' },
  { label: '💪 High-protein', value: 'high-protein' },
  { label: '🧒 Kid-friendly', value: 'kid-friendly' },
  { label: '🌾 Gluten-free', value: 'gluten-free' },
]

const DIFFICULTY_COLOR = {
  easy: 'chip-sage',
  medium: 'chip-amber',
  hard: 'chip-coral',
}

function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        className="relative card w-full max-w-lg max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 pt-6 pb-4 border-b border-gray-100 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
          <div className="text-4xl mb-2">{recipe.emoji}</div>
          <h2 className="text-xl font-bold">{recipe.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="chip chip-default text-xs">{recipe.cuisine}</span>
            <span className="chip chip-default text-xs">⏱️ {recipe.prepTime + recipe.cookTime} min</span>
            <span className={cn('chip text-xs', DIFFICULTY_COLOR[recipe.difficulty])}>{recipe.difficulty}</span>
            <span className="chip chip-default text-xs">🍽️ {recipe.servings} servings</span>
          </div>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Nutrition */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
              { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
              { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g' },
              { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                <p className="font-bold text-base" style={{ color: 'var(--green)' }}>{value}</p>
                <p className="text-[10px] text-gray-400">{unit}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Ingredients</h3>
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing) => (
                <div key={ing.name} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                  <span>{ing.name}</span>
                  <span className="text-gray-400">{ing.quantity} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">How to make it</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-white"
                    style={{ background: 'var(--green)', minWidth: '1.25rem' }}>
                    {i + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <button className="btn-primary w-full justify-center">
            <Plus className="w-4 h-4" /> Add to this week's plan
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Recipes() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [selected, setSelected] = useState<Recipe | null>(null)

  const filtered = SEED_RECIPES.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase())
    const matchFilter = !activeFilter
      || (activeFilter === 'quick' && r.prepTime + r.cookTime < 20)
      || r.tags.includes(activeFilter)
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Recipe library</h1>
        <p className="text-sm text-gray-500">{SEED_RECIPES.length} recipes · tap to see ingredients & steps</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or cuisine…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={cn('chip whitespace-nowrap', activeFilter === value ? 'chip-active' : 'chip-default')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>No recipes match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe, i) => (
            <motion.button
              key={recipe.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelected(recipe)}
              className="card p-5 text-left hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{recipe.emoji}</span>
                <NutritionRing
                  calories={recipe.nutrition.calories}
                  protein={recipe.nutrition.protein}
                  carbs={recipe.nutrition.carbs}
                  fat={recipe.nutrition.fat}
                  size={40}
                />
              </div>
              <h3 className="font-semibold text-base mb-1 leading-snug">{recipe.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip chip-default text-[11px] py-0.5 px-2">
                  <Clock className="w-3 h-3 inline mr-0.5" />
                  {recipe.prepTime + recipe.cookTime}m
                </span>
                <span className={cn('chip text-[11px] py-0.5 px-2', DIFFICULTY_COLOR[recipe.difficulty])}>
                  <ChefHat className="w-3 h-3 inline mr-0.5" />
                  {recipe.difficulty}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* AI suggestion prompt */}
      <div className="card p-6 mt-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl">✨</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold text-base mb-1">Don't see what you're after?</p>
          <p className="text-sm text-gray-500">Tell the AI what ingredients you have and it'll create a recipe just for your family.</p>
        </div>
        <button className="btn-primary text-sm whitespace-nowrap">
          Generate a recipe
        </button>
      </div>

      <AnimatePresence>
        {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
