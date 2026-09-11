import type { CSSProperties } from 'react'

/** Единые стили графиков (Recharts) под динамические токены темы. */

export const dashboardChartColors = {
  primary: 'var(--theme-primary)',
  secondary: 'var(--theme-secondary)',
  grid: 'rgb(var(--theme-primary-rgb) / 0.12)',
  axis: 'var(--app-border-accent)',
  tick: 'var(--app-text-muted)',
  label: 'var(--app-text)',
} as const

export const dashboardRechartsTooltipStyle: CSSProperties = {
  background: 'var(--app-surface-inset)',
  border: '1px solid var(--app-border-accent)',
  borderRadius: 12,
  fontSize: 12,
}
