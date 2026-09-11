import type { KPIEmployee } from '@/api/kpi'

export interface KPITableEmployee {
  id: number
  name: string
  position: string
  avatar?: string
  kpi: number
  bonus: number
  dailyKpi: { [key: string]: number }
}

export const mapKpiEmployeeToTableRow = (emp: KPIEmployee): KPITableEmployee => {
  const dailyKpi: { [key: string]: number } = {}

  for (const kpi of emp.kpis) {
    if (kpi.actual_value == null) continue
    if (kpi.period) {
      const parts = kpi.period.split('-')
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10)
        if (!isNaN(day)) dailyKpi[day] = kpi.actual_value
      }
    } else {
      const day = new Date(kpi.created_at).getDate()
      if (!isNaN(day)) dailyKpi[day] = kpi.actual_value
    }
  }

  const values = emp.kpis
    .filter((k) => k.actual_value != null)
    .map((k) => k.actual_value as number)
  const avgKpi =
    values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0

  const displayName =
    [emp.first_name, emp.last_name].filter(Boolean).join(' ').trim() ||
    emp.email?.trim() ||
    `Сотрудник #${emp.user_id}`

  return {
    id: emp.user_id,
    name: displayName,
    position: '',
    kpi: avgKpi,
    bonus: 0,
    dailyKpi,
  }
}
