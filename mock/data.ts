import { IdeaStatus } from '@/types/idea'
import { VacationStatus, VacationType } from '@/types/vacation'
import type { Branch, BranchTreeNode } from '@/api/branches'
import type { KPIDepartment } from '@/api/kpi'
import type { TimesheetDepartment } from '@/api/timesheet'
import type { Department } from '@/types/departments'
import type {
  Employee,
  EmployeePositionChangeHistoryEntry,
  PositionHistoryEntry,
} from '@/types/employees'
import type { Permission, PermissionMatrixRow, PermissionRoleResponse } from '@/types/permission'
import type { Positions } from '@/types/positions'
import type { Request } from '@/types/request'
import type { Reward } from '@/types/rewards'
import type { Idea, IdeaComment } from '@/types/idea'
import type { News } from '@/types/news'
import type { Vacancy } from '@/types/vacancies'
import type { VacancyCategory } from '@/types/vacancyCategories'
import type { VacancyApplication } from '@/types/vacancyApplications'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'
import type { Vacation } from '@/types/vacation'
import type { NotificationListItem } from '@/types/notifications'
import type { DocumentTypeItem } from '@/api/settings'
import type {
  EmployeesDashboardResponse,
  HRMonthlyReportResponse,
  HRMonthlyTrendItem,
  KpiDashboardItem,
  TimesheetDashboardItem,
  VacanciesDashboardResponse,
} from '@/types/dashboard'

const now = new Date()
const iso = (offsetDays = 0) => {
  const d = new Date(now)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString()
}

export const mockBranches: Branch[] = [
  {
    id: 1,
    name: 'Головной офис',
    description: 'Центральный офис в Алматы',
    code: 'HQ',
    location: 'Алматы, пр. Абая 150',
    parent_id: null,
    created_at: iso(-400),
    updated_at: iso(-10),
    is_active: true,
  },
  {
    id: 2,
    name: 'Филиал Астана',
    description: 'Региональный офис',
    code: 'AST',
    location: 'Астана, ул. Кенесары 40',
    parent_id: 1,
    created_at: iso(-300),
    updated_at: iso(-5),
    is_active: true,
  },
]

export const mockDepartments: Department[] = [
  {
    id: 1,
    name: 'Дирекция',
    description: 'Руководство компании',
    parent_id: null,
    branch_id: 1,
    created_at: iso(-365),
    head_user: { id: 1, full_name: 'Азамат Шерматов', first_name: 'Дадабоев', last_name: 'Шерзод' },
    allowed_positions: [{ id: 1, title: 'Генеральный директор' }],
  },
  {
    id: 2,
    name: 'HR-отдел',
    description: 'Управление персоналом',
    parent_id: 1,
    branch_id: 1,
    created_at: iso(-300),
    head_user: { id: 2, full_name: 'Дадабоев Шерзод', first_name: 'Азамат', last_name: 'Шерматов' },
    allowed_positions: [
      { id: 2, title: 'HR-менеджер' },
      { id: 3, title: 'Рекрутер' },
    ],
  },
  {
    id: 3,
    name: 'IT-отдел',
    description: 'Разработка и инфраструктура',
    parent_id: 1,
    branch_id: 1,
    created_at: iso(-280),
    head_user: { id: 3, full_name: 'Фуркатчон Насриддинов', first_name: 'Фуркатчон', last_name: 'Насриддинов' },
    allowed_positions: [
      { id: 4, title: 'Team Lead' },
      { id: 5, title: 'Frontend-разработчик' },
      { id: 6, title: 'Backend-разработчик' },
    ],
  },
  {
    id: 4,
    name: 'Продажи',
    description: 'Коммерческий блок',
    parent_id: 1,
    branch_id: 2,
    created_at: iso(-200),
    head_user: { id: 4, full_name: 'Фахриддин Сангинов', first_name: 'Фахриддин', last_name: 'Сангинов' },
    allowed_positions: [{ id: 7, title: 'Менеджер по продажам' }],
  },
]

export const mockDepartmentsTree: Department[] = [
  {
    ...mockDepartments[0],
    level: 0,
    path: 'Дирекция',
    children: mockDepartments.slice(1).map((dept, index) => ({
      ...dept,
      level: 1,
      path: `Дирекция / ${dept.name}`,
      children: [],
      icon: ['#d6fd70', '#2453ff', '#1db82b', '#f1ee46'][index] ?? null,
    })),
  },
]

function buildDepartmentTreeForBranch(branchId: number): Department[] {
  const items = mockDepartments
    .filter((d) => d.branch_id === branchId)
    .map((d) => ({ ...d, children: [] as Department[] }))
  const nodes = new Map(items.map((d) => [d.id, d]))
  const roots: Department[] = []
  for (const item of items) {
    const pid = item.parent_id
    if (pid == null || pid === 0 || !nodes.has(pid)) {
      roots.push(item)
    } else {
      nodes.get(pid)!.children!.push(item)
    }
  }
  return roots
}

