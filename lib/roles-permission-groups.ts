import type { PermissionMatrixRow } from '@/types/permission'

export type PermissionGroupId =
  | 'hr'
  | 'recruiting'
  | 'content'
  | 'lms'
  | 'system'
  | 'other'

export type PermissionGroup = {
  id: PermissionGroupId
  label: string
  defaultOpen: boolean
  resources: string[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'hr',
    label: 'HR и оргструктура',
    defaultOpen: true,
    resources: [
      'employees',
      'departments',
      'branches',
      'positions',
      'timesheets',
      'vacation',
      'schedule',
      'salary',
      'contracts',
      'documents',
      'education',
      'work_experience',
    ],
  },
  {
    id: 'recruiting',
    label: 'Рекрутинг',
    defaultOpen: true,
    resources: ['vacancies', 'vacancy_applications', 'vacancy_categories'],
  },
  {
    id: 'content',
    label: 'Контент и сервисы',
    defaultOpen: false,
    resources: ['news', 'ideas', 'requests', 'rewards', 'kpi', 'dashboard', 'notifications'],
  },
  {
    id: 'lms',
    label: 'Обучение (LMS)',
    defaultOpen: false,
    resources: [
      'courses',
      'learning_paths',
      'submissions',
      'leaderboards',
      'course_categories',
    ],
  },
  {
    id: 'system',
    label: 'Система',
    defaultOpen: false,
    resources: ['roles', 'permissions', 'audit_logs', 'tasks'],
  },
]

const resourceToGroup = new Map<string, PermissionGroupId>(
  PERMISSION_GROUPS.flatMap((group) =>
    group.resources.map((resource) => [resource, group.id] as const),
  ),
)

export const getPermissionGroupId = (resource: string): PermissionGroupId =>
  resourceToGroup.get(resource) ?? 'other'

export type GroupedPermissionRows = {
  id: PermissionGroupId
  label: string
  defaultOpen: boolean
  rows: PermissionMatrixRow[]
}

export const groupPermissionRows = (rows: PermissionMatrixRow[]): GroupedPermissionRows[] => {
  const buckets = new Map<PermissionGroupId, PermissionMatrixRow[]>()

  PERMISSION_GROUPS.forEach((group) => {
    buckets.set(group.id, [])
  })
  buckets.set('other', [])

  rows.forEach((row) => {
    const groupId = getPermissionGroupId(row.resource)
    buckets.get(groupId)?.push(row)
  })

  const grouped: GroupedPermissionRows[] = PERMISSION_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    defaultOpen: group.defaultOpen,
    rows: buckets.get(group.id) ?? [],
  })).filter((group) => group.rows.length > 0)

  const otherRows = buckets.get('other') ?? []
  if (otherRows.length > 0) {
    grouped.push({
      id: 'other',
      label: 'Прочее',
      defaultOpen: false,
      rows: otherRows,
    })
  }

  return grouped
}
