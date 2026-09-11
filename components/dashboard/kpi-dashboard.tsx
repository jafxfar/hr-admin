'use client'

import { dashboardApi } from '@/api/dashboard'
import { departmentsApi } from '@/api/departments'
import type { KpiDashboardItem } from '@/types/dashboard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DashboardChartEmpty,
  DashboardChartError,
  DashboardChartLoading,
} from './dashboard-chart-state'
import { dashboardChartColors, dashboardRechartsTooltipStyle } from './dashboard-chart-theme'
import { DASHBOARD_MONTH_OPTIONS } from './dashboard-month-options'
import { DashboardSection } from './dashboard-section'
import { DashboardStatCard } from './dashboard-stat-card'
import { DashboardToolbarField } from './dashboard-toolbar-field'

type DashboardOption = { value: string; label: string }

function DashboardSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value?: string
  onChange: (value: string) => void
  options: DashboardOption[]
  placeholder?: string
}) {
  const emptyOptionValue = '__empty__'
  const mappedValue = value === '' ? emptyOptionValue : (value ?? '')

  return (
    <Select
      value={mappedValue}
      onValueChange={(nextValue) => onChange(nextValue === emptyOptionValue ? '' : nextValue)}
    >
      <SelectTrigger className="w-full h-10 border border-app-border-accent rounded-full px-4 bg-app-surface-0 text-app-text-muted hover:text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] transition-all duration-200 focus:ring-1 focus:ring-[rgb(var(--theme-primary-rgb)/0.3)] [&_svg]:text-app-text-muted">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${option.label}`}
            value={option.value === '' ? emptyOptionValue : option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function formatKpi(n: number) {
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

export function KpiDashboardSection() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [departmentId, setDepartmentId] = useState<string>('')
  const [items, setItems] = useState<KpiDashboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deptOptions, setDeptOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    departmentsApi.getAllDepartments('', 1, 20).then((res) => {
      setDeptOptions([
        { value: '', label: 'Все отделы' },
        ...res.items.map((d) => ({
          value: String(d.id),
          label: d.name,
        })),
      ])
    })
  }, [])

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await dashboardApi.getAllKpis({
        year,
        month,
        department_id: departmentId ? Number(departmentId) : undefined,
      })
      setItems(data)
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: string }).message)
          : 'Не удалось загрузить данные'
      setError(msg)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [year, month, departmentId])

  useEffect(() => {
    void load()
  }, [load])

  const chartData = useMemo(() => {
    return items.map((row) => ({
      name: row.department_name,
      kpi: row.average_kpi ?? 0,
      hasKpi: row.average_kpi !== null,
    }))
  }, [items])

  const stats = useMemo(() => {
    const withValues = items.filter((r) => r.average_kpi !== null)
    const mean =
      withValues.length > 0
        ? withValues.reduce((s, r) => s + (r.average_kpi as number), 0) / withValues.length
        : null
    const noData = items.length - withValues.length
    return { mean, noData, totalDepts: items.length }
  }, [items])

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => {
      const val = y - 2 + i
      return { value: String(val), label: String(val) }
    })
  }, [])

  return (
    <div className="space-y-4">
      <h2
        className="text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        KPI
      </h2>
      <div className="flex flex-wrap items-end gap-3">
        <DashboardToolbarField label="Год" className="min-w-[140px]">
          <DashboardSelect value={String(year)} onChange={(v) => setYear(Number(v))} options={yearOptions} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Месяц" className="min-w-[160px]">
          <DashboardSelect value={String(month)} onChange={(v) => setMonth(Number(v))} options={DASHBOARD_MONTH_OPTIONS} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Отдел" className="min-w-[220px] flex-1">
          <DashboardSelect
            value={departmentId}
            onChange={setDepartmentId}
            options={deptOptions.length ? deptOptions : [{ value: '', label: 'Все отделы' }]}
          />
        </DashboardToolbarField>
      </div>

      <div className="admin-card-grid grid grid-cols-1 sm:grid-cols-3">
          <DashboardStatCard
            label="Средний KPI"
            value={stats.mean !== null ? formatKpi(stats.mean) : '—'}
          />
          <DashboardStatCard label="Отделов в выборке" value={String(stats.totalDepts)} />
          <DashboardStatCard
            label="Без данных KPI"
            variant="accent"
            value={String(stats.noData)}
          />
        </div>

        <DashboardSection
          title="KPI по отделам"
          description="Средний показатель KPI по отделам за выбранный месяц. Если данных нет, в подсказке отображается «Нет данных», столбец — нулевой."
        >
          {isLoading && <DashboardChartLoading />}

          {!isLoading && error && <DashboardChartError message={error} />}

          {!isLoading && !error && chartData.length === 0 && <DashboardChartEmpty />}

          {!isLoading && !error && chartData.length > 0 && (
            <div className="h-[min(420px,55vh)] w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: 8, bottom: chartData.length > 6 ? 72 : 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={dashboardChartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: dashboardChartColors.tick, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: dashboardChartColors.axis }}
                    interval={0}
                    angle={chartData.length > 5 ? -35 : 0}
                    textAnchor={chartData.length > 5 ? 'end' : 'middle'}
                    height={chartData.length > 5 ? 70 : 36}
                  />
                  <YAxis
                    tick={{ fill: dashboardChartColors.tick, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: dashboardChartColors.axis }}
                    label={{
                      value: 'KPI',
                      angle: -90,
                      position: 'insideLeft',
                      fill: dashboardChartColors.tick,
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    contentStyle={dashboardRechartsTooltipStyle}
                    labelStyle={{ color: dashboardChartColors.label }}
                    formatter={(value: number | string, _name: string, props: { payload?: { hasKpi?: boolean } }) => {
                      if (!props.payload?.hasKpi) {
                        return ['Нет данных', 'KPI']
                      }
                      return [formatKpi(Number(value)), 'Средний KPI']
                    }}
                  />
                  <Bar
                    dataKey="kpi"
                    name="kpi"
                    fill={dashboardChartColors.primary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={56}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </DashboardSection>
    </div>
  )
}
