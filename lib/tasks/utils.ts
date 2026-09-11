import type { TaskUserBrief } from '@/types/tasks'
import type { TaskStatusItem } from '@/types/taskBoard'

export const TASK_FIELD_LABELS: Record<string, string> = {
  title: 'Название',
  description: 'Описание',
  deadline: 'Дедлайн',
  status: 'Статус',
  parent_id: 'Родительская задача',
  assignee_ids: 'Исполнители',
  project_id: 'Проект',
}

export const getTaskUserName = (user?: TaskUserBrief | null): string => {
  if (!user) return '—'
  const name = [user.last_name, user.first_name].filter(Boolean).join(' ')
  return name || `ID ${user.id}`
}

export const getTaskUserInitials = (user?: TaskUserBrief | null): string => {
  if (!user) return '?'
  const last = user.last_name?.[0] ?? ''
  const first = user.first_name?.[0] ?? ''
  const initials = (last + first).toUpperCase()
  return initials || '?'
}

export const getStatusLabel = (code: string, statuses?: TaskStatusItem[]): string => {
  const fromApi = statuses?.find((s) => s.code === code)?.title
  return fromApi ?? code
}

export const formatTaskDate = (iso?: string | null): string => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export const formatTaskDateTime = (iso?: string | null): string => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

export const isDeadlineOverdue = (deadline?: string | null): boolean => {
  if (!deadline) return false
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() < Date.now()
}

export const formatChangeValue = (
  field: string,
  value: string | null | undefined,
  statuses?: TaskStatusItem[]
): string => {
  if (value == null || value === '') return '—'
  if (field === 'status') return getStatusLabel(value, statuses)
  if (field === 'deadline') return formatTaskDate(value)
  if (field === 'assignee_ids') {
    try {
      const ids = JSON.parse(value) as number[]
      if (Array.isArray(ids)) return ids.length ? ids.join(', ') : '—'
    } catch {
      return value
    }
  }
  return value
}
