'use client'

import { Filter, Share2 } from 'lucide-react'
import { DASHBOARD_MONTH_OPTIONS } from './dashboard-month-options'
import { DashboardSelect } from './dashboard-select'
import { CombinedToolbarField } from './dashboard-glass-ui'
import type { DeptOption } from '@/hooks/use-combined-dashboard'
import type { DashboardSelectOption } from './dashboard-select'

export interface DashboardHeroToolbarProps {
  departmentId: string
  year: number
  month: number
  deptOptions: DeptOption[]
  yearOptions: DashboardSelectOption[]
  onDepartmentChange: (value: string) => void
  onYearChange: (value: string) => void
  onMonthChange: (value: string) => void
}

export const DashboardHeroToolbar = ({
  departmentId,
  year,
  month,
  deptOptions,
  yearOptions,
  onDepartmentChange,
  onYearChange,
  onMonthChange,
}: DashboardHeroToolbarProps) => (
  <section className="flex flex-wrap items-end justify-between gap-6 px-1 text-[var(--glass-ink)]">
    <div className="space-y-5">
      <h2
        className="text-4xl font-extrabold tracking-tight text-[var(--glass-ink)] md:text-5xl"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Insights{' '}
        <span
          className="italic text-brand-accent"
          style={{ textShadow: '0 0 18px rgb(var(--theme-primary-rgb) / 0.35)' }}
        >
          Engine
        </span>
      </h2>

      <div className="flex flex-wrap gap-3">
        <CombinedToolbarField label="Отдел" minWidth={220}>
          <DashboardSelect value={departmentId} onChange={onDepartmentChange} options={deptOptions} />
        </CombinedToolbarField>
        <CombinedToolbarField label="Год" minWidth={140}>
          <DashboardSelect value={String(year)} onChange={onYearChange} options={yearOptions} />
        </CombinedToolbarField>
        <CombinedToolbarField label="Месяц" minWidth={160}>
          <DashboardSelect
            value={String(month)}
            onChange={onMonthChange}
            options={DASHBOARD_MONTH_OPTIONS}
          />
        </CombinedToolbarField>
      </div>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        className="app-glass-inset flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        <Filter className="h-4 w-4" />
        Фильтры
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-accent-on transition-opacity hover:opacity-90"
      >
        <Share2 className="h-4 w-4" />
        Экспорт
      </button>
    </div>
  </section>
)
