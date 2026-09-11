'use client'

import { useMemo } from 'react'
import type { HRMonthlyReportResponse } from '@/types/dashboard'
import { DashboardChartEmpty, DashboardChartLoading } from '../dashboard-chart-state'
import { GlassCard } from '../dashboard-glass-ui'

export interface HrApplicationFunnelWidgetProps {
  hrReport: HRMonthlyReportResponse | null
  isLoading: boolean
}

type FunnelRow = {
  label: string
  count: number
  pct: number
}

const FUNNEL_DEFS: { key: keyof Pick<
  HRMonthlyReportResponse,
  'applications_new' | 'applications_in_review' | 'applications_contacted' | 'applications_accepted' | 'applications_rejected'
>; label: string }[] = [
  { key: 'applications_new', label: 'Новые' },
  { key: 'applications_in_review', label: 'На рассмотрении' },
  { key: 'applications_contacted', label: 'Связались' },
  { key: 'applications_accepted', label: 'Приняты' },
  { key: 'applications_rejected', label: 'Отклонены' },
]

export const HrApplicationFunnelWidget = ({ hrReport, isLoading }: HrApplicationFunnelWidgetProps) => {
  const rows = useMemo<FunnelRow[]>(() => {
    if (!hrReport) return []
    const counts = FUNNEL_DEFS.map(({ key, label }) => ({
      label,
      count: hrReport[key],
    }))
    const total = counts.reduce((sum, row) => sum + row.count, 0)
    return counts.map((row) => ({
      ...row,
      pct: total > 0 ? Math.round((row.count / total) * 100) : 0,
    }))
  }, [hrReport])

  const hasData = rows.some((row) => row.count > 0)

  return (
    <GlassCard variant="glass" className="col-span-12 flex flex-col lg:col-span-4">
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Воронка откликов
      </h3>
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Статусы за период
      </p>

      {isLoading ? (
        <DashboardChartLoading className="h-[240px]" />
      ) : !hrReport ? (
        <DashboardChartEmpty message="Нет данных об откликах" />
      ) : !hasData ? (
        <DashboardChartEmpty message="Нет откликов за период" />
      ) : (
        <div className="flex flex-1 flex-col justify-center space-y-4">
          {rows.map((row) => (
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
      )}
    </GlassCard>
  )
}