function buildBranchTreeNode(branch: Branch): BranchTreeNode {
  const children = mockBranches
    .filter((b) => b.parent_id === branch.id)
    .map(buildBranchTreeNode)
  return {
    ...branch,
    children,
    departments: buildDepartmentTreeForBranch(branch.id),
  }
}

export const mockBranchesTree: BranchTreeNode[] = mockBranches
  .filter((b) => b.parent_id == null)
  .map(buildBranchTreeNode)

export const mockPositions: Positions[] = [
  { id: 1, department_id: 1, title: 'Генеральный директор', description: 'Стратегическое управление' },
  { id: 2, department_id: 2, title: 'HR-менеджер', description: 'Кадровое администрирование' },
  { id: 3, department_id: 2, title: 'Рекрутер', description: 'Подбор персонала' },
  { id: 4, department_id: 3, title: 'Team Lead', description: 'Техническое руководство' },
  { id: 5, department_id: 3, title: 'Frontend-разработчик', description: 'React / Next.js' },
  { id: 6, department_id: 3, title: 'Backend-разработчик', description: 'Python / FastAPI' },
  { id: 7, department_id: 4, title: 'Менеджер по продажам', description: 'B2B продажи' },
]

const buildEmployee = (
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  departmentId: number,
  positionId: number,
  roleName = 'employee',
): Employee => {
  const department = mockDepartments.find((d) => d.id === departmentId)
  const position = mockPositions.find((p) => p.id === positionId)

  return {
    id,
    email,
    created_at: iso(-200 + id),
    is_active: true,
    can_access_admin_ui: roleName === 'superadmin' || roleName === 'hr_admin',
    role: { id: roleName === 'superadmin' ? 1 : 2, name: roleName, description: null },
    personnel_number: `EMP-${String(id).padStart(4, '0')}`,
    properties: {
      first_name: firstName,
      last_name: lastName,
      phone: `+7 7${String(70 + id).padStart(2, '0')} ${String(100 + id * 11).slice(0, 3)} ${String(2000 + id * 37).slice(0, 4)}`,
      gender: id % 2 === 0 ? 'female' : 'male',
      city: id % 3 === 0 ? 'Астана' : 'Алматы',
      birth_date: `199${id % 5}-0${(id % 8) + 1}-15`,
    },
    position: position ? { id: position.id, title: position.title, description: position.description ?? null } : null,
    department: department ? { id: department.id, name: department.name, description: department.description ?? null } : null,
    branch: mockBranches.find((b) => b.id === department?.branch_id) ?? null,
    position_department: {
      position: position?.title ?? '',
      department: department?.name ?? '',
      branch: mockBranches.find((b) => b.id === department?.branch_id) ?? null,
    },
  }
}

const baseMockEmployees: Employee[] = [
  buildEmployee(1, 'admin@fetch-hr.tj', 'Дадабоев', 'Шерзод', 1, 1, 'superadmin'),
  buildEmployee(2, 'alia.hr@fetch-hr.tj', 'Азамат', 'Шерматов', 2, 2, 'hr_admin'),
  buildEmployee(3, 'erlan.dev@fetch-hr.tj', 'Фуркатчон', 'Насриддинов', 3, 4, 'employee'),
  buildEmployee(4, 'dana.sales@fetch-hr.tj', 'Фахриддин', 'Сангинов', 4, 7, 'employee'),
  buildEmployee(5, 'marat.fe@fetch-hr.tj', 'Марат', 'Ахметов', 3, 5, 'employee'),
  buildEmployee(6, 'ainur.be@fetch-hr.tj', 'Николай', 'Наумов', 3, 6, 'employee'),
  buildEmployee(7, 'gulnara.recruit@fetch-hr.tj', 'Шахноза', 'Алиева', 2, 3, 'employee'),
  buildEmployee(8, 'timur.sales@fetch-hr.tj', 'Тимур', 'Ахметов', 4, 7, 'employee'),
]

export const mockMeEmployee = baseMockEmployees[0]

export const mockRoles: PermissionRoleResponse[] = [
  {
    id: 1,
    name: 'superadmin',
    description: 'Полный доступ к админ-панели',
    created_at: iso(-500),
    is_active: true,
    can_access_admin_ui: true,
  },
  {
    id: 2,
    name: 'hr_admin',
    description: 'HR-администратор',
    created_at: iso(-400),
    is_active: true,
    can_access_admin_ui: true,
  },
  {
    id: 3,
    name: 'employee',
    description: 'Сотрудник',
    created_at: iso(-400),
    is_active: true,
    can_access_admin_ui: false,
  },
]

export const mockPermissions: Permission[] = [
  { id: 1, name: 'employees.read', resource: 'employees', action: 'read', created_at: iso(-400), is_active: true },
  { id: 2, name: 'employees.write', resource: 'employees', action: 'write', created_at: iso(-400), is_active: true },
  { id: 3, name: 'departments.read', resource: 'departments', action: 'read', created_at: iso(-400), is_active: true },
  { id: 4, name: 'departments.write', resource: 'departments', action: 'write', created_at: iso(-400), is_active: true },
  { id: 5, name: 'vacancies.read', resource: 'vacancies', action: 'read', created_at: iso(-400), is_active: true },
  { id: 6, name: 'vacancies.write', resource: 'vacancies', action: 'write', created_at: iso(-400), is_active: true },
]

