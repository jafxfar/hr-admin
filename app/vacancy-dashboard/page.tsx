'use client'

import { HRLayout } from '@/components/hr-layout'
import { useCombinedDashboard } from '@/hooks/use-combined-dashboard'
import { DashboardHeroToolbar } from '@/components/dashboard/dashboard-hero-toolbar'
import { AnnualVacancyTrendsWidget } from '@/components/dashboard/widgets/annual-vacancy-trends-widget'
import { HrApplicationFunnelWidget } from '@/components/dashboard/widgets/hr-application-funnel-widget'
import { HrMonthlyTrendWidget } from '@/components/dashboard/widgets/hr-monthly-trend-widget'
import { HrReportSummaryWidget } from '@/components/dashboard/widgets/hr-report-summary-widget'
import { VacancyBalanceWidget } from '@/components/dashboard/widgets/vacancy-balance-widget'

/**
 * Страница «Аналитика» — бэнто-сетка с ключевыми метриками HR.
 */
export default function VacancyDashboardPage() {
  const d = useCombinedDashboard()

  return (
    <HRLayout title="Аналитика вакансий">
      <main className="admin-content-inset flex min-h-full flex-col gap-3">
        <DashboardHeroToolbar
          departmentId={d.departmentId}
          year={d.year}
          month={d.month}
          deptOptions={d.deptOptions}
          yearOptions={d.yearOptions}
          onDepartmentChange={d.setDepartmentId}
          onYearChange={(v) => d.setYear(Number(v))}
          onMonthChange={(v) => d.setMonth(Number(v))}
        />

            {!d.isVacanciesEnabled ? (
              <div className="rounded-3xl border border-app-border bg-app-surface-0 px-8 py-16 text-center shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
                <p className="text-lg font-semibold text-app-text">Модуль вакансий отключён</p>
                <p className="mt-2 text-sm text-app-text-muted">
                  Включите модуль вакансий в настройках, чтобы видеть данные рекрутинга.
                </p>
              </div>
            ) : (
              <section className="admin-card-grid grid grid-cols-12 pb-12">
                <HrReportSummaryWidget hrReport={d.hrReport} isLoading={d.isLoading} />
                <HrApplicationFunnelWidget hrReport={d.hrReport} isLoading={d.isLoading} />
                <HrMonthlyTrendWidget
                  trend={d.hrReport?.monthly_hiring_trend ?? []}
                  isLoading={d.isLoading}
                />
                <AnnualVacancyTrendsWidget
                  monthlyVacancies={d.monthlyVacancies}
                  maxBarValue={d.maxBarValue}
                  isLoading={d.isLoading}
                />
                <VacancyBalanceWidget
                  vacancySummary={d.vacancySummary}
                  openPct={d.openPct}
                  closedPct={d.closedPct}
                />
              </section>
            )}

      </main>
    </HRLayout>
  )
}
