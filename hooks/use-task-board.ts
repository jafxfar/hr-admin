import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/api/tasks'
import { moveCardInBoard } from '@/lib/task-board'
import {
  TASK_BOARD_KEY,
  TASK_DASHBOARD_KEY,
  TASK_STATUSES_KEY,
  TASK_TABLE_KEY,
} from '@/lib/tasks/query-keys'
import type {
  CreateTaskStatusDTO,
  TaskBoardFilters,
  TaskBoardResponse,
  UpdateTaskStatusDTO,
} from '@/types/taskBoard'

export { TASK_STATUSES_KEY, TASK_BOARD_KEY }

export const taskBoardQueryKey = (filters?: TaskBoardFilters) => [
  TASK_BOARD_KEY,
  filters?.assigneeId ?? 'all',
  filters?.projectId ?? 'all',
  filters?.q?.trim() ?? '',
]

const invalidateStatusRelated = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: TASK_STATUSES_KEY })
  queryClient.invalidateQueries({ queryKey: [TASK_BOARD_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_TABLE_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_DASHBOARD_KEY], exact: false })
}

export const useTaskStatuses = (includeInactive = false) =>
  useQuery({
    queryKey: [...TASK_STATUSES_KEY, includeInactive],
    queryFn: () => tasksApi.getStatuses(includeInactive),
  })

export const useCreateTaskStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateTaskStatusDTO) => tasksApi.createStatus(data),
    onSuccess: () => {
      invalidateStatusRelated(queryClient)
    },
  })
}

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ code, data }: { code: string; data: UpdateTaskStatusDTO }) =>
      tasksApi.updateStatus(code, data),
    onSuccess: () => {
      invalidateStatusRelated(queryClient)
    },
  })
}

export const useDeleteTaskStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (code: string) => tasksApi.deleteStatus(code),
    onSuccess: () => {
      invalidateStatusRelated(queryClient)
    },
  })
}

export const useTaskBoard = (filters?: TaskBoardFilters, enabled = true) =>
  useQuery({
    queryKey: taskBoardQueryKey(filters),
    queryFn: () => tasksApi.getBoard(filters),
    enabled,
  })

export const useUpdateTaskBoardPositionMutation = (filters?: TaskBoardFilters) => {
  const queryClient = useQueryClient()
  const boardQueryKey = taskBoardQueryKey(filters)

  return useMutation({
    meta: { mutationAction: 'update' as const, skipSuccessToast: true },
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: number
      data: { status_code: string; position: number }
      globalInsertIndex?: number
    }) => tasksApi.updateBoardPosition(taskId, data),
    onMutate: async ({ taskId, data, globalInsertIndex }) => {
      await queryClient.cancelQueries({ queryKey: boardQueryKey })
      const previous = queryClient.getQueryData<TaskBoardResponse>(boardQueryKey)
      if (previous && globalInsertIndex != null) {
        const optimistic = moveCardInBoard(
          previous,
          taskId,
          data.status_code,
          globalInsertIndex
        )
        queryClient.setQueryData(boardQueryKey, optimistic)
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(boardQueryKey, context.previous)
      }
      queryClient.invalidateQueries({ queryKey: boardQueryKey })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey })
      queryClient.invalidateQueries({ queryKey: [TASK_TABLE_KEY], exact: false })
      queryClient.invalidateQueries({ queryKey: [TASK_DASHBOARD_KEY], exact: false })
    },
  })
}