export const mockMatrixCatalog: PermissionMatrixRow[] = [
  {
    resource: 'employees',
    alias_ru: 'Сотрудники',
    read: { permission_id: 1, code: 'employees.read', enabled: true },
    write: { permission_id: 2, code: 'employees.write', enabled: true },
    delete: { permission_id: null, code: null, enabled: false },
  },
  {
    resource: 'departments',
    alias_ru: 'Отделы',
    read: { permission_id: 3, code: 'departments.read', enabled: true },
    write: { permission_id: 4, code: 'departments.write', enabled: true },
    delete: { permission_id: null, code: null, enabled: false },
  },
  {
    resource: 'vacancies',
    alias_ru: 'Вакансии',
    read: { permission_id: 5, code: 'vacancies.read', enabled: true },
    write: { permission_id: 6, code: 'vacancies.write', enabled: true },
    delete: { permission_id: null, code: null, enabled: false },
  },
]

export const mockSettingsFeatures = {
  features: {
    branches_enabled: true,
    vacancies_enabled: true,
    vacancy_applications_enabled: true,
    timesheets_enabled: true,
    kpi_enabled: true,
    news_enabled: true,
    ideas_enabled: true,
    lms_enabled: true,
    tasks_enabled: true,
  },
}

export const mockUiSettings = {
  theme: 'system' as const,
  language: 'ru',
  density: 'comfortable' as const,
  sidebar_collapsed: false,
  font_scale: 1,
  light_primary: '#d6fd70',
  light_secondary: '#2453ff',
  dark_primary: '#d6fd70',
  dark_secondary: '#38c6f6',
}

export const mockDocumentTypes: DocumentTypeItem[] = [
  {
    id: 1,
    code: 'passport',
    title: 'Удостоверение личности',
    category: 'main',
    sort_order: 1,
    is_active: true,
    auto_complete_on_file_upload: true,
    allow_received_without_file: false,
  },
  {
    id: 2,
    code: 'employment_contract',
    title: 'Трудовой договор',
    category: 'contracts',
    sort_order: 2,
    is_active: true,
    auto_complete_on_file_upload: true,
    allow_received_without_file: false,
  },
]

// SCREENSHOT MOCK — удалить позже
const fullEmployeeDepartment = mockDepartments.find((d) => d.id === 3)!
const fullEmployeePosition = mockPositions.find((p) => p.id === 4)!
const fullEmployeeBranch = mockBranches.find((b) => b.id === fullEmployeeDepartment.branch_id) ?? null
const fullEmployeeManager = baseMockEmployees[1]

export const mockFullEmployeePositionHistory: PositionHistoryEntry[] = [
  {
    id: 901,
    position_id: 5,
    department_id: 3,
    branch_id: 1,
    branch: fullEmployeeBranch,
    manager_id: 2,
    started_at: iso(-900).slice(0, 10),
    ended_at: iso(-400).slice(0, 10),
    assigned_at: iso(-900),
    is_current: false,
    title: 'Frontend-разработчик',
    description: 'React, TypeScript',
    position_is_active: true,
  },
  {
    id: 902,
    position_id: 4,
    department_id: 3,
    branch_id: 1,
    branch: fullEmployeeBranch,
    manager_id: 2,
    started_at: iso(-400).slice(0, 10),
    ended_at: null,
    assigned_at: iso(-400),
    is_current: true,
    title: 'Team Lead',
    description: 'Техническое руководство IT-отделом',
    position_is_active: true,
  },
]

export const mockFullEmployeePositionChanges: EmployeePositionChangeHistoryEntry[] = [
  {
    id: 801,
    user_id: 99,
    user_position_id: 902,
    from_position_id: 5,
    from_position_title: 'Frontend-разработчик',
    to_position_id: 4,
    to_position_title: 'Team Lead',
    from_department_id: 3,
    from_department_name: 'IT-отдел',
    to_department_id: 3,
    to_department_name: 'IT-отдел',
    reason_text: 'Повышение по итогам успешного запуска корпоративного портала',
    basis_type: 'Приказ о повышении',
    basis_file_path: '/uploads/mock/promotion-order-99.pdf',
    basis_file_url: '/uploads/mock/promotion-order-99.pdf',
    changed_by_user_id: 2,
    changed_by_user_email: 'alia.hr@fetch-hr.tj',
    changed_at: iso(-400),
  },
  {
    id: 802,
    user_id: 99,
    user_position_id: 901,
    from_position_id: null,
    from_position_title: null,
    to_position_id: 5,
    to_position_title: 'Frontend-разработчик',
    from_department_id: null,
    from_department_name: null,
    to_department_id: 3,
    to_department_name: 'IT-отдел',
    reason_text: 'Приём на работу по результатам собеседования',
    basis_type: 'Трудовой договор',
    basis_file_path: '/uploads/mock/employment-contract-99.pdf',
    basis_file_url: '/uploads/mock/employment-contract-99.pdf',
    changed_by_user_id: 2,
    changed_by_user_email: 'alia.hr@fetch-hr.tj',
    changed_at: iso(-900),
  },
]

