'use client'

import { useMemo } from 'react'
import type { HRMonthlyTrendItem } from '@/types/dashboard'
import { DASHBOARD_MONTH_LABELS_SHORT } from '@/hooks/use-combined-dashboard'
import { DashboardChartEmpty, DashboardChartLoading } from '../dashboard-chart-state'
import { GlassCard, LegendItem, SkeletonBlock } from '../dashboard-glass-ui'

export interface HrMonthlyTrendWidgetProps {
  trend: HRMonthlyTrendItem[]
  isLoading: boolean
}

type TrendPoint = HRMonthlyTrendItem & {
  label: string
  maxValue: number
}

export const HrMonthlyTrendWidget = ({ trend, isLoading }: HrMonthlyTrendWidgetProps) => {
  const points = useMemo<TrendPoint[]>(() => {
    if (trend.length === 0) return []
    const maxValue = trend.reduce((max, item) => {
      const itemMax = Math.max(item.hires, item.leavers, item.vacancies_created, item.vacancies_closed)
      return itemMax > max ? itemMax : max
    }, 0)
    const safeMax = maxValue > 0 ? maxValue : 1
    return trend.map((item) => ({
      ...item,
      label: DASHBOARD_MONTH_LABELS_SHORT[item.month - 1] ?? String(item.month),
      maxValue: safeMax,
    }))
  }, [trend])

  const hasData = points.some(
    (p) => p.hires > 0 || p.leavers > 0 || p.vacancies_created > 0 || p.vacancies_closed > 0,
  )

  return (
    <GlassCard variant="solid" className="col-span-12 lg:col-span-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3
            className="mb-1 text-xl font-bold text-app-text"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Динамика найма
          </h3>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-app-text-muted">
            Набор, увольнения и вакансии по месяцам
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.2em]">
          <LegendItem color="var(--brand-accent)" label="Набор" />
          <LegendItem color="var(--secondary)" label="Увольнения" />
          <LegendItem color="rgb(148 163 184)" label="Создано вак." />
          <LegendItem color="rgb(100 116 139)" label="Закрыто вак." />
        </div>
      </div>

      {isLoading && points.length === 0 ? (
        <SkeletonBlock className="h-64" />
      ) : !hasData ? (
        <DashboardChartEmpty message="Нет данных по динамике" className="min-h-[256px]" />
      ) : (
        <div className="flex h-64 w-full items-end justify-between gap-2">
          {points.map((point) => {
            const hiresPct = (point.hires / point.maxValue) * 100
            const leaversPct = (point.leavers / point.maxValue) * 100
            const createdPct = (point.vacancies_created / point.maxValue) * 100
            const closedPct = (point.vacancies_closed / point.maxValue) * 100
            return (
              <div
                key={`${point.year}-${point.month}`}
                className="flex h-full flex-1 flex-col items-stretch justify-end gap-1"
                title={`${point.label}: набор ${point.hires}, увольн. ${point.leavers}`}
              >
                <div className="flex flex-1 items-end justify-center gap-0.5">
                  <div
                    className="w-2 rounded-t-sm bg-brand-accent transition-all duration-500"
                    style={{ height: `${hiresPct}%`, minHeight: point.hires > 0 ? 4 : 0 }}
                  />
                  <div
                    className="w-2 rounded-t-sm bg-secondary transition-all duration-500"
                    style={{ height: `${leaversPct}%`, minHeight: point.leavers > 0 ? 4 : 0 }}
                  />
                  <div
                    className="w-2 rounded-t-sm bg-slate-400 transition-all duration-500"
                    style={{ height: `${createdPct}%`, minHeight: point.vacancies_created > 0 ? 4 : 0 }}
                  />
                  <div
                    className="w-2 rounded-t-sm bg-slate-500 transition-all duration-500"
                    style={{ height: `${closedPct}%`, minHeight: point.vacancies_closed > 0 ? 4 : 0 }}
                  />
                </div>
                <span className="text-center text-xs font-bold uppercase tracking-wider text-app-text-muted">
                  {point.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </GlassCard>
  )
}
