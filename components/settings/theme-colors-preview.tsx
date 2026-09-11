'use client'

import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DarkInput } from '@/components/custom-ui'
import { getContrastColor } from '@/lib/theme-color-utils'

type ThemeColorsPreviewProps = {
  activePrimary: string
  activeSecondary: string
  activePrimaryRgb: string
}

export const ThemeColorsPreview = ({
  activePrimary,
  activeSecondary,
  activePrimaryRgb,
}: ThemeColorsPreviewProps) => {
  const onPrimary = getContrastColor(activePrimary)
  const onSecondary = getContrastColor(activeSecondary)

  return (
    <div className="app-shell-bg-preview rounded-3xl border border-app-border-accent p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-app-text-muted">Превью темы</p>
      <div
        className="grid gap-4 sm:grid-cols-2"
        style={
          {
            '--theme-primary': activePrimary,
            '--theme-secondary': activeSecondary,
            '--theme-primary-rgb': activePrimaryRgb,
            '--on-primary': onPrimary,
            '--on-secondary': onSecondary,
          } as CSSProperties
        }
      >
        <div className="app-card-glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-app-text-muted">Glass card</p>
          <div className="flex gap-1 rounded-full border border-app-border bg-app-surface-inset p-1">
            <span className="nav-pill-active rounded-full px-3 py-1.5 text-xs font-semibold">Активный</span>
            <span className="rounded-full px-3 py-1.5 text-xs text-app-text-muted">Раздел</span>
          </div>
        </div>
        <div className="app-card-solid rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-app-text-muted">Solid card</p>
          <div className="flex gap-1 rounded-full border border-app-border bg-app-surface-inset p-1">
            <span className="nav-pill-active rounded-full px-3 py-1.5 text-xs font-semibold">Активный</span>
            <span className="rounded-full px-3 py-1.5 text-xs text-app-text-muted">Раздел</span>
          </div>
        </div>
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: activeSecondary, color: onSecondary }}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Контрастный блок</p>
          <p className="text-sm font-semibold">Secondary surface</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button variant="primary" className="h-8 px-3 text-xs brand-glow-sm">
            Основная кнопка
          </Button>
          <Badge variant="secondary" className="h-6 px-3">Бейдж</Badge>
          <div className="w-44 shrink-0">
            <DarkInput value="Фокус превью" readOnly onChange={() => {}} aria-label="Превью фокуса" />
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: activePrimary, color: onPrimary }}
          >
            Primary accent
          </span>
        </div>
      </div>
    </div>
  )
}