export const mockFullEmployee: Employee = {
  id: 99,
  email: 'furkat.full@fetch-hr.tj',
  created_at: iso(-900),
  is_active: true,
  can_access_admin_ui: false,
  is_official_employment: true,
  personnel_number: 'EMP-0099',
  role: { id: 3, name: 'employee', description: 'Сотрудник' },
  business_role: { id: 1, name: 'Руководитель направления', description: 'Техническое лидерство' },
  properties: {
    first_name: 'Фуркатчон',
    last_name: 'Насриддинов',
    middle_name: 'Рустамович',
    gender: 'male',
    birth_date: '1992-03-18',
    inn: '920318401234',
    marital_status: 'married',
    city: 'Алматы',
    phone: '+7 707 123 4567',
    telegram: '@furkat_nasriddinov',
    registered_address: 'г. Алматы, ул. Абая 45, кв. 12',
    actual_address: 'г. Алматы, мкр. Самал-2, д. 78, кв. 34',
  },
  contact: {
    id: 1,
    name: 'Насриддинова Мадина',
    phone: '+7 707 987 6543',
    relative: 'Супруга',
    is_active: true,
  },
  contacts: [
    {
      id: 1,
      name: 'Насриддинова Мадина',
      phone: '+7 707 987 6543',
      relative: 'Супруга',
      is_active: true,
    },
    {
      id: 2,
      name: 'Насриддинов Рустам',
      phone: '+7 701 555 4433',
      relative: 'Отец',
      is_active: true,
    },
  ],
  addresses: [
    {
      type: 'Регистрация',
      country: 'Казахстан',
      city: 'Алматы',
      address: 'ул. Абая 45, кв. 12',
    },
    {
      type: 'Проживание',
      country: 'Казахстан',
      city: 'Алматы',
      address: 'мкр. Самал-2, д. 78, кв. 34',
    },
  ],
  position: {
    id: fullEmployeePosition.id,
    title: fullEmployeePosition.title,
    description: fullEmployeePosition.description ?? null,
  },
  department: {
    id: fullEmployeeDepartment.id,
    name: fullEmployeeDepartment.name,
    description: fullEmployeeDepartment.description ?? null,
  },
  branch: fullEmployeeBranch,
  position_department: {
    position: {
      id: fullEmployeePosition.id,
      title: fullEmployeePosition.title,
      description: fullEmployeePosition.description ?? null,
      started_at: iso(-400).slice(0, 10),
      ended_at: null,
      assigned_at: iso(-400),
      manager: {
        id: fullEmployeeManager.id,
        full_name: `${fullEmployeeManager.properties?.first_name ?? ''} ${fullEmployeeManager.properties?.last_name ?? ''}`.trim(),
        profile_photo_url: null,
      },
    },
    department: {
      id: fullEmployeeDepartment.id,
      name: fullEmployeeDepartment.name,
      description: fullEmployeeDepartment.description ?? null,
      head_user: {
        id: fullEmployeeManager.id,
        full_name: `${fullEmployeeManager.properties?.first_name ?? ''} ${fullEmployeeManager.properties?.last_name ?? ''}`.trim(),
        profile_photo_url: null,
      },
    },
    branch: fullEmployeeBranch,
  },
  position_history: mockFullEmployeePositionHistory,
  educations: [
    {
      id: 1,
      institution: 'Satbayev University',
      degree: 'bachelor',
      specialization: 'Информационные системы',
      started_at: '2010-09-01',
      ended_at: '2014-06-30',
    },
    {
      id: 2,
      institution: 'Nazarbayev University',
      degree: 'master',
      specialization: 'Computer Science',
      started_at: '2015-09-01',
      ended_at: '2017-06-30',
    },
  ],
  work_experiences: [
    {
      id: 1,
      company: 'Kaspi Tech',
      position: 'Frontend-разработчик',
      description: 'Разработка внутренних HR-инструментов на React',
      started_at: '2017-08-01',
      ended_at: '2020-12-31',
    },
    {
      id: 2,
      company: 'Fetch HR',
      position: 'Team Lead',
      description: 'Руководство командой разработки, архитектура платформы',
      started_at: '2021-01-15',
      ended_at: '',
    },
  ],
  schedules: [
    {
      id: 1,
      days_per_week: 5,
      hours_per_day: 8,
      started_at: iso(-400).slice(0, 10),
      ended_at: undefined,
      details: { note: 'Пн–Пт, офис + гибрид' },
    },
    {
      id: 2,
      days_per_week: 5,
      hours_per_day: 8,
      started_at: iso(-900).slice(0, 10),
      ended_at: iso(-401).slice(0, 10),
      details: { note: 'Полный день в офисе' },
    },
  ],
  salaries: [
    {
      id: 1,
      amount: 850000,
      currency: 'KZT',
      prepaid_percent: 40,
      started_at: iso(-400).slice(0, 10),
      ended_at: undefined,
    },
    {
      id: 2,
      amount: 620000,
      currency: 'KZT',
      prepaid_percent: 40,
      started_at: iso(-900).slice(0, 10),
      ended_at: iso(-401).slice(0, 10),
    },
  ],
  contracts: [
    {
      id: 1,
      type: 'full_time',
      started_at: iso(-400).slice(0, 10),
      ended_at: undefined,
      details: { contract_number: 'ТД-2024/099' },
    },
    {
      id: 2,
      type: 'full_time',
      started_at: iso(-900).slice(0, 10),
      ended_at: iso(-401).slice(0, 10),
      details: { contract_number: 'ТД-2021/099' },
    },
  ],
  documents: [
    {
      id: 101,
      document_type_id: 1,
      type: 'passport',
      title: 'Удостоверение личности',
      path: '/uploads/mock/passport-99.pdf',
      file_url: '/uploads/mock/passport-99.pdf',
      params: { series: 'N', number: '12345678' },
      created_at: iso(-890),
      is_active: true,
    },
    {
      id: 102,
      document_type_id: 2,
      type: 'employment_contract',
      title: 'Трудовой договор',
      path: '/uploads/mock/employment-contract-99.pdf',
      file_url: '/uploads/mock/employment-contract-99.pdf',
      params: { contract_number: 'ТД-2024/099' },
      created_at: iso(-400),
      is_active: true,
    },
  ],
  document_checklist: {
    items: [
      {
        document_type: {
          id: 1,
          code: 'passport',
          title: 'Удостоверение личности',
          category: 'main',
          sort_order: 1,
          auto_complete_on_file_upload: true,
          allow_received_without_file: false,
        },
        received: true,
        manually_received: false,
        uploaded_documents: [
          {
            id: 101,
            document_type_id: 1,
            type: 'passport',
            title: 'Удостоверение личности',
            path: '/uploads/mock/passport-99.pdf',
            file_url: '/uploads/mock/passport-99.pdf',
            params: { series: 'N', number: '12345678' },
            created_at: iso(-890),
            is_active: true,
          },
        ],
      },
      {
        document_type: {
          id: 2,
          code: 'employment_contract',
          title: 'Трудовой договор',
          category: 'contracts',
          sort_order: 2,
          auto_complete_on_file_upload: true,
          allow_received_without_file: false,
        },
        received: true,
        manually_received: false,
        uploaded_documents: [
          {
            id: 102,
            document_type_id: 2,
            type: 'employment_contract',
            title: 'Трудовой договор',
            path: '/uploads/mock/employment-contract-99.pdf',
            file_url: '/uploads/mock/employment-contract-99.pdf',
            params: { contract_number: 'ТД-2024/099' },
            created_at: iso(-400),
            is_active: true,
          },
        ],
      },
    ],
  },
  rewards: [
    {
      assignment_id: 901,
      assigned_at: iso(-30),
      reward: {
        id: 1,
        title: 'Звезда месяца',
        description: 'За выдающиеся результаты в текущем месяце',
        image_url: null,
        created_at: iso(-365),
      },
    },
    {
      assignment_id: 902,
      assigned_at: iso(-120),
      reward: {
        id: 2,
        title: 'Командный игрок',
        description: 'За помощь коллегам и вовлечённость',
        image_url: null,
        created_at: iso(-400),
      },
    },
  ],
}

