import { apiClient } from './client'
import type {
  CreateTaskCommentDTO,
  CreateTaskDTO,
  PaginatedTaskChanges,
  PaginatedTasks,
  TaskComment,
  TaskDashboardFilters,
  TaskDashboardResponse,
  TaskDetail,
  TaskListQuery,
  TaskTableResponse,
  UpdateTaskCommentDTO,
  UpdateTaskDTO,
} from '@/types/tasks'
import type {
  CreateTaskStatusDTO,
  TaskBoardFilters,
  TaskBoardPositionPatch,
  TaskBoardResponse,
  TaskStatusItem,
  TaskStatusesResponse,
  UpdateTaskStatusDTO,
} from '@/types/taskBoard'

const BOARD_PAGE_SIZE = 100

export const EMPTY_TASK_DASHBOARD: TaskDashboardResponse = {
  total: 0,
  completed: 0,
  open: 0,
  overdue: 0,
  unassigned: 0,
  without_project: 0,
  due_today: 0,
  due_this_week: 0,
  completion_percent: 0,
  by_status: [],
  by_project: [],
}

export const normalizeTaskDashboard = (raw: unknown): TaskDashboardResponse => {
  const partial = raw && typeof raw === 'object' ? (raw as TaskDashboardResponse) : null
  return {
    ...EMPTY_TASK_DASHBOARD,
    ...(partial ?? {}),
    by_status: Array.isArray(partial?.by_status) ? partial.by_status : [],
    by_project: Array.isArray(partial?.by_project) ? partial.by_project : [],
  }
}

const normalizeBoard = (raw: TaskBoardResponse | null | undefined): TaskBoardResponse => ({
  columns: Array.isArray(raw?.columns) ? raw.columns : [],
})

const appendListParams = (query?: TaskListQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (!query) return params

  if (query.page != null) params.page = query.page
  if (query.page_size != null) params.page_size = query.page_size
  if (query.parent_id != null && query.parent_id > 0) params.parent_id = query.parent_id
  if (query.status?.trim()) params.status = query.status.trim()
  if (query.assignee_id != null && query.assignee_id > 0) params.assignee_id = query.assignee_id
  if (query.created_by != null && query.created_by > 0) params.created_by = query.created_by
  if (query.project_id != null && query.project_id > 0) params.project_id = query.project_id
  if (query.q?.trim()) params.q = query.q.trim()
  if (query.deadline_from) params.deadline_from = query.deadline_from
  if (query.deadline_to) params.deadline_to = query.deadline_to
  if (query.overdue != null) params.overdue = query.overdue ? 'true' : 'false'
  if (query.unassigned != null) params.unassigned = query.unassigned ? 'true' : 'false'
  if (query.no_project != null) params.no_project = query.no_project ? 'true' : 'false'
  if (query.include_subtasks != null) {
    params.include_subtasks = query.include_subtasks ? 'true' : 'false'
  }
  if (query.sort_by) params.sort_by = query.sort_by
  if (query.sort_order) params.sort_order = query.sort_order
  return params
}

