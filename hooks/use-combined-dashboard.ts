'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { dashboardApi } from '@/api/dashboard'
import { departmentsApi } from '@/api/departments'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { isFeatureEnabled } from '@/lib/feature-access'
import type {
  BranchEmployeesDashboardItem,
  EmployeesDashboardResponse,
  HRMonthlyReportResponse,
  KpiDashboardItem,
  TimesheetDashboardItem,
  VacanciesDashboardResponse,
} from '@/types/dashboard'

export const DASHBOARD_MONTH_LABELS_SHORT = [
  'ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК',
]

export type DashboardTab = 'recruiting' | 'employees'

export type MonthlyVacancyPoint = {
  month: number
  open: number
  closed: number
}

export type DeptOption = { value: string; label: string }

export type TimesheetRow = {
  id: number
  name: string
  actual: number
  expected: number
  efficiency: number
}

export function useCombinedDashboard() {
  const now = useMemo(() => new Date(), [])
  const [year, setYear] = useState(() => now.getFullYear())
  const [month, setMonth] = useState(() => now.getMonth() + 1)
  const [departmentId, setDepartmentId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<DashboardTab>('recruiting')

  const { data: settingsFeatures } = useSettingsFeatures()
  const features = settingsFeatures?.features
  const isVacanciesEnabled = isFeatureEnabled('vacancies_enabled', features)
  const isBranchesEnabled = isFeatureEnabled('branches_enabled', features)
  const isTimesheetsEnabled = isFeatureEnabled('timesheets_enabled', features)
  const isKpiEnabled = isFeatureEnabled('kpi_enabled', features)

  const [deptOptions, setDeptOptions] = useState<DeptOption[]>([{ value: '', label: 'Все отделы' }])
  const [timesheets, setTimesheets] = useState<TimesheetDashboardItem[]>([])
  const [kpis, setKpis] = useState<KpiDashboardItem[]>([])
  const [employeesStats, setEmployeesStats] = useState<EmployeesDashboardResponse | null>(null)
  const [employeesByBranch, setEmployeesByBranch] = useState<BranchEmployeesDashboardItem[]>([])
  const [hrReport, setHrReport] = useState<HRMonthlyReportResponse | null>(null)
  const [vacancySummary, setVacancySummary] = useState<VacanciesDashboardResponse | null>(null)
  const [monthlyVacancies, setMonthlyVacancies] = useState<MonthlyVacancyPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    departmentsApi
      .getAllDepartments('', 1, 20)
      .then((res) => {
        if (cancelled) return
        setDeptOptions([
          { value: '', label: 'Все отделы' },
          ...res.items.map((d) => ({ value: String(d.id), label: d.name })),
        ])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const loadRecruiting = useCallback(async (dept: number | undefined) => {
    const vacancyPromise = isVacanciesEnabled
      ? dashboardApi.getVacancies({ year, month })
      : Promise.resolve<VacanciesDashboardResponse | null>(null)

    const monthlySeriesPromise = isVacanciesEnabled
      ? (async () => {
          const series: MonthlyVacancyPoint[] = []
          for (let i = 0; i < 12; i++) {
            try {
              const res = await dashboardApi.getVacancies({ year, month: i + 1 })
              series.push({
                month: i + 1,
                open: res.open_vacancies,
                closed: res.closed_in_month,
              })
            } catch {
              series.push({ month: i + 1, open: 0, closed: 0 })
            }
          }
          return series
        })()
      : Promise.resolve<MonthlyVacancyPoint[]>([])

    const hrReportPromise = isVacanciesEnabled
      ? dashboardApi.getHrReport({ year, month, department_id: dept })
      : Promise.resolve<HRMonthlyReportResponse | null>(null)

    const [vacancyRes, monthlySeries, hrReportRes] = await Promise.all([
      vacancyPromise,
      monthlySeriesPromise,
      hrReportPromise,
    ])

    setVacancySummary(vacancyRes)
    setMonthlyVacancies(monthlySeries)
    setHrReport(hrReportRes)
  }, [year, month, isVacanciesEnabled])

  const loadEmployees = useCallback(async (
    dept: number | undefined,
    branchesEnabled: boolean,
    timesheetsEnabled: boolean,
    kpiEnabled: boolean,
  ) => {
    const branchPromise = branchesEnabled
      ? dashboardApi.getEmployeesByBranch()
      : Promise.resolve({ items: [] as BranchEmployeesDashboardItem[] })

    const timesheetsPromise = timesheetsEnabled
      ? dashboardApi.getAllTimesheets({ year, month, department_id: dept })
      : Promise.resolve([] as TimesheetDashboardItem[])

    const kpisPromise = kpiEnabled
      ? dashboardApi.getAllKpis({ year, month, department_id: dept })
      : Promise.resolve([] as KpiDashboardItem[])

    const [timesheetsRes, kpisRes, employeesRes, branchRes] = await Promise.all([
      timesheetsPromise,
      kpisPromise,
      dashboardApi.getEmployees({ department_id: dept }),
      branchPromise,
    ])
    setTimesheets(timesheetsRes)
    setKpis(kpisRes)
    setEmployeesStats(employeesRes)
    setEmployeesByBranch(branchRes?.items ?? [])
  }, [year, month])

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const dept = departmentId ? Number(departmentId) : undefined
    try {
      await loadEmployees(dept, isBranchesEnabled, isTimesheetsEnabled, isKpiEnabled)
      if (isVacanciesEnabled) {
        await loadRecruiting(dept)
      }
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: string }).message)
          : 'Не удалось загрузить данные'
      setError(msg)
      if (activeTab === 'recruiting') {
        setVacancySummary(null)
        setMonthlyVacancies([])
        setHrReport(null)
      } else {
        setTimesheets([])
        setKpis([])
        setEmployeesStats(null)
        setEmployeesByBranch([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    activeTab,
    departmentId,
    isBranchesEnabled,
    isTimesheetsEnabled,
    isKpiEnabled,
    loadRecruiting,
    loadEmployees,
  ])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const yearOptions = useMemo(() => {
    const y = now.getFullYear()
    return Array.from({ length: 6 }, (_, i) => {
      const val = y - 2 + i
      return { value: String(val), label: String(val) }
    })
  }, [now])

  const kpiStats = useMemo(() => {
    const withValues = kpis.filter((r) => r.average_kpi !== null) as (KpiDashboardItem & {
      average_kpi: number
    })[]
    const mean =
      withValues.length > 0
        ? withValues.reduce((s, r) => s + r.average_kpi, 0) / withValues.length
        : null
    const onTarget = withValues.filter((r) => r.average_kpi >= 80).length
    const critical = withValues.filter((r) => r.average_kpi < 60).length
    return { mean, onTarget, critical, total: kpis.length, rated: withValues.length }
  }, [kpis])

  const timesheetRows = useMemo<TimesheetRow[]>(() => {
    return timesheets.map((r) => ({
      id: r.department_id,
      name: r.department_name,
      actual: r.actual_hours,
      expected: r.expected_hours,
      efficiency:
        r.expected_hours > 0 ? Math.min((r.actual_hours / r.expected_hours) * 100, 140) : 0,
    }))
  }, [timesheets])

  const timesheetTotals = useMemo(() => {
    const actual = timesheets.reduce((s, r) => s + r.actual_hours, 0)
    const expected = timesheets.reduce((s, r) => s + r.expected_hours, 0)
    return { actual, expected }
  }, [timesheets])

  const maxBarValue = useMemo(() => {
    const values = monthlyVacancies.flatMap((m) => [m.open, m.closed])
    const max = values.reduce((a, b) => (b > a ? b : a), 0)
    return max > 0 ? max : 1
  }, [monthlyVacancies])

  const dashRadius = 80
  const dashCircumference = 2 * Math.PI * dashRadius
  const kpiPercent = kpiStats.mean !== null ? Math.max(0, Math.min(100, kpiStats.mean)) : 0
  const kpiDashOffset = dashCircumference - (kpiPercent / 100) * dashCircumference

  const vacancyTotal = vacancySummary?.total_vacancies ?? 0
  const openPct =
    vacancyTotal > 0 ? Math.round(((vacancySummary?.open_vacancies ?? 0) / vacancyTotal) * 100) : 0
  const closedPct = vacancyTotal > 0 ? 100 - openPct : 0

  return {
    year,
    setYear,
    month,
    setMonth,
    departmentId,
    setDepartmentId,
    activeTab,
    setActiveTab,
    isVacanciesEnabled,
    isBranchesEnabled,
    isTimesheetsEnabled,
    isKpiEnabled,
    deptOptions,
    yearOptions,
    isLoading,
    error,
    monthlyVacancies,
    maxBarValue,
    kpiStats,
    kpiPercent,
    dashRadius,
    dashCircumference,
    kpiDashOffset,
    timesheetRows,
    timesheetTotals,
    vacancySummary,
    openPct,
    closedPct,
    employeesStats,
    employeesByBranch,
    hrReport,
  }
}