export const mockEmployees: Employee[] = [...baseMockEmployees, mockFullEmployee]

export const mockNotifications: NotificationListItem[] = [
  {
    id: 1,
    event_id: 101,
    event_type: 'vacation_request',
    title: 'Новая заявка на отпуск',
    body: 'Дадабоев Шерзод подала заявку на отпуск 20–27 июня',
    deeplink: '/leaves',
    is_seen: false,
    seen_at: null,
    is_read: false,
    read_at: null,
    created_at: iso(-1),
  },
  {
    id: 2,
    event_id: 102,
    event_type: 'new_application',
    title: 'Новый отклик на вакансию',
    body: 'Frontend-разработчик — 2 новых кандидата',
    deeplink: '/vacancy-applications',
    is_seen: true,
    seen_at: iso(-2),
    is_read: false,
    read_at: null,
    created_at: iso(-2),
  },
]

export const mockRequests: Request[] = [
  {
    id: 1,
    user_id: 2,
    type: 'vacation',
    title: 'Отпуск на 5 дней',
    body: 'Прошу согласовать ежегодный отпуск',
    status: 'new',
    created_at: iso(-3),
  },
  {
    id: 2,
    user_id: 5,
    type: 'equipment',
    title: 'Новый монитор',
    body: 'Нужен второй монитор 27" для разработки',
    status: 'approved',
    created_at: iso(-5),
  },
  {
    id: 3,
    user_id: 8,
    type: 'document',
    title: 'Справка с места работы',
    body: 'Для банка',
    status: 'completed',
    created_at: iso(-10),
  },
]

