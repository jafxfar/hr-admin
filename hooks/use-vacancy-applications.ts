import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vacancyApplicationsApi } from '@/api/vacancy-applications'
import { VACANCY_APPLICATION_BOARD_KEY } from '@/hooks/use-vacancy-application-board'
import type {
  CreateVacancyApplicationDTO,
  UpdateVacancyApplicationDTO,
} from '@/types/vacancyApplications'

export const VACANCY_APPLICATIONS_QUERY_KEY = ['vacancy-applications']

export function useVacancyApplications(page = 1, pageSize = 20, q = '') {
  return useQuery({
    queryKey: [...VACANCY_APPLICATIONS_QUERY_KEY, page, pageSize, q],
    queryFn: () => vacancyApplicationsApi.getAll(page, pageSize, q ?? ''),
  })
}

export function useUpdateVacancyApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ applicationId, data }: { applicationId: number; data: UpdateVacancyApplicationDTO }) =>
      vacancyApplicationsApi.update(applicationId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: VACANCY_APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [VACANCY_APPLICATION_BOARD_KEY], exact: false })
    },
  })
}

export function useCreateVacancyApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: ({ vacancyId, data }: { vacancyId: number; data: CreateVacancyApplicationDTO }) =>
      vacancyApplicationsApi.createForVacancy(vacancyId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: VACANCY_APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [VACANCY_APPLICATION_BOARD_KEY], exact: false })
    },
  })
}
