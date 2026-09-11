'use client'

import { useMemo } from 'react'
import type { EmployeesDashboardResponse } from '@/types/dashboard'
import { DashboardChartEmpty, DashboardChartLoading } from '../dashboard-chart-state'
import { GlassCard } from '../dashboard-glass-ui'

export interface EmployeeAgeWidgetProps {
  employeesStats: EmployeesDashboardResponse | null
  isLoading: boolean
}

type AgeGroupRow = {
  label: string
  count: number
  pct: number
}

const AGE_GROUP_DEFS: { key: keyof Pick<EmployeesDashboardResponse, 'age_18_25' | 'age_26_35' | 'age_35_50' | 'age_50_plus'>; label: string }[] = [
  { key: 'age_18_25', label: '18–25' },
  { key: 'age_26_35', label: '26–35' },
  { key: 'age_35_50', label: '35–50' },
  { key: 'age_50_plus', label: '50+' },
]

const formatAverageAge = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })
}

export const EmployeeAgeWidget = ({
  employeesStats,
  isLoading,
}: EmployeeAgeWidgetProps) => {
  const ageGroups = useMemo<AgeGroupRow[]>(() => {
    if (!employeesStats) return []
    const counts = AGE_GROUP_DEFS.map(({ key, label }) => ({
      label,
      count: employeesStats[key],
    }))
    const knownTotal = counts.reduce((sum, row) => sum + row.count, 0)
    return counts.map((row) => ({
      ...row,
      pct: knownTotal > 0 ? Math.round((row.count / knownTotal) * 100) : 0,
    }))
  }, [employeesStats])

  const hasAgeData = ageGroups.some((row) => row.count > 0)

  return (
    <GlassCard variant="solid" className="col-span-12 flex flex-col lg:col-span-8">
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Возраст сотрудников
      </h3>
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Средний возраст и группы
      </p>

      {isLoading ? (
        <DashboardChartLoading className="h-[240px]" />
      ) : !employeesStats ? (
        <DashboardChartEmpty message="Нет данных о сотрудниках" />
      ) : (
        <div className="flex flex-1 flex-col gap-6">
          <div className="rounded-2xl border border-app-border bg-app-surface-1 px-6 py-4 text-center sm:max-w-xs">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
              Средний возраст
            </div>
            <div
              className="mt-1 text-3xl font-black text-app-text"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {formatAverageAge(employeesStats.average_age)}
            </div>
          </div>

          {hasAgeData ? (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
                Возрастные группы
              </p>
              {ageGroups.map((row) => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-app-text">{row.label}</span>
                    <span className="text-app-text-muted">
                      {row.count} ({row.pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-app-surface-4">
                    <div
                      className="h-full rounded-full bg-brand-accent transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                      role="presentation"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-app-text-muted">Нет данных о возрасте</p>
          )}
        </div>
      )}
    </GlassCard>
  )
}
