import type {
  PaginatedKpiDashboard,
  PaginatedTimesheetDashboard,
  KpiDashboardItem,
  TimesheetDashboardItem,
  VacanciesDashboardResponse,
  EmployeesDashboardResponse,
  HRMonthlyReportResponse,
  BranchEmployeesDashboardResponse,
} from '@/types/dashboard'
import { apiClient } from './client'

export interface TimesheetsDashboardParams {
  department_id?: number
  year: number
  month: number
  page?: number
  page_size?: number
}

export const dashboardApi = {
  getTimesheets: (params: TimesheetsDashboardParams): Promise<PaginatedTimesheetDashboard> => {
    const q: Record<string, string | number> = {
      year: params.year,
      month: params.month,
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
    }
    if (params.department_id !== undefined) {
      q.department_id = params.department_id
    }
    return apiClient.get<PaginatedTimesheetDashboard>('/dashboard/timesheets', q)
  },

  /** Загружает все страницы ответа (для графика по всем отделам). */
  getAllTimesheets: async (params: {
    department_id?: number
    year: number
    month: number
  }): Promise<TimesheetDashboardItem[]> => {
    const page_size = 20
    const first = await dashboardApi.getTimesheets({ ...params, page: 1, page_size })
    const items = [...first.items]
    for (let p = 2; p <= first.total_pages; p++) {
      const next = await dashboardApi.getTimesheets({ ...params, page: p, page_size })
      items.push(...next.items)
    }
    return items
  },

  getKpis: (params: TimesheetsDashboardParams): Promise<PaginatedKpiDashboard> => {
    const q: Record<string, string | number> = {
      year: params.year,
      month: params.month,
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
    }
    if (params.department_id !== undefined) {
      q.department_id = params.department_id
    }
    return apiClient.get<PaginatedKpiDashboard>('/dashboard/kpis', q)
  },

  getAllKpis: async (params: {
    department_id?: number
    year: number
    month: number
  }): Promise<KpiDashboardItem[]> => {
    const page_size = 20
    const first = await dashboardApi.getKpis({ ...params, page: 1, page_size })
    const items = [...first.items]
    for (let p = 2; p <= first.total_pages; p++) {
      const next = await dashboardApi.getKpis({ ...params, page: p, page_size })
      items.push(...next.items)
    }
    return items
  },

  getVacancies: (params: {
    year: number
    month: number
    type?: string
    category_id?: number
    business_role_id?: number
    is_published?: boolean
    is_closed?: boolean
  }): Promise<VacanciesDashboardResponse> => {
    const q: Record<string, string | number | boolean> = {
      year: params.year,
      month: params.month,
    }
    if (params.type !== undefined && params.type !== '') {
      q.type = params.type
    }
    if (params.category_id !== undefined) {
      q.category_id = params.category_id
    }
    if (params.business_role_id !== undefined) {
      q.business_role_id = params.business_role_id
    }
    if (params.is_published !== undefined) {
      q.is_published = params.is_published
    }
    if (params.is_closed !== undefined) {
      q.is_closed = params.is_closed
    }
    return apiClient.get<VacanciesDashboardResponse>('/dashboard/vacancies', q as Record<string, string | number>)
  },

  getEmployees: (params?: { department_id?: number }): Promise<EmployeesDashboardResponse> => {
    const q: Record<string, string | number> = {}
    if (params?.department_id !== undefined) {
      q.department_id = params.department_id
    }
    return apiClient.get<EmployeesDashboardResponse>('/dashboard/employees', q)
  },

  getEmployeesByBranch: (): Promise<BranchEmployeesDashboardResponse> =>
    apiClient.get<BranchEmployeesDashboardResponse>('/dashboard/employees-by-branch'),

  getHrReport: (params: {
    year: number
    month: number
    department_id?: number
  }): Promise<HRMonthlyReportResponse> => {
    const q: Record<string, string | number> = {
      year: params.year,
      month: params.month,
    }
    if (params.department_id !== undefined) {
      q.department_id = params.department_id
    }
    return apiClient.get<HRMonthlyReportResponse>('/dashboard/hr-report', q)
  },
}
