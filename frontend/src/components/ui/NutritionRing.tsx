interface Props {
  calories: number
  protein: number
  carbs: number
  fat: number
  size?: number
}

export function NutritionRing({ calories, protein, carbs, fat, size = 48 }: Props) {
  const total = protein + carbs + fat
  if (total === 0) return null

  const r = (size / 2) * 0.72
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r

  const pPct = protein / total
  const cPct = carbs / total
  // fat fills the rest

  const pDash = pPct * circ
  const cDash = cPct * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        {/* bg track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={size * 0.14} />
        {/* fat (amber) */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8A020" strokeWidth={size * 0.14}
          strokeDasharray={circ} strokeDashoffset={0} strokeLinecap="round" />
        {/* carbs (sage) */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7BAE7F" strokeWidth={size * 0.14}
          strokeDasharray={`${pDash + cDash} ${circ}`} strokeDashoffset={0} strokeLinecap="round" />
        {/* protein (green) */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2D5016" strokeWidth={size * 0.14}
          strokeDasharray={`${pDash} ${circ}`} strokeDashoffset={0} strokeLinecap="round" />
      </svg>
      {size >= 48 && (
        <span className="text-[10px] font-semibold text-gray-500">{calories} kcal</span>
      )}
    </div>
  )
}
