import type { Department } from '@/types/departments'

export type AssigneeMode = 'employees' | 'departments'

export const getDepartmentHeadId = (dept: Department): number | null => {
  const id = dept.head_user?.id
  if (id == null || id <= 0) return null
  return id
}

export const getDepartmentLabel = (dept: Department): string =>
  dept.name || dept.department_name || `Отдел #${dept.id}`

export const departmentsToAssigneeIds = (
  departments: Department[],
  selectedDeptIds: number[]
): number[] => {
  const deptMap = new Map(departments.map((dept) => [dept.id, dept]))
  const ids: number[] = []
  const seen = new Set<number>()

  for (const deptId of selectedDeptIds) {
    const dept = deptMap.get(deptId)
    if (!dept) continue
    const headId = getDepartmentHeadId(dept)
    if (headId == null || seen.has(headId)) continue
    seen.add(headId)
    ids.push(headId)
  }

  return ids
}

export const assigneeIdsToDepartmentIds = (
  assigneeIds: number[],
  departments: Department[]
): number[] | null => {
  if (assigneeIds.length === 0) return []

  const headToDepts = new Map<number, number[]>()
  for (const dept of departments) {
    const headId = getDepartmentHeadId(dept)
    if (headId == null) continue
    const existing = headToDepts.get(headId) ?? []
    existing.push(dept.id)
    headToDepts.set(headId, existing)
  }

  const result: number[] = []
  for (const assigneeId of assigneeIds) {
    const deptIds = headToDepts.get(assigneeId)
    if (!deptIds || deptIds.length !== 1) return null
    result.push(deptIds[0])
  }

  return result
}

export const resolveAssigneeModeFromTask = (
  assigneeIds: number[],
  departments: Department[]
): AssigneeMode => {
  if (assigneeIds.length === 0) return 'employees'
  const deptIds = assigneeIdsToDepartmentIds(assigneeIds, departments)
  return deptIds != null ? 'departments' : 'employees'
}

export const validateDepartmentSelection = (
  departmentIds: number[],
  departments: Department[]
): string | null => {
  if (departmentIds.length === 0) return 'Выберите хотя бы один отдел'

  const deptMap = new Map(departments.map((dept) => [dept.id, dept]))
  for (const deptId of departmentIds) {
    const dept = deptMap.get(deptId)
    if (!dept) return 'Не удалось определить выбранный отдел'
    if (getDepartmentHeadId(dept) == null) {
      return `У отдела «${getDepartmentLabel(dept)}» нет руководителя`
    }
  }

  return null
}

export const buildAssigneeIdsForSubmit = (
  mode: AssigneeMode,
  employeeIds: number[],
  departmentIds: number[],
  departments: Department[]
): { assigneeIds: number[]; error?: string } => {
  if (mode === 'employees') {
    return { assigneeIds: employeeIds }
  }

  const validationError = validateDepartmentSelection(departmentIds, departments)
  if (validationError) {
    return { assigneeIds: [], error: validationError }
  }

  return {
    assigneeIds: departmentsToAssigneeIds(departments, departmentIds),
  }
}
