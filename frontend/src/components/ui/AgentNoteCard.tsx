import { motion } from 'framer-motion'
import { ShieldCheck, Flame, ShoppingCart, Shuffle, PiggyBank } from 'lucide-react'
import type { AgentNote } from '@/types'
import { cn } from '@/lib/utils'

const AGENT_META = {
  safety: { icon: ShieldCheck, label: 'Safety', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  nutrition: { icon: Flame, label: 'Nutrition', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  grocery: { icon: ShoppingCart, label: 'Grocery', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  variety: { icon: Shuffle, label: 'Variety', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  budget: { icon: PiggyBank, label: 'Budget', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
}

interface Props { note: AgentNote; delay?: number }

export function AgentNoteCard({ note, delay = 0 }: Props) {
  const meta = AGENT_META[note.agent]
  const Icon = meta.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn('flex items-start gap-3 p-3 rounded-xl border text-sm', meta.bg)}
    >
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', meta.color)} />
      <div>
        <span className={cn('font-semibold text-xs uppercase tracking-wide', meta.color)}>
          {meta.label} ·{' '}
        </span>
        <span className="text-gray-700">{note.message}</span>
      </div>
    </motion.div>
  )
}
