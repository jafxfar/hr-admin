import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DashboardStatCardProps {
  label: string
  value: ReactNode
  /** Подчёркивание ключевой метрики (например отклонение) */
  variant?: 'default' | 'accent'
  className?: string
}

export function DashboardStatCard({ label, value, variant = 'default', className }: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        'app-card-solid rounded-2xl px-5 py-4',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-app-text-muted">{label}</p>
      <p
        className={cn(
          'mt-1 font-mono text-2xl font-semibold tabular-nums',
          variant === 'accent' ? 'text-brand-accent' : 'text-app-text',
        )}
      >
        {value}
      </p>
    </div>
  )
}
