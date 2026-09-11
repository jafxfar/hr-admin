'use client'

import type { HRMonthlyReportResponse } from '@/types/dashboard'
import { DashboardChartLoading } from '../dashboard-chart-state'
import { GlassCard } from '../dashboard-glass-ui'

export interface HrReportSummaryWidgetProps {
  hrReport: HRMonthlyReportResponse | null
  isLoading: boolean
}

type MetricCard = {
  label: string
  value: string
  accent?: boolean
}

const formatPercent = (value: number) =>
  value.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + '%'

const formatDays = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })
}

export const HrReportSummaryWidget = ({ hrReport, isLoading }: HrReportSummaryWidgetProps) => {
  const metrics: MetricCard[] = hrReport
    ? [
        { label: 'Открытые вакансии', value: String(hrReport.vacancies_open_end) },
        { label: 'Закрыто за месяц', value: String(hrReport.vacancies_closed) },
        { label: 'Создано за месяц', value: String(hrReport.vacancies_created) },
        { label: 'Текучесть', value: formatPercent(hrReport.turnover_percent), accent: true },
        { label: 'Набор', value: String(hrReport.hired_in_month) },
        { label: 'Увольнения', value: String(hrReport.leavers_in_month) },
        { label: 'Откликов получено', value: String(hrReport.applications_received) },
        { label: 'Нанято из откликов', value: String(hrReport.hires_from_applications) },
        { label: 'Конверсия', value: formatPercent(hrReport.conversion_rate) },
        { label: 'Принятие оффера', value: formatPercent(hrReport.offer_acceptance_rate) },
        { label: 'Ср. время закрытия (дн.)', value: formatDays(hrReport.average_time_to_fill_days) },
      ]
    : []

  return (
    <GlassCard variant="glass" className="col-span-12">
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        HR-отчёт за период
      </h3>
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Вакансии, отклики и движение персонала
      </p>

      {isLoading ? (
        <DashboardChartLoading className="h-32" />
      ) : !hrReport ? (
        <p className="text-sm text-app-text-muted">Нет данных за выбранный период.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-app-border bg-app-surface-1 px-4 py-3"
            >
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-app-text-muted">
                {metric.label}
              </div>
              <div
                className={`mt-1 text-2xl font-black tabular-nums ${metric.accent ? 'text-brand-accent' : 'text-app-text'}`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
