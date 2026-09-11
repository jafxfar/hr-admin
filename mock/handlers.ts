import { EMPTY_TASK_DASHBOARD } from '@/api/tasks'
import { MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from '@/lib/mock-config'
import {
  buildMockVacanciesDashboard,
  buildVacancyBoard,
  mockApplicationStatuses,
  mockBranches,
  mockBranchesTree,
  mockDepartments,
  mockDepartmentsTree,
  mockDocumentTypes,
  mockEmployees,
  mockEmployeesDashboard,
  mockFullEmployeePositionChanges,
  mockFullEmployeePositionHistory,
  mockHrReport,
  mockIdeas,
  mockIdeaComments,
  mockKpiDashboard,
  mockKpiDepartments,
  mockMatrixCatalog,
  mockMeEmployee,
  mockNews,
  mockNotifications,
  mockPermissions,
  mockPositions,
  mockRequests,
  mockRewards,
  mockRoles,
  mockSettingsFeatures,
  mockTimesheetDashboard,
  mockTimesheetDepartments,
  mockUiSettings,
  mockVacancies,
  mockVacancyApplications,
  mockVacancyCategories,
  mockVacations,
} from './data'
import { delay, getBoolParam, getIntParam, paginate, parseEndpoint } from './utils'

const filterByQuery = <T>(items: T[], q: string | null, getSearchable: (item: T) => string) => {
  if (!q?.trim()) return items
  const needle = q.trim().toLowerCase()
  return items.filter((item) => getSearchable(item).toLowerCase().includes(needle))
}

const findEmployeeById = (id: number) => mockEmployees.find((e) => e.id === id) ?? mockMeEmployee

const MOCK_UI_SETTINGS_STORAGE_KEY = 'fetch-hr-mock-ui-settings'

const readStoredMockUiSettings = () => {
  if (typeof window === 'undefined') return { ...mockUiSettings }

  try {
    const raw = localStorage.getItem(MOCK_UI_SETTINGS_STORAGE_KEY)
    if (!raw) return { ...mockUiSettings }

    const parsed = JSON.parse(raw) as Partial<typeof mockUiSettings>
    const merged = { ...mockUiSettings, ...parsed }
    Object.assign(mockUiSettings, merged)
    return merged
  } catch {
    return { ...mockUiSettings }
  }
}

const persistMockUiSettings = (patch: Partial<typeof mockUiSettings>) => {
  const next = { ...readStoredMockUiSettings(), ...patch }
  Object.assign(mockUiSettings, next)

  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_UI_SETTINGS_STORAGE_KEY, JSON.stringify(next))
  }

  return next
}

