export interface TimesheetDashboardItem {
  department_id: number
  department_name: string
  employees_count: number
  actual_hours: number
  expected_hours: number
  workload_percent: number | null
  year: number
  month: number
}

export interface PaginatedTimesheetDashboard {
  items: TimesheetDashboardItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface KpiDashboardItem {
  department_id: number
  department_name: string
  employees_count: number
  average_kpi: number | null
  year: number
  month: number
}

export interface PaginatedKpiDashboard {
  items: KpiDashboardItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/** Ответ GET /dashboard/vacancies (одна сводка за период и фильтры). */
export interface VacanciesDashboardResponse {
  year: number
  month: number
  type: string | null
  category_id: number | null
  business_role_id: number | null
  is_published: boolean | null
  is_closed: boolean | null
  total_vacancies: number
  open_vacancies: number
  closed_vacancies: number
  closed_this_year: number
  closed_in_month: number
}

/** Ответ GET /dashboard/employees */
export interface EmployeesDashboardResponse {
  department_id: number | null
  total_employees: number
  official_employees: number
  unofficial_employees: number
  male_employees: number
  female_employees: number
  unknown_gender_employees: number
  average_age: number | null
  age_18_25: number
  age_26_35: number
  age_35_50: number
  age_50_plus: number
}

/** Ответ GET /dashboard/employees-by-branch */
export interface BranchEmployeesDashboardItem {
  branch_id: number
  branch_name: string
  active_employees_count: number
}

export interface BranchEmployeesDashboardResponse {
  items: BranchEmployeesDashboardItem[]
}

export interface HRMonthlyTrendItem {
  year: number
  month: number
  hires: number
  leavers: number
  vacancies_created: number
  vacancies_closed: number
}

/** Ответ GET /dashboard/hr-report */
export interface HRMonthlyReportResponse {
  year: number
  month: number
  branch_id: number | null
  department_id: number | null
  headcount_start: number
  headcount_end: number
  hired_in_month: number
  leavers_in_month: number
  turnover_percent: number
  vacancies_created: number
  vacancies_closed: number
  vacancies_open_end: number
  applications_received: number
  hires_from_applications: number
  conversion_rate: number
  offer_acceptance_rate: number
  average_time_to_fill_days: number | null
  applications_new: number
  applications_in_review: number
  applications_contacted: number
  applications_accepted: number
  applications_rejected: number
  monthly_hiring_trend: HRMonthlyTrendItem[]
}
