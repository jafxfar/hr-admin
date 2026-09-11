'use client'

import { HRLayout } from '@/components/hr-layout'
import { useCombinedDashboard } from '@/hooks/use-combined-dashboard'
import { DashboardHeroToolbar } from './dashboard-hero-toolbar'
import { EmployeeAgeWidget } from './widgets/employee-age-widget'
import { EmployeeGenderWidget } from './widgets/employee-gender-widget'
import { KpiHealthWidget } from './widgets/kpi-health-widget'
import { BranchEmployeesWidget } from './widgets/branch-employees-widget'
import { TimesheetPerformanceWidget } from './widgets/timesheet-performance-widget'

/**
 * Страница «Аналитика» — бэнто-сетка с ключевыми метриками HR.
 */
export function CombinedDashboardPage() {
  const d = useCombinedDashboard()

  return (
    <HRLayout title="Статистика">
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
            <section className="admin-card-grid grid grid-cols-12 pb-12">
              {d.isBranchesEnabled ? (
                <BranchEmployeesWidget items={d.employeesByBranch} isLoading={d.isLoading} />
              ) : null}

              {d.isTimesheetsEnabled ? (
                <TimesheetPerformanceWidget
                  rows={d.timesheetRows}
                  totals={d.timesheetTotals}
                  isLoading={d.isLoading}
                />
              ) : null}

              {d.isKpiEnabled ? (
                <KpiHealthWidget
                  kpiPercent={d.kpiPercent}
                  kpiMean={d.kpiStats.mean}
                  dashRadius={d.dashRadius}
                  dashCircumference={d.dashCircumference}
                  kpiDashOffset={d.kpiDashOffset}
                  onTarget={d.kpiStats.onTarget}
                  critical={d.kpiStats.critical}
                />
              ) : null}

              <EmployeeGenderWidget
                employeesStats={d.employeesStats}
                isLoading={d.isLoading}
              />

              <EmployeeAgeWidget
                employeesStats={d.employeesStats}
                isLoading={d.isLoading}
              />
            </section>
      </main>
    </HRLayout>
  )
}