export const handleMockRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  responseType: 'blob' | 'json' = 'json',
): Promise<T> => {
  await delay()

  const method = (options.method ?? 'GET').toUpperCase()
  const { path, params } = parseEndpoint(endpoint)
  const body = options.body
    ? typeof options.body === 'string'
      ? JSON.parse(options.body)
      : options.body
    : undefined

  if (responseType === 'blob') {
    return new Blob(['mock export'], { type: 'application/octet-stream' }) as T
  }

  // ── Auth ──────────────────────────────────────────────────────────────────────
  if (method === 'POST' && path === '/auth/login') {
    return {
      access_token: MOCK_ACCESS_TOKEN,
      refresh_token: MOCK_REFRESH_TOKEN,
      token_type: 'bearer',
    } as T
  }

  if (method === 'POST' && path === '/auth/refresh') {
    return {
      access_token: MOCK_ACCESS_TOKEN,
      refresh_token: MOCK_REFRESH_TOKEN,
      token_type: 'bearer',
    } as T
  }

  // ── Settings ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/settings/system/features') return mockSettingsFeatures as T
  if (method === 'GET' && path === '/settings/system') return mockSettingsFeatures as T
  if (method === 'PATCH' && path === '/settings/system') return (body ?? mockSettingsFeatures) as T
  if (method === 'GET' && path === '/settings/ui/me') return readStoredMockUiSettings() as T
  if (method === 'PUT' && path === '/settings/ui/me') {
    return persistMockUiSettings(body ?? {}) as T
  }
  if (method === 'GET' && path === '/settings/document-types') {
    const category = params.get('category')
    const includeInactive = getBoolParam(params, 'include_inactive')
    let items = mockDocumentTypes
    if (category) items = items.filter((item) => item.category === category)
    if (!includeInactive) items = items.filter((item) => item.is_active)
    return { items } as T
  }

  // ── Employees ─────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/employees/employee/me') return mockMeEmployee as T

  const employeeByIdMatch = path.match(/^\/employees\/employee\/(\d+)$/)
  if (method === 'GET' && employeeByIdMatch) {
    return findEmployeeById(Number(employeeByIdMatch[1])) as T
  }

  if (method === 'GET' && (path === '/employees/all' || path === '/employees/search')) {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const q = params.get('q')
    const employeeStatus = params.get('employee_status')
    const employeeStatuses = params.getAll('employee_statuses')
    let items = [...mockEmployees]
    if (employeeStatus === 'active') items = items.filter((e) => e.is_active !== false)
    if (employeeStatus === 'terminated') items = items.filter((e) => e.is_active === false)
    if (employeeStatuses.length > 0) {
      items = items.filter((e) => {
        if (employeeStatuses.includes('active') && e.is_active !== false) return true
        if (employeeStatuses.includes('terminated') && e.is_active === false) return true
        if (employeeStatuses.includes('deleted') && e.is_active === false) return true
        return false
      })
    }
    items = filterByQuery(items, q, (e) =>
      [
        e.email,
        e.properties?.first_name,
        e.properties?.last_name,
        e.properties?.phone,
      ]
        .filter(Boolean)
        .join(' '),
    )
    return paginate(items, page, pageSize) as T
  }

  const deptEmployeesMatch = path.match(/^\/employees\/admin\/departments\/(\d+)\/employees$/)
  if (method === 'GET' && deptEmployeesMatch) {
    const deptId = Number(deptEmployeesMatch[1])
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const items = mockEmployees.filter((e) => e.department?.id === deptId)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/employees\/employee\/\d+\/position-history$/)) {
    const employeeId = Number(path.split('/')[3])
    if (employeeId === 99) return mockFullEmployeePositionHistory as T
    return [] as T
  }

  if (method === 'GET' && path.match(/^\/employees\/employee\/\d+\/position-change-reasons$/)) {
    const employeeId = Number(path.split('/')[3])
    if (employeeId === 99) return mockFullEmployeePositionChanges as T
    return [] as T
  }
  if (method === 'POST' && path === '/employees/employee/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/employees\/employee\/\d+$/)) return findEmployeeById(1) as T
  if (method === 'DELETE' && path.match(/^\/employees\/employee\/\d+\/profile-photo$/)) {
    const id = Number(path.split('/')[3])
    return { id } as T
  }
  if (method === 'DELETE' && path.match(/^\/employees\/employee\/\d+$/)) return {} as T

  // ── Departments ───────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/departments/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const q = params.get('q')
    const items = filterByQuery(mockDepartments, q, (d) => `${d.name} ${d.description ?? ''}`)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path === '/departments/tree') return mockDepartmentsTree as T

  const departmentByIdMatch = path.match(/^\/departments\/department\/(\d+)$/)
  if (method === 'GET' && departmentByIdMatch) {
    return (mockDepartments.find((d) => d.id === Number(departmentByIdMatch[1])) ?? mockDepartments[0]) as T
  }

  if (method === 'GET' && path.match(/^\/departments\/department\/\d+\/children$/)) return [] as T
  if (method === 'GET' && path.match(/^\/departments\/department\/\d+\/parents$/)) return [] as T
  if (method === 'POST' && path === '/departments/department/create') return 99 as T
  if (method === 'PATCH' && path.match(/^\/departments\/department\/\d+$/)) return mockDepartments[0] as T
  if (method === 'DELETE' && path.match(/^\/departments\/department\/\d+$/)) return {} as T

  // ── Branches ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/branches/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const q = params.get('q')
    const includeInactive = getBoolParam(params, 'include_inactive')
    let items = [...mockBranches]
    if (!includeInactive) items = items.filter((b) => b.is_active !== false)
    items = filterByQuery(items, q, (b) => `${b.name} ${b.code ?? ''} ${b.location ?? ''}`)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path === '/branches/tree') return mockBranchesTree as T

  if (method === 'POST' && path === '/branches/branch/create') return 99 as T
  if (method === 'PATCH' && path.match(/^\/branches\/branch\/\d+$/)) return mockBranches[0] as T
  if (method === 'DELETE' && path.match(/^\/branches\/branch\/\d+$/)) return {} as T

  // ── Positions ─────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/positions/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const q = params.get('q')
    const items = filterByQuery(mockPositions, q, (p) => `${p.title} ${p.description}`)
    return paginate(items, page, pageSize) as T
  }

  const positionByIdMatch = path.match(/^\/positions\/position\/(\d+)$/)
  if (method === 'GET' && positionByIdMatch) {
    return (mockPositions.find((p) => p.id === Number(positionByIdMatch[1])) ?? mockPositions[0]) as T
  }

  if (method === 'GET' && path.match(/^\/positions\/by-department\/\d+$/)) {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const deptId = Number(path.split('/')[3])
    const items = mockPositions.filter((p) => p.department_id === deptId)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/positions\/position\/\d+\/job-instruction$/)) {
    return { position_id: 1, is_active: false, path: null, url: null } as T
  }

  if (method === 'POST' && path === '/positions/position/create') return 99 as T
  if (method === 'PATCH' && path.match(/^\/positions\/position\/\d+$/)) return mockPositions[0] as T
  if (method === 'DELETE' && path.match(/^\/positions\/position\/\d+$/)) return {} as T

  // ── Permissions / Roles ─────────────────────────────────────────────────────
  if (method === 'GET' && path === '/permissions/') return mockPermissions as T
  if (method === 'GET' && path === '/permissions/roles-admin/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const includeInactive = getBoolParam(params, 'include_inactive')
    let items = [...mockRoles]
    if (!includeInactive) items = items.filter((r) => r.is_active)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path === '/permissions/matrix/catalog') return mockMatrixCatalog as T

  const roleMatrixMatch = path.match(/^\/permissions\/matrix\/roles\/(\d+)$/)
  if (method === 'GET' && roleMatrixMatch) {
    const roleId = Number(roleMatrixMatch[1])
    const role = mockRoles.find((r) => r.id === roleId) ?? mockRoles[0]
    return {
      role_id: role.id,
      role_name: role.name,
      scope_type: 'all',
      rows: mockMatrixCatalog,
    } as T
  }

  if (method === 'PUT' && roleMatrixMatch) {
    const roleId = Number(roleMatrixMatch[1])
    const role = mockRoles.find((r) => r.id === roleId) ?? mockRoles[0]
    return {
      role_id: role.id,
      role_name: role.name,
      scope_type: body?.scope_type ?? 'all',
      rows: body?.rows ?? mockMatrixCatalog,
    } as T
  }

  if (method === 'GET' && path.match(/^\/permissions\/roles\/\d+\/permissions$/)) return mockPermissions as T
  if (method === 'POST' && path === '/permissions/roles-admin/create') return mockRoles[1] as T
  if (method === 'PUT' && path.match(/^\/permissions\/roles-admin\/\d+$/)) return mockRoles[1] as T
  if (method === 'DELETE' && path.match(/^\/permissions\/roles-admin\/\d+$/)) return {} as T
  if (method === 'POST' && path.match(/^\/permissions\/roles\/\d+\/(assign|remove)-permissions$/)) {
    return { message: 'ok' } as T
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/dashboard/timesheets') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const deptId = params.get('department_id')
    let items = [...mockTimesheetDashboard]
    if (deptId) items = items.filter((i) => i.department_id === Number(deptId))
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path === '/dashboard/kpis') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const deptId = params.get('department_id')
    let items = [...mockKpiDashboard]
    if (deptId) items = items.filter((i) => i.department_id === Number(deptId))
    return paginate(items, page, pageSize) as T
  }

  // SCREENSHOT MOCK — удалить позже
  if (method === 'GET' && path === '/dashboard/vacancies') {
    const month = getIntParam(params, 'month', new Date().getMonth() + 1)
    const year = getIntParam(params, 'year', new Date().getFullYear())
    return { ...buildMockVacanciesDashboard(month), year } as T
  }

  if (method === 'GET' && path === '/dashboard/employees') {
    const deptId = params.get('department_id')
    if (!deptId) return mockEmployeesDashboard as T

    const scale = 0.28
    return {
      ...mockEmployeesDashboard,
      department_id: Number(deptId),
      total_employees: Math.round(mockEmployeesDashboard.total_employees * scale),
      official_employees: Math.round(mockEmployeesDashboard.official_employees * scale),
      unofficial_employees: Math.round(mockEmployeesDashboard.unofficial_employees * scale),
      male_employees: Math.round(mockEmployeesDashboard.male_employees * scale),
      female_employees: Math.round(mockEmployeesDashboard.female_employees * scale),
      unknown_gender_employees: Math.max(1, Math.round(mockEmployeesDashboard.unknown_gender_employees * scale)),
      average_age: mockEmployeesDashboard.average_age,
      age_18_25: Math.round(mockEmployeesDashboard.age_18_25 * scale),
      age_26_35: Math.round(mockEmployeesDashboard.age_26_35 * scale),
      age_35_50: Math.round(mockEmployeesDashboard.age_35_50 * scale),
      age_50_plus: Math.round(mockEmployeesDashboard.age_50_plus * scale),
    } as T
  }

  if (method === 'GET' && path === '/dashboard/hr-report') return mockHrReport as T

  // ── Timesheets ────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/timesheets/by-departments') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockTimesheetDepartments, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/timesheets\/by-departments\/\d+$/)) {
    const deptId = Number(path.split('/')[3])
    return (mockTimesheetDepartments.find((d) => d.department_id === deptId) ?? mockTimesheetDepartments[0]) as T
  }

  if (method === 'GET' && path.match(/^\/timesheets\/by-user\/\d+$/)) return [] as T
  if (method === 'POST' && path === '/timesheets/create') return 1 as T
  if (method === 'PUT' && path.match(/^\/timesheets\/\d+$/)) return { ok: true } as T
  if (method === 'DELETE' && path.match(/^\/timesheets\/\d+$/)) return {} as T

  // ── KPI ───────────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/kpis/by-departments') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockKpiDepartments, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/kpis\/by-departments\/\d+$/)) {
    const deptId = Number(path.split('/')[3])
    return (mockKpiDepartments.find((d) => d.department_id === deptId) ?? mockKpiDepartments[0]) as T
  }

  if (method === 'GET' && path === '/kpis/all') return paginate([], 1, 20) as T
  if (method === 'GET' && path.match(/^\/kpis\/by-user\/\d+$/)) return paginate([], 1, 20) as T
  if (method === 'GET' && path.match(/^\/kpis\/\d+$/)) return mockKpiDepartments[0].employees[0].kpis[0] as T
  if (method === 'POST' && path === '/kpis/create') return 1 as T
  if (method === 'PUT' && path.match(/^\/kpis\/\d+$/)) return { ok: true } as T
  if (method === 'PUT' && path === '/kpis/bulk/by-employees') return { ok: true } as T
  if (method === 'DELETE' && path.match(/^\/kpis\/\d+$/)) return {} as T

  // ── Requests ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/requests/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockRequests, page, pageSize) as T
  }

  const requestByIdMatch = path.match(/^\/requests\/(\d+)$/)
  if (method === 'GET' && requestByIdMatch) {
    return (mockRequests.find((r) => r.id === Number(requestByIdMatch[1])) ?? mockRequests[0]) as T
  }

  if (method === 'POST' && path === '/requests/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/requests\/\d+\/status$/)) return mockRequests[0] as T
  if (method === 'DELETE' && path.match(/^\/requests\/\d+$/)) return {} as T

  // ── Rewards ───────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/rewards/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockRewards, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/rewards\/by-user\/\d+$/)) return [] as T
  if (method === 'POST' && path === '/rewards/create') return 99 as T
  if (method === 'POST' && path.match(/^\/rewards\/\d+\/assign$/)) return { ok: true } as T
  if (method === 'PUT' && path.match(/^\/rewards\/\d+$/)) return mockRewards[0] as T
  if (method === 'DELETE' && path.match(/^\/rewards\/\d+(\/assign\/\d+)?$/)) return {} as T

  // ── Ideas ─────────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/ideas/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockIdeas, page, pageSize) as T
  }

  if (method === 'GET' && path === '/ideas/trending') return mockIdeas.slice(0, 3) as T
  if (method === 'GET' && path.match(/^\/ideas\/\d+$/)) {
    const id = Number(path.split('/')[2])
    const idea = mockIdeas.find((i) => i.id === id)
    if (!idea) throw new Error('Idea not found')
    return idea as T
  }
  if (method === 'GET' && path.match(/^\/ideas\/\d+\/comments$/)) {
    const id = Number(path.split('/')[2])
    return mockIdeaComments.filter((c) => c.idea_id === id) as T
  }
  if (method === 'POST' && path === '/ideas/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/ideas\/\d+$/)) return mockIdeas[0] as T
  if (method === 'DELETE' && path.match(/^\/ideas\/\d+$/)) return {} as T
  if (method === 'POST' && path.match(/^\/ideas\/\d+\/(comments|reaction)$/)) return { ok: true } as T
  if (method === 'DELETE' && path.match(/^\/ideas\/\d+\/reaction$/)) return {} as T

  // ── News ──────────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/news/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockNews, page, pageSize) as T
  }

  if (method === 'GET' && path.match(/^\/news\/\d+\/comments$/)) return [] as T
  if (method === 'POST' && path === '/news/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/news\/\d+$/)) return mockNews[0] as T
  if (method === 'DELETE' && path.match(/^\/news\/\d+$/)) return {} as T
  if (method === 'POST' && path.match(/^\/news\/\d+\/(comments|reaction)$/)) return { ok: true } as T
  if (method === 'DELETE' && path.match(/^\/news\/\d+\/reaction$/)) return {} as T

  // ── Vacancies ─────────────────────────────────────────────────────────────────
  if (method === 'GET' && (path === '/vacancies/all' || path === '/vacancies/admin')) {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const q = params.get('q')
    const items = filterByQuery(mockVacancies, q, (v) => `${v.title} ${v.body}`)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'POST' && path === '/vacancies/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/vacancies\/\d+$/)) return mockVacancies[0] as T
  if (method === 'DELETE' && path.match(/^\/vacancies\/\d+$/)) return {} as T

  // ── Vacancy categories ────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/vacancy-categories/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockVacancyCategories, page, pageSize) as T
  }

  if (method === 'POST' && path === '/vacancy-categories/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/vacancy-categories\/\d+$/)) return mockVacancyCategories[0] as T
  if (method === 'DELETE' && path.match(/^\/vacancy-categories\/\d+$/)) return {} as T

  // ── Vacancy applications ──────────────────────────────────────────────────────
  if (method === 'GET' && path === '/vacancy-applications/admin') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockVacancyApplications, page, pageSize) as T
  }

  if (method === 'GET' && path === '/vacancy-applications/enrolls') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const vacancyId = params.get('vacancy_id')
    let items = [...mockVacancyApplications]
    if (vacancyId) items = items.filter((a) => a.vacancy_id === Number(vacancyId))
    return paginate(items, page, pageSize) as T
  }

  if (method === 'GET' && path === '/vacancy-applications/statuses') {
    const includeInactive = getBoolParam(params, 'include_inactive')
    const items = includeInactive
      ? mockApplicationStatuses
      : mockApplicationStatuses.filter((s) => s.is_active)
    return { items } as T
  }

  if (method === 'GET' && path === '/vacancy-applications/enrolls/board') {
    const vacancyId = params.get('vacancy_id')
    return buildVacancyBoard(vacancyId ? Number(vacancyId) : null) as T
  }

  const boardByVacancyMatch = path.match(/^\/vacancy-applications\/enrolls\/(\d+)\/board$/)
  if (method === 'GET' && boardByVacancyMatch) {
    return buildVacancyBoard(Number(boardByVacancyMatch[1])) as T
  }

  if (method === 'POST' && path === '/vacancy-applications/statuses') return mockApplicationStatuses[0] as T
  if (method === 'PATCH' && path.match(/^\/vacancy-applications\/statuses\//)) return mockApplicationStatuses[0] as T
  if (method === 'DELETE' && path.match(/^\/vacancy-applications\/statuses\//)) return {} as T
  if (method === 'PATCH' && path.match(/^\/vacancy-applications\/enrolls\/\d+\/board-position$/)) return { ok: 'true' } as T
  if (method === 'PATCH' && path.match(/^\/vacancy-applications\/admin\/\d+$/)) return { ok: 'true' } as T
  if (method === 'POST' && path.match(/^\/vacancies\/\d+\/applications$/)) return { id: 99 } as T

  // ── Vacations / Leaves ────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/vacations/all') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    return paginate(mockVacations, page, pageSize) as T
  }

  if (method === 'GET' && path === '/vacations/my') return mockVacations as T
  if (method === 'POST' && path === '/vacations/employee/create') return 99 as T
  if (method === 'PUT' && path.match(/^\/vacations\/\d+\/status$/)) return mockVacations[0] as T
  if (method === 'DELETE' && path.match(/^\/vacations\/\d+$/)) return {} as T

  // ── Notifications ─────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/notifications/my/unread-count') return { unread: 2 } as T

  if (method === 'GET' && path === '/notifications/my') {
    const page = getIntParam(params, 'page', 1)
    const pageSize = getIntParam(params, 'page_size', 20)
    const isRead = params.get('is_read')
    let items = [...mockNotifications]
    if (isRead === 'true') items = items.filter((n) => n.is_read)
    if (isRead === 'false') items = items.filter((n) => !n.is_read)
    return paginate(items, page, pageSize) as T
  }

  if (method === 'PATCH' && path.startsWith('/notifications/my/')) return { updated: 1 } as T
  if (method === 'DELETE' && path.match(/^\/notifications\/my\/\d+$/)) return {} as T

  // ── Related employee data (profile edit) ──────────────────────────────────────
  if (method === 'GET' && path.match(/^\/(contracts|educations|work-experiences|salaries|schedules|documents)\/by-user\/\d+$/)) {
    return [] as T
  }

  if (method === 'POST' && path.match(/^\/(contracts|educations|work-experiences|salaries|schedules|documents)\/create$/)) {
    return 1 as T
  }

  if (method === 'PUT' && path.match(/^\/(contracts|educations|work-experiences|salaries|schedules|documents)\/\d+$/)) {
    return { ok: true } as T
  }

  if (method === 'DELETE' && path.match(/^\/(contracts|educations|work-experiences|salaries|schedules|documents)\/\d+$/)) {
    return {} as T
  }

  // ── Tasks ───────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/tasks/dashboard') {
    return {
      ...EMPTY_TASK_DASHBOARD,
      total: 12,
      open: 8,
      completed: 4,
      overdue: 1,
      unassigned: 2,
      without_project: 3,
      due_today: 2,
      due_this_week: 5,
      completion_percent: 33,
      by_status: [
        { code: 'todo', title: 'К выполнению', count: 5, percent: 42 },
        { code: 'in_progress', title: 'В работе', count: 3, percent: 25 },
        { code: 'done', title: 'Готово', count: 4, percent: 33 },
      ],
      by_project: [
        {
          id: 1,
          name: 'HR Portal',
          total: 7,
          completed: 3,
          overdue: 1,
          completion_percent: 43,
        },
        {
          id: 2,
          name: 'Mobile App',
          total: 5,
          completed: 1,
          overdue: 0,
          completion_percent: 20,
        },
      ],
    } as T
  }

  // ── Business roles ────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/business-roles/all') return paginate([], 1, 20) as T
  if (method === 'POST' && path === '/business-roles/create') return 1 as T
  if (method === 'PUT' && path.match(/^\/business-roles\/\d+$/)) return { ok: true } as T
  if (method === 'DELETE' && path.match(/^\/business-roles\/\d+$/)) return {} as T

  console.warn(`[mock] Unhandled ${method} ${path}`)
  return {} as T
}
