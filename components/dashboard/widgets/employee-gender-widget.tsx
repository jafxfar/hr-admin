'use client'

import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { EmployeesDashboardResponse } from '@/types/dashboard'
import { DashboardChartEmpty, DashboardChartLoading } from '../dashboard-chart-state'
import { dashboardChartColors, dashboardRechartsTooltipStyle } from '../dashboard-chart-theme'
import { GlassCard } from '../dashboard-glass-ui'

export interface EmployeeGenderWidgetProps {
  employeesStats: EmployeesDashboardResponse | null
  isLoading: boolean
}

type GenderSlice = {
  name: string
  value: number
  color: string
}

const GENDER_COLORS = {
  male: 'var(--brand-accent)',
  female: 'var(--app-text-muted)',
} as const

export const EmployeeGenderWidget = ({
  employeesStats,
  isLoading,
}: EmployeeGenderWidgetProps) => {
  const genderData = useMemo<GenderSlice[]>(() => {
    if (!employeesStats) return []
    const slices: GenderSlice[] = []
    if (employeesStats.male_employees > 0) {
      slices.push({
        name: 'Мужской',
        value: employeesStats.male_employees,
        color: GENDER_COLORS.male,
      })
    }
    if (employeesStats.female_employees > 0) {
      slices.push({
        name: 'Женский',
        value: employeesStats.female_employees,
        color: GENDER_COLORS.female,
      })
    }
    return slices
  }, [employeesStats])

  const genderTotal = useMemo(
    () => genderData.reduce((sum, item) => sum + item.value, 0),
    [genderData],
  )

  const hasGenderData = genderTotal > 0

  return (
    <GlassCard variant="glass" className="col-span-12 flex flex-col lg:col-span-4" data-marketing="gender">
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Состав по полу
      </h3>
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Распределение команды
      </p>

      {isLoading ? (
        <DashboardChartLoading className="h-[240px]" />
      ) : !employeesStats ? (
        <DashboardChartEmpty message="Нет данных о сотрудниках" />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          {hasGenderData ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    stroke="transparent"
                  >
                    {genderData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={dashboardRechartsTooltipStyle}
                    labelStyle={{ color: dashboardChartColors.label }}
                    formatter={(value: number, name: string) => {
                      const pct = genderTotal > 0 ? Math.round((value / genderTotal) * 100) : 0
                      return [`${value} (${pct}%)`, name]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DashboardChartEmpty message="Нет данных о поле" className="min-h-[176px] w-full" />
          )}

          {hasGenderData ? (
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {genderData.map((item) => {
                const pct = genderTotal > 0 ? Math.round((item.value / genderTotal) * 100) : 0
                return (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-app-text-muted">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                    <span className="font-medium text-app-text">{item.name}</span>
                    <span>
                      {item.value} ({pct}%)
                    </span>
                  </div>
                )
              })}
            </div>
          ) : null}

          {employeesStats.unknown_gender_employees > 0 ? (
            <p className="mt-3 text-xs font-medium text-app-text-muted">
              Не указан: {employeesStats.unknown_gender_employees}
            </p>
          ) : null}
        </div>
      )}
    </GlassCard>
  )
}
