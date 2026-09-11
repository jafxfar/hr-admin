import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vacancyApplicationsApi } from '@/api/vacancy-applications'
import { moveCardInBoard } from '@/lib/vacancy-board'
import type {
  BoardPositionPatch,
  CreateVacancyApplicationStatusDTO,
  UpdateVacancyApplicationStatusDTO,
  VacancyApplicationBoardFilters,
  VacancyApplicationBoardResponse,
} from '@/types/vacancyApplicationBoard'
import { VACANCY_QUERY_KEY } from '@/hooks/use-vacancy'

export const VACANCY_APPLICATION_STATUSES_KEY = ['vacancy-application-statuses']
export const VACANCY_APPLICATION_BOARD_KEY = 'vacancy-application-board'

export const vacancyApplicationBoardQueryKey = (filters?: VacancyApplicationBoardFilters) => [
  VACANCY_APPLICATION_BOARD_KEY,
  filters?.vacancyId ?? 'all',
  filters?.q?.trim() ?? '',
]

export function useVacancyApplicationStatuses(includeInactive = false) {
  return useQuery({
    queryKey: [...VACANCY_APPLICATION_STATUSES_KEY, includeInactive],
    queryFn: () => vacancyApplicationsApi.getStatuses(includeInactive),
  })
}

export function useCreateVacancyApplicationStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateVacancyApplicationStatusDTO) =>
      vacancyApplicationsApi.createStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACANCY_APPLICATION_STATUSES_KEY })
      queryClient.invalidateQueries({ queryKey: [VACANCY_APPLICATION_BOARD_KEY], exact: false })
    },
  })
}

export function useUpdateVacancyApplicationStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ code, data }: { code: string; data: UpdateVacancyApplicationStatusDTO }) =>
      vacancyApplicationsApi.updateStatus(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACANCY_APPLICATION_STATUSES_KEY })
      queryClient.invalidateQueries({ queryKey: [VACANCY_APPLICATION_BOARD_KEY], exact: false })
    },
  })
}

export function useDeleteVacancyApplicationStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (code: string) => vacancyApplicationsApi.deleteStatus(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACANCY_APPLICATION_STATUSES_KEY })
      queryClient.invalidateQueries({ queryKey: [VACANCY_APPLICATION_BOARD_KEY], exact: false })
    },
  })
}

export function useVacancyApplicationBoard(filters?: VacancyApplicationBoardFilters) {
  return useQuery({
    queryKey: vacancyApplicationBoardQueryKey(filters),
    queryFn: () => vacancyApplicationsApi.getGlobalBoard(filters),
  })
}

export function useUpdateBoardPositionMutation(filters?: VacancyApplicationBoardFilters) {
  const queryClient = useQueryClient()
  const boardQueryKey = vacancyApplicationBoardQueryKey(filters)

  return useMutation({
    meta: { mutationAction: 'update' as const, skipSuccessToast: true },
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: number
      data: BoardPositionPatch
      closesVacancy?: boolean
      globalInsertIndex?: number
    }) => vacancyApplicationsApi.updateBoardPosition(applicationId, data),
    onMutate: async ({ applicationId, data, globalInsertIndex }) => {
      await queryClient.cancelQueries({ queryKey: boardQueryKey })
      const previous = queryClient.getQueryData<VacancyApplicationBoardResponse>(boardQueryKey)
      if (previous && globalInsertIndex != null) {
        const optimistic = moveCardInBoard(
          previous,
          applicationId,
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
    onSuccess: (_data, variables) => {
      if (variables.closesVacancy) {
        queryClient.invalidateQueries({ queryKey: VACANCY_QUERY_KEY })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey })
    },
  })
}
