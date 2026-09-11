import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { salaryApi } from '@/api/salary'
import type { CreateSalaryRequest } from '@/types/salary'

export const SALARY_QUERY_KEY = ['salary']

export function useSalary(id: number) {
    return useQuery({
        queryKey: [...SALARY_QUERY_KEY, id],
        queryFn: () => salaryApi.getSalaryById(id),
        enabled: !!id,
    })
}

export function useCreateSalaryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateSalaryRequest) => salaryApi.createSalary(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SALARY_QUERY_KEY })
        },
    })
}

export function useUpdateSalaryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ salary_id, data }: { salary_id: number; data: CreateSalaryRequest }) => salaryApi.updateSalary(salary_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SALARY_QUERY_KEY })
        },
    })
}

export function useDeleteSalaryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (salary_id: number) => salaryApi.deleteSalary(salary_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SALARY_QUERY_KEY })
        },
    })
}
