import { cn } from '@/lib/utils'

interface Props { size?: 'sm' | 'md' | 'lg'; className?: string }

export function Spinner({ size = 'md', className }: Props) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size]
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', s, className)}
      role="status"
      aria-label="Loading"
    />
  )
}
