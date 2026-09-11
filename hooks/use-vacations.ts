import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vacationsApi } from '@/api/vacation'
import type { CreateVacationRequest, UpdateVacationRequest } from '@/types/vacation'

export const VACATION_QUERY_KEY = ['vacation']

export function useSalary(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...VACATION_QUERY_KEY, page, pageSize],
        queryFn: () => vacationsApi.getVacations(page, pageSize),
    })
}

export function useMySalary() {
    return useQuery({
        queryKey: [...VACATION_QUERY_KEY],
        queryFn: () => vacationsApi.getMyVacation(),
    })
}


export function useCreateSalaryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateVacationRequest) => vacationsApi.createVacation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACATION_QUERY_KEY })
        },
    })
}

export function useUpdateSalaryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ vacation_id, data }: { vacation_id: number; data: UpdateVacationRequest }) => vacationsApi.updateVacation(vacation_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACATION_QUERY_KEY })
        },
    })
}

export function useDeleteVacationMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (vacation_id: number) => vacationsApi.deleteVacation(vacation_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VACATION_QUERY_KEY })
        },
    })
}
