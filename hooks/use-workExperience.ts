import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workExperienceApi } from '@/api/workExperience'
import type { CreateWorkExperienceRequest } from '@/types/workExperience'

export const WORKEXP_QUERY_KEY = ['work-experiences']

export function useEmployee(id: number) {
    return useQuery({
        queryKey: [...WORKEXP_QUERY_KEY, id],
        queryFn: () => workExperienceApi.getWorkExperienceById(id),
        enabled: !!id,
    })
}

export function useCreateEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateWorkExperienceRequest) => workExperienceApi.createWorkExperience(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKEXP_QUERY_KEY })
        },
    })
}

export function useUpdateEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ work_experience_id, data }: { work_experience_id: number; data: CreateWorkExperienceRequest }) => workExperienceApi.updateWorkExperience(work_experience_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKEXP_QUERY_KEY })
        },
    })
}

export function useDeleteWorkExperienceMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (work_experience_id: number) => workExperienceApi.deleteWorkExperience(work_experience_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKEXP_QUERY_KEY })
        },
    })
}
