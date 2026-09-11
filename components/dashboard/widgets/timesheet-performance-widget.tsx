'use client'

import { ArrowUpRight } from 'lucide-react'
import type { TimesheetRow } from '@/hooks/use-combined-dashboard'
import { formatDashboardNumber, GlassCard, SkeletonBlock } from '../dashboard-glass-ui'

export interface TimesheetPerformanceWidgetProps {
  rows: TimesheetRow[]
  totals: { actual: number; expected: number }
  isLoading: boolean
}

export const TimesheetPerformanceWidget = ({
  rows,
  totals,
  isLoading,
}: TimesheetPerformanceWidgetProps) => (
  <GlassCard variant="solid" className="col-span-12 space-y-8 lg:col-span-8" data-marketing="timesheet-admin">
    <div>
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Эффективность табеля
      </h3>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Факт против нормы по отделам
      </p>
    </div>

    <div className="space-y-5">
      {isLoading && rows.length === 0 ? (
        <>
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-full" />
        </>
      ) : rows.length === 0 ? (
        <p className="text-sm text-app-text-muted">Нет данных по табелю за выбранный период.</p>
      ) : (
        rows.slice(0, 5).map((row, index) => {
          const clamped = Math.min(row.efficiency, 100)
          const isAccent = index % 2 === 0
          return (
            <div key={row.id} className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
                <span className="text-app-text">{row.name}</span>
                <span className={isAccent ? 'text-brand-accent' : 'text-secondary'}>
                  {formatDashboardNumber(row.efficiency)}% эффективность
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-app-surface-0">
                <div
                  className={`h-full rounded-full ${isAccent ? 'bg-brand-accent' : 'bg-secondary'}`}
                  style={{ width: `${clamped}%`, transition: 'width 600ms ease' }}
                />
              </div>
            </div>
          )
        })
      )}
    </div>

    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-app-text-muted">
      <p>
        Всего отработано:{' '}
        <span className="font-bold text-app-text">{formatDashboardNumber(totals.actual)} ч</span>
        {' / '}
        норма{' '}
        <span className="font-bold text-app-text">{formatDashboardNumber(totals.expected)} ч</span>
      </p>
      <span className="flex items-center gap-1 text-sm font-bold text-brand-accent">
        Подробнее <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  </GlassCard>
)
