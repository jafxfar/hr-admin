'use client'

import {
  DASHBOARD_MONTH_LABELS_SHORT,
  type MonthlyVacancyPoint,
} from '@/hooks/use-combined-dashboard'
import { GlassCard, LegendItem, SkeletonBlock } from '../dashboard-glass-ui'

export interface AnnualVacancyTrendsWidgetProps {
  monthlyVacancies: MonthlyVacancyPoint[]
  maxBarValue: number
  isLoading: boolean
}

export const AnnualVacancyTrendsWidget = ({
  monthlyVacancies,
  maxBarValue,
  isLoading,
}: AnnualVacancyTrendsWidgetProps) => (
  <GlassCard variant="solid" className="col-span-12 lg:col-span-8">
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h3
          className="mb-1 text-xl font-bold text-app-text"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Годовая динамика вакансий
        </h3>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-app-text-muted">
          Открытые и закрытые за месяц
        </p>
      </div>
      <div className="flex gap-4 text-xs font-bold uppercase tracking-[0.2em]">
        <LegendItem color="var(--brand-accent)" label="Открытые" />
        <LegendItem color="var(--secondary)" label="Закрытые" />
      </div>
    </div>

    {isLoading && monthlyVacancies.length === 0 ? (
      <SkeletonBlock className="h-64" />
    ) : (
      <div className="flex h-64 w-full items-end justify-between gap-2">
        {monthlyVacancies.map((point) => {
          const openBarPct = (point.open / maxBarValue) * 100
          const closedBarPct = (point.closed / maxBarValue) * 100
          return (
            <div
              key={point.month}
              className="flex h-full flex-1 flex-col items-stretch justify-end gap-1"
              title={`${DASHBOARD_MONTH_LABELS_SHORT[point.month - 1]}: откр. ${point.open}, закр. ${point.closed}`}
            >
              <div className="flex h-full items-end gap-1">
                <div
                  className="w-full rounded-t-sm bg-brand-accent transition-all duration-500"
                  style={{ height: `${Math.max(openBarPct, 3)}%` }}
                />
                <div
                  className="w-full rounded-t-sm bg-secondary/40 transition-all duration-500"
                  style={{ height: `${Math.max(closedBarPct, 3)}%` }}
                />
              </div>
              <span className="mt-2 text-center text-xs font-semibold text-app-text-muted">
                {DASHBOARD_MONTH_LABELS_SHORT[point.month - 1]}
              </span>
            </div>
          )
        })}
      </div>
    )}
  </GlassCard>
)