export const mockRewards: Reward[] = [
  {
    id: 1,
    title: 'Звезда месяца',
    description: 'За выдающиеся результаты в текущем месяце',
    icon_name: 'star',
  },
  {
    id: 2,
    title: 'Командный игрок',
    description: 'За помощь коллегам и вовлечённость',
    icon_name: 'users',
  },
]

export const mockIdeas: Idea[] = [
  {
    id: 1,
    author_id: 5,
    title: 'Гибкий график по пятницам',
    body: 'Предлагаю разрешить удалённую работу по пятницам для IT-отдела',
    status: IdeaStatus.IN_TALK,
    created_at: iso(-7),
    is_active: 1,
    cover_url: null,
    author_first_name: 'Марат',
    author_last_name: 'Жумабаев',
    author_middle_name: null,
    author_photo_url: null,
    comments_count: 4,
    likes_count: 12,
    dislikes_count: 1,
    my_reaction: null,
  },
  {
    id: 2,
    author_id: 7,
    title: 'Реферальная программа',
    body: 'Бонус сотруднику за успешную рекомендацию кандидата',
    status: IdeaStatus.ACCEPTED,
    created_at: iso(-20),
    is_active: 1,
    cover_url: null,
    author_first_name: 'Гульнара',
    author_last_name: 'Искакова',
    author_middle_name: null,
    author_photo_url: null,
    comments_count: 8,
    likes_count: 24,
    dislikes_count: 0,
    my_reaction: 'like',
  },
]

export const mockIdeaComments: IdeaComment[] = [
  {
    id: 1,
    idea_id: 1,
    user_id: 7,
    parent_id: null,
    body: 'Отличная идея! Полностью поддерживаю удалёнку по пятницам.',
    created_at: iso(-5),
    updated_at: iso(-5),
    author: {
      id: 7,
      email: 'g.iskakova@company.tj',
      first_name: 'Гульнара',
      last_name: 'Искакова',
      middle_name: '',
    },
    replies: [
      {
        id: 2,
        idea_id: 1,
        user_id: 5,
        parent_id: 1,
        body: 'Согласен, это повысит продуктивность команды.',
        created_at: iso(-4),
        updated_at: iso(-4),
        author: {
          id: 5,
          email: 'm.zhumabaev@company.tj',
          first_name: 'Марат',
          last_name: 'Жумабаев',
          middle_name: '',
        },
        replies: [],
      },
    ],
  },
  {
    id: 3,
    idea_id: 1,
    user_id: 2,
    parent_id: null,
    body: 'Нужно обсудить с руководством отдела продаж — у них другой график.',
    created_at: iso(-3),
    updated_at: iso(-3),
    author: {
      id: 2,
      email: 'a.petrov@company.tj',
      first_name: 'Алексей',
      last_name: 'Петров',
      middle_name: '',
    },
    replies: [],
  },
  {
    id: 4,
    idea_id: 2,
    user_id: 3,
    parent_id: null,
    body: 'Реферальная программа уже работает в других компаниях — хороший опыт.',
    created_at: iso(-15),
    updated_at: iso(-15),
    author: {
      id: 3,
      email: 'd.kim@company.tj',
      first_name: 'Данияр',
      last_name: 'Ким',
      middle_name: '',
    },
    replies: [],
  },
]

export const mockNews: News[] = [
  {
    id: 1,
    author_id: 2,
    title: 'Корпоратив в честь дня компании',
    body: 'Приглашаем всех на праздничное мероприятие 28 июня в 18:00',
    is_published: 1,
    published_at: iso(-4),
    created_at: iso(-5),
    cover_url: null,
    comments_count: 6,
    likes_count: 18,
    dislikes_count: 0,
    my_reaction: null,
  },
  {
    id: 2,
    author_id: 1,
    title: 'Обновление политики удалённой работы',
    body: 'С 1 июля вступают в силу новые правила гибридного формата',
    is_published: 1,
    published_at: iso(-12),
    created_at: iso(-14),
    cover_url: null,
    comments_count: 3,
    likes_count: 9,
    dislikes_count: 1,
    my_reaction: null,
  },
]

export const mockVacancyCategories: VacancyCategory[] = [
  { id: 1, name: 'IT', description: 'Технические специалисты' },
  { id: 2, name: 'Продажи', description: 'Коммерческие позиции' },
  { id: 3, name: 'Администрация', description: 'Офис и поддержка' },
]

export const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: 'Senior Frontend-разработчик',
    body: 'React, TypeScript, опыт от 3 лет',
    type: 'internal',
    category_id: 1,
    category: mockVacancyCategories[0],
    branch_id: 1,
    branch_name: 'Головной офис',
    is_published: true,
    image_url: null,
    deadline_at: iso(30),
    is_deadline_passed: false,
    is_closed: false,
    closed_at: null,
    created_at: iso(-15),
    updated_at: iso(-2),
  },
  {
    id: 2,
    title: 'Менеджер по продажам B2B',
    body: 'Опыт в IT-продажах приветствуется',
    type: 'external',
    category_id: 2,
    category: mockVacancyCategories[1],
    branch_id: 2,
    branch_name: 'Филиал Астана',
    is_published: true,
    image_url: null,
    deadline_at: iso(45),
    is_deadline_passed: false,
    is_closed: false,
    closed_at: null,
    created_at: iso(-8),
    updated_at: iso(-1),
  },
]

