import type { TaskItem } from './tasks'

export interface TaskStatusItem {
  code: string
  title: string
  column_sort_order: number
  is_active: boolean
  is_default: boolean
}

export interface TaskStatusesResponse {
  items: TaskStatusItem[]
}

export interface TaskBoardColumn {
  status: TaskStatusItem
  tasks: TaskItem[]
  total: number
  page: number
  page_size: number
}

export interface TaskBoardResponse {
  columns: TaskBoardColumn[]
}

export type TaskBoardFilters = {
  assigneeId?: number | null
  projectId?: number | null
  q?: string
}

export interface TaskBoardPositionPatch {
  status_code: string
  position: number
}

export interface CreateTaskStatusDTO {
  code: string
  title: string
  column_sort_order?: number
  is_active?: boolean
}

export interface UpdateTaskStatusDTO {
  title?: string
  column_sort_order?: number
  is_active?: boolean
  is_default?: boolean
}