export const tasksApi = {
  getBoard: async (filters?: TaskBoardFilters): Promise<TaskBoardResponse> => {
    const params: Record<string, string | number> = {
      page: 1,
      page_size: BOARD_PAGE_SIZE,
    }
    if (filters?.assigneeId != null && filters.assigneeId > 0) {
      params.assignee_id = filters.assigneeId
    }
    if (filters?.projectId != null && filters.projectId > 0) {
      params.project_id = filters.projectId
    }
    if (filters?.q?.trim()) params.q = filters.q.trim()
    const raw = await apiClient.get<TaskBoardResponse>('/tasks/board', params)
    return normalizeBoard(raw)
  },

  getAll: (query?: TaskListQuery): Promise<PaginatedTasks> =>
    apiClient.get<PaginatedTasks>('/tasks/all', appendListParams(query)),

  getMy: (query?: TaskListQuery): Promise<PaginatedTasks> =>
    apiClient.get<PaginatedTasks>('/tasks/my', appendListParams(query)),

  getTable: (query?: TaskListQuery): Promise<TaskTableResponse> =>
    apiClient.get<TaskTableResponse>('/tasks/table', appendListParams(query)),

  getDashboard: async (filters?: TaskDashboardFilters): Promise<TaskDashboardResponse> => {
    const params: Record<string, string | number> = {}
    if (filters?.projectId != null && filters.projectId > 0) {
      params.project_id = filters.projectId
    }
    if (filters?.assigneeId != null && filters.assigneeId > 0) {
      params.assignee_id = filters.assigneeId
    }
    if (filters?.createdBy != null && filters.createdBy > 0) {
      params.created_by = filters.createdBy
    }
    if (filters?.mine) params.mine = 'true'
    if (filters?.includeSubtasks) params.include_subtasks = 'true'
    const raw = await apiClient.get<unknown>('/tasks/dashboard', params)
    return normalizeTaskDashboard(raw)
  },

  getArchive: (page = 1, pageSize = 20, q?: string, parentId?: number | null): Promise<PaginatedTasks> => {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    }
    if (q?.trim()) params.q = q.trim()
    if (parentId != null && parentId > 0) params.parent_id = parentId
    return apiClient.get<PaginatedTasks>('/tasks/archive', params)
  },

  hardDeleteArchive: (taskId: number): Promise<void> =>
    apiClient.delete(`/tasks/archive/${taskId}`),

  updateBoardPosition: (taskId: number, data: TaskBoardPositionPatch): Promise<{ ok: boolean }> =>
    apiClient.patch<{ ok: boolean }>(`/tasks/${taskId}/board-position`, data),

  getStatuses: (includeInactive = false): Promise<TaskStatusesResponse> =>
    apiClient.get<TaskStatusesResponse>('/tasks/statuses', {
      include_inactive: includeInactive ? 'true' : 'false',
    }),

  createStatus: (data: CreateTaskStatusDTO): Promise<TaskStatusItem> =>
    apiClient.post<TaskStatusItem>('/tasks/statuses', data),

  updateStatus: (code: string, data: UpdateTaskStatusDTO): Promise<TaskStatusItem> =>
    apiClient.patch<TaskStatusItem>(`/tasks/statuses/${encodeURIComponent(code)}`, data),

  deleteStatus: (code: string): Promise<void> =>
    apiClient.delete(`/tasks/statuses/${encodeURIComponent(code)}`),

  getTask: (taskId: number): Promise<TaskDetail> =>
    apiClient.get<TaskDetail>(`/tasks/${taskId}`),

  createTask: (data: CreateTaskDTO): Promise<number> =>
    apiClient.post<number>('/tasks/create', data),

  updateTask: (taskId: number, data: UpdateTaskDTO): Promise<{ ok: boolean }> =>
    apiClient.patch<{ ok: boolean }>(`/tasks/${taskId}`, data),

  archiveTask: (taskId: number): Promise<void> =>
    apiClient.delete(`/tasks/${taskId}`),

  getComments: (taskId: number): Promise<TaskComment[]> =>
    apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments`),

  createComment: (taskId: number, data: CreateTaskCommentDTO): Promise<number> =>
    apiClient.post<number>(`/tasks/${taskId}/comments`, data),

  updateComment: (commentId: number, data: UpdateTaskCommentDTO): Promise<{ ok: boolean }> =>
    apiClient.patch<{ ok: boolean }>(`/tasks/comments/${commentId}`, data),

  deleteComment: (commentId: number): Promise<void> =>
    apiClient.delete(`/tasks/comments/${commentId}`),

  getChanges: (taskId: number, page = 1, pageSize = 20): Promise<PaginatedTaskChanges> =>
    apiClient.get<PaginatedTaskChanges>(`/tasks/${taskId}/changes`, {
      page,
      page_size: pageSize,
    }),
}