export const mockApplicationStatuses: VacancyApplicationStatusItem[] = [
  { code: 'new', title: 'Не проверено', column_sort_order: 1, is_active: true, is_default: true, closes_vacancy: false },
  { code: 'in_review', title: 'На рассмотрении', column_sort_order: 2, is_active: true, is_default: false, closes_vacancy: false },
  { code: 'contacted', title: 'Связались', column_sort_order: 3, is_active: true, is_default: false, closes_vacancy: false },
  { code: 'accepted', title: 'Принято', column_sort_order: 4, is_active: true, is_default: false, closes_vacancy: true },
  { code: 'rejected', title: 'Отказано', column_sort_order: 5, is_active: true, is_default: false, closes_vacancy: false },
]

export const mockVacancyApplications: VacancyApplication[] = [
  {
    id: 1,
    vacancy_id: 1,
    vacancy_title: 'Senior Frontend-разработчик',
    first_name: 'Асхат',
    last_name: 'Бекенов',
    email: 'asxat.b@mail.tj',
    phone: '+7 701 234 5678',
    status: 'new',
    board_sort_order: 1,
    created_at: iso(-2),
  },
  {
    id: 2,
    vacancy_id: 1,
    vacancy_title: 'Senior Frontend-разработчик',
    first_name: 'Сауле',
    last_name: 'Мукашева',
    email: 'saule.m@gmail.com',
    phone: '+7 702 345 6789',
    status: 'in_review',
    board_sort_order: 1,
    created_at: iso(-4),
  },
  {
    id: 3,
    vacancy_id: 2,
    vacancy_title: 'Менеджер по продажам B2B',
    first_name: 'Нурлан',
    last_name: 'Садыков',
    email: 'nurlan.s@yandex.tj',
    status: 'contacted',
    board_sort_order: 1,
    created_at: iso(-6),
  },
]

export const mockVacations: Vacation[] = [
  {
    id: 1,
    user_id: 2,
    comment: 'Семейный отдых',
    started_at: iso(10).slice(0, 10),
    ended_at: iso(17).slice(0, 10),
    type: VacationType.ANNUAL,
    status: VacationStatus.PENDING,
    created_at: iso(-1),
  },
  {
    id: 2,
    user_id: 5,
    comment: 'Больничный',
    started_at: iso(-5).slice(0, 10),
    ended_at: iso(-3).slice(0, 10),
    type: VacationType.SICK,
    status: VacationStatus.APPROVED,
    created_at: iso(-6),
  },
]

const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1

// SCREENSHOT MOCK — удалить позже
const screenshotDashboardDepts = [
  { id: 5, name: 'Маркетинг', employees_count: 8, actual_hours: 152, average_kpi: 94 },
  { id: 6, name: 'Финансы', employees_count: 6, actual_hours: 168, average_kpi: 68 },
  { id: 7, name: 'Клиентский сервис', employees_count: 12, actual_hours: 134, average_kpi: 55 },
]

const screenshotTimesheetByDept = [
  { actual_hours: 148, average_kpi: 78 },
  { actual_hours: 156, average_kpi: 92 },
  { actual_hours: 142, average_kpi: 87 },
]

export const mockTimesheetDashboard: TimesheetDashboardItem[] = [
  ...mockDepartments.slice(1).map((dept, index) => {
    const actualHours = screenshotTimesheetByDept[index]?.actual_hours ?? 140 + index * 12
    return {
      department_id: dept.id,
      department_name: dept.name,
      employees_count: 2 + index * 3,
      actual_hours: actualHours,
      expected_hours: 160,
      workload_percent: Math.round((actualHours / 160) * 100),
      year: currentYear,
      month: currentMonth,
    }
  }),
  ...screenshotDashboardDepts.map((dept) => ({
    department_id: dept.id,
    department_name: dept.name,
    employees_count: dept.employees_count,
    actual_hours: dept.actual_hours,
    expected_hours: 160,
    workload_percent: Math.round((dept.actual_hours / 160) * 100),
    year: currentYear,
    month: currentMonth,
  })),
]

export const mockKpiDashboard: KpiDashboardItem[] = [
  ...mockDepartments.slice(1).map((dept, index) => ({
    department_id: dept.id,
    department_name: dept.name,
    employees_count: 2 + index * 3,
    average_kpi: screenshotTimesheetByDept[index]?.average_kpi ?? 72 + index * 5,
    year: currentYear,
    month: currentMonth,
  })),
  ...screenshotDashboardDepts.map((dept) => ({
    department_id: dept.id,
    department_name: dept.name,
    employees_count: dept.employees_count,
    average_kpi: dept.average_kpi,
    year: currentYear,
    month: currentMonth,
  })),
]

