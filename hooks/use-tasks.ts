import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/api/tasks'
import {
  PROJECTS_KEY,
  PROJECT_TASKS_KEY,
  TASK_ARCHIVE_KEY,
  TASK_BOARD_KEY,
  TASK_CHANGES_KEY,
  TASK_COMMENTS_KEY,
  TASK_DASHBOARD_KEY,
  TASK_DETAIL_KEY,
  TASK_LIST_KEY,
  TASK_TABLE_KEY,
} from '@/lib/tasks/query-keys'
import type {
  CreateTaskCommentDTO,
  CreateTaskDTO,
  TaskDashboardFilters,
  TaskListQuery,
  UpdateTaskCommentDTO,
  UpdateTaskDTO,
} from '@/types/tasks'

export {
  TASK_DETAIL_KEY,
  TASK_COMMENTS_KEY,
  TASK_CHANGES_KEY,
  TASK_TABLE_KEY,
  TASK_DASHBOARD_KEY,
  TASK_LIST_KEY,
  TASK_ARCHIVE_KEY,
}

export const useTask = (taskId: number | null, enabled = true) =>
  useQuery({
    queryKey: [TASK_DETAIL_KEY, taskId],
    queryFn: () => tasksApi.getTask(taskId as number),
    enabled: enabled && taskId != null && taskId > 0,
  })

export const useTaskComments = (taskId: number | null, enabled = true) =>
  useQuery({
    queryKey: [TASK_COMMENTS_KEY, taskId],
    queryFn: () => tasksApi.getComments(taskId as number),
    enabled: enabled && taskId != null && taskId > 0,
  })

export const useTaskChanges = (taskId: number | null, page = 1, enabled = true) =>
  useQuery({
    queryKey: [TASK_CHANGES_KEY, taskId, page],
    queryFn: () => tasksApi.getChanges(taskId as number, page),
    enabled: enabled && taskId != null && taskId > 0,
  })

export const useTasksTable = (query: TaskListQuery, enabled = true) =>
  useQuery({
    queryKey: [TASK_TABLE_KEY, query],
    queryFn: () => tasksApi.getTable(query),
    enabled,
  })

export const useTasksDashboard = (filters?: TaskDashboardFilters) =>
  useQuery({
    queryKey: [
      TASK_DASHBOARD_KEY,
      filters?.projectId ?? 'all',
      filters?.assigneeId ?? 'all',
      filters?.createdBy ?? 'all',
      filters?.mine ?? false,
      filters?.includeSubtasks ?? false,
    ],
    queryFn: () => tasksApi.getDashboard(filters),
  })

export const useTasksAll = (query: TaskListQuery, enabled = true) =>
  useQuery({
    queryKey: [TASK_LIST_KEY, 'all', query],
    queryFn: () => tasksApi.getAll(query),
    enabled,
  })

export const useTasksMy = (query: TaskListQuery, enabled = true) =>
  useQuery({
    queryKey: [TASK_LIST_KEY, 'my', query],
    queryFn: () => tasksApi.getMy(query),
    enabled,
  })

export const useTasksArchive = (
  page = 1,
  pageSize = 20,
  q?: string,
  enabled = true
) =>
  useQuery({
    queryKey: [TASK_ARCHIVE_KEY, page, pageSize, q?.trim() ?? ''],
    queryFn: () => tasksApi.getArchive(page, pageSize, q),
    enabled,
  })

const invalidateTaskQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  taskId?: number | null
) => {
  queryClient.invalidateQueries({ queryKey: [TASK_BOARD_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_TABLE_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_DASHBOARD_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_LIST_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_ARCHIVE_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [PROJECT_TASKS_KEY], exact: false })
  if (taskId) {
    queryClient.invalidateQueries({ queryKey: [TASK_DETAIL_KEY, taskId] })
    queryClient.invalidateQueries({ queryKey: [TASK_COMMENTS_KEY, taskId] })
    queryClient.invalidateQueries({ queryKey: [TASK_CHANGES_KEY, taskId] })
  }
}

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateTaskDTO) => tasksApi.createTask(data),
    onSuccess: (_id, variables) => {
      invalidateTaskQueries(queryClient, variables.parent_id ?? null)
    },
  })
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskDTO }) =>
      tasksApi.updateTask(taskId, data),
    onSuccess: (_data, variables) => {
      invalidateTaskQueries(queryClient, variables.taskId)
    },
  })
}

export const useArchiveTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (taskId: number) => tasksApi.archiveTask(taskId),
    onSuccess: (_data, taskId) => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}

export const useHardDeleteTaskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (taskId: number) => tasksApi.hardDeleteArchive(taskId),
    onSuccess: (_data, taskId) => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}

export const useCreateTaskCommentMutation = (taskId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateTaskCommentDTO) => tasksApi.createComment(taskId, data),
    onSuccess: () => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}

export const useUpdateTaskCommentMutation = (taskId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number
      data: UpdateTaskCommentDTO
    }) => tasksApi.updateComment(commentId, data),
    onSuccess: () => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}

export const useDeleteTaskCommentMutation = (taskId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (commentId: number) => tasksApi.deleteComment(commentId),
    onSuccess: () => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}
