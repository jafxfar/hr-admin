import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vacancyApi } from '@/api/vacancy'
import type { CreateVacancyRequest, UpdateVacancyRequest } from '@/types/vacancies'

export const VACANCY_QUERY_KEY = ['vacancy']

export function useVacancy(page = 1, pageSize = 20, q = '') {
    return useQuery({
        queryKey: [...VACANCY_QUERY_KEY, 'all', page, pageSize, q],
        queryFn: () => vacancyApi.getVacancies(page, pageSize, q ?? ''),
    })
}

export function useVacancy4Admin(page = 1, pageSize = 20, q = '') {
    return useQuery({
        queryKey: [...VACANCY_QUERY_KEY, 'admin', page, pageSize, q],
        queryFn: () => vacancyApi.getVacancies4Admin(page, pageSize, q ?? ''),
    })
}

export function useCreateVacancyMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateVacancyRequest) => vacancyApi.createVacancy(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_QUERY_KEY })
        },
    })
}

export function useUpdateVacancyMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ vacancy_id, data }: {
            vacancy_id: number; data: UpdateVacancyRequest
        }) => vacancyApi.updateVacancy(vacancy_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_QUERY_KEY })
        },
    })
}

export function useDeleteVacancyMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (vacancy_id: number) => vacancyApi.deleteVacancy(vacancy_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_QUERY_KEY })
        },
    })
}