export const mockTimesheetDepartments: TimesheetDepartment[] = mockDepartments.slice(1).map((dept) => ({
  department_id: dept.id,
  department_name: dept.name,
  employees: mockEmployees
    .filter((e) => e.department?.id === dept.id)
    .map((employee) => ({
      user_id: employee.id,
      email: employee.email,
      timesheets: [
        {
          id: employee.id * 10,
          user_id: employee.id,
          work_date: iso(0).slice(0, 10),
          check_in: '09:00:00',
          check_out: '18:00:00',
          status: 'present',
          details: null,
          created_at: iso(0),
        },
        {
          id: employee.id * 10 + 1,
          user_id: employee.id,
          work_date: iso(-1).slice(0, 10),
          check_in: '09:15:00',
          check_out: '18:05:00',
          status: 'present',
          details: null,
          created_at: iso(-1),
        },
      ],
    })),
}))

export const mockKpiDepartments: KPIDepartment[] = mockDepartments.slice(1).map((dept) => ({
  department_id: dept.id,
  department_name: dept.name,
  employees: mockEmployees
    .filter((e) => e.department?.id === dept.id)
    .map((employee) => ({
      user_id: employee.id,
      email: employee.email,
      first_name: employee.properties?.first_name,
      last_name: employee.properties?.last_name,
      kpis: [
        {
          id: employee.id * 100,
          user_id: employee.id,
          title: 'Выполнение плана',
          target_value: 100,
          actual_value: 75 + (employee.id % 20),
          period: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
          details: null,
          created_at: iso(-30),
          updated_at: iso(-1),
        },
      ],
    })),
}))

export const buildVacancyBoard = (vacancyId?: number | null) => ({
  vacancy_id: vacancyId ?? null,
  columns: mockApplicationStatuses.map((status) => ({
    status,
    applications: mockVacancyApplications.filter(
      (app) => app.status === status.code && (vacancyId == null || vacancyId <= 0 || app.vacancy_id === vacancyId),
    ),
  })),
})

// SCREENSHOT MOCK — удалить позже
const screenshotMonthlyOpenVacancies = [12, 14, 11, 16, 18, 15, 19, 17, 14, 12, 10, 8]
const screenshotMonthlyClosedVacancies = [2, 3, 4, 2, 5, 3, 6, 4, 5, 3, 4, 6]

export const buildMockVacanciesDashboard = (month: number): VacanciesDashboardResponse => {
  const safeMonth = Math.min(12, Math.max(1, month))
  const openVacancies = screenshotMonthlyOpenVacancies[safeMonth - 1] ?? 12
  const closedInMonth = screenshotMonthlyClosedVacancies[safeMonth - 1] ?? 3
  const totalVacancies = 45

  return {
    year: currentYear,
    month: safeMonth,
    type: null,
    category_id: null,
    business_role_id: null,
    is_published: null,
    is_closed: null,
    total_vacancies: totalVacancies,
    open_vacancies: openVacancies,
    closed_vacancies: totalVacancies - openVacancies,
    closed_this_year: screenshotMonthlyClosedVacancies.reduce((sum, value) => sum + value, 0),
    closed_in_month: closedInMonth,
  }
}

export const mockVacanciesDashboard = buildMockVacanciesDashboard(currentMonth)

// SCREENSHOT MOCK — удалить позже
export const mockEmployeesDashboard: EmployeesDashboardResponse = {
  department_id: null,
  total_employees: 247,
  official_employees: 218,
  unofficial_employees: 29,
  male_employees: 128,
  female_employees: 115,
  unknown_gender_employees: 4,
  average_age: 34.6,
  age_18_25: 42,
  age_26_35: 98,
  age_35_50: 76,
  age_50_plus: 31,
}

const screenshotMonthlyHiringTrend: HRMonthlyTrendItem[] = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  const hires = [4, 6, 5, 8, 7, 9, 6, 10, 8, 5, 4, 3][index] ?? 5
  const leavers = [2, 1, 3, 2, 4, 2, 3, 2, 3, 2, 1, 2][index] ?? 2
  const vacanciesCreated = [3, 4, 2, 5, 6, 4, 7, 5, 4, 3, 2, 2][index] ?? 3
  const vacanciesClosed = screenshotMonthlyClosedVacancies[index] ?? 3

  return {
    year: currentYear,
    month,
    hires,
    leavers,
    vacancies_created: vacanciesCreated,
    vacancies_closed: vacanciesClosed,
  }
})

// SCREENSHOT MOCK — удалить позже
export const mockHrReport: HRMonthlyReportResponse = {
  year: currentYear,
  month: currentMonth,
  branch_id: null,
  department_id: null,
  headcount_start: 238,
  headcount_end: 247,
  hired_in_month: 9,
  leavers_in_month: 3,
  turnover_percent: 4.2,
  vacancies_created: 6,
  vacancies_closed: 4,
  vacancies_open_end: 14,
  applications_received: 186,
  hires_from_applications: 7,
  conversion_rate: 3.8,
  offer_acceptance_rate: 82.5,
  average_time_to_fill_days: 24.5,
  applications_new: 48,
  applications_in_review: 62,
  applications_contacted: 35,
  applications_accepted: 18,
  applications_rejected: 23,
  monthly_hiring_trend: screenshotMonthlyHiringTrend,
}
