'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { AdminCard } from '@/components/admin-card'

export const formatDashboardNumber = (n: number) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })

type GlassCardProps = {
  children: ReactNode
  className?: string
  contrast?: boolean
  variant?: 'solid' | 'glass'
  asPanel?: boolean
} & HTMLAttributes<HTMLDivElement>

export function GlassCard({
  children,
  className = '',
  contrast = false,
  variant = 'glass',
  asPanel = false,
  ...rest
}: GlassCardProps) {
  return (
    <AdminCard variant={variant} contrast={contrast} asPanel={asPanel} className={className} {...rest}>
      {children}
    </AdminCard>
  )
}

export function CombinedToolbarField({
  label,
  minWidth,
  children,
}: {
  label: string
  minWidth: number
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5" style={{ minWidth }}>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--glass-ink-soft)]">{label}</span>
      {children}
    </div>
  )
}

export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-app-text-muted">
      <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-app-surface-1 ${className}`} />
}

export function BalanceRow({
  icon,
  iconWrapperClass,
  value,
  label,
  barColor,
  barPct,
}: {
  icon: ReactNode
  iconWrapperClass: string
  value: string
  label: string
  barColor: string
  barPct: number
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrapperClass}`}>
          {icon}
        </div>
        <div>
          <div
            className="text-2xl font-black text-app-text"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {value}
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">{label}</div>
        </div>
      </div>
      <div className="h-1 w-20 overflow-hidden rounded-full bg-app-surface-1">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.max(barPct, 2)}%`, transition: 'width 600ms ease' }}
        />
      </div>
    </div>
  )
}
