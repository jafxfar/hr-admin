import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vacancyCategoryApi } from '@/api/vacancyCategories'
import type { CreateVacancyCategoryRequest, UpdateVacancyCategoryRequest } from '@/types/vacancyCategories'

export const VACANCY_CATEGORY_QUERY_KEY = ['vacancy-category']

export function useVacancyCategories(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...VACANCY_CATEGORY_QUERY_KEY, page, pageSize],
        queryFn: () => vacancyCategoryApi.getVacancyCategoryById(page, pageSize),
    })
}

export function useCreateVacancyCategoriesMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateVacancyCategoryRequest) => vacancyCategoryApi.createVacancyCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_CATEGORY_QUERY_KEY })
        },
    })
}

export function useUpdateVacancyCategoriesMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ category_id, data }: {
            category_id: number; data: UpdateVacancyCategoryRequest
        }) => vacancyCategoryApi.updateVacancyCategory(category_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_CATEGORY_QUERY_KEY })
        },
    })
}

export function useDeleteVacancyCategoryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (category_id: number) => vacancyCategoryApi.deleteVacancyCategory(category_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACANCY_CATEGORY_QUERY_KEY })
        },
    })
}
