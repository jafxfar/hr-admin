import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { educationApi } from '@/api/education'
import type { CreateEducationRequest } from '@/types/education'

export const EDUCATION_QUERY_KEY = ['education']

export function useEducation(id: number) {
    return useQuery({
        queryKey: [...EDUCATION_QUERY_KEY, id],
        queryFn: () => educationApi.getEducationById(id),
        enabled: !!id,
    })
}

export function useCreateEducationMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateEducationRequest) => educationApi.createEducation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY })
        },
    })
}

export function useUpdateEducationMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ education_id, data }: { education_id: number; data: CreateEducationRequest }) =>
            educationApi.updateEducation(education_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY })
        },
    })
}

export function useDeleteEducationMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (education_id: number) => educationApi.deleteEducation(education_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY })
        },
    })
}
