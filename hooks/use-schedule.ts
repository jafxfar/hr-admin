import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scheduleApi } from '@/api/schedule'
import type { CreateScheduleRequest } from '@/types/schedule'

export const SCHEDULE_QUERY_KEY = ['schedule']

export function useSchedule(id: number) {
    return useQuery({
        queryKey: [...SCHEDULE_QUERY_KEY, id],
        queryFn: () => scheduleApi.getScheduleById(id),
        enabled: !!id,
    })
}

export function useCreateScheduleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateScheduleRequest) => scheduleApi.createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY })
        },
    })
}

export function useUpdateScheduleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ schedule_id, data }: { schedule_id: number; data: CreateScheduleRequest }) => scheduleApi.updateSchedule(schedule_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY })
        },
    })
}

export function useDeleteScheduleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (schedule_id: number) => scheduleApi.deleteSchedule(schedule_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY })
        },
    })
}
