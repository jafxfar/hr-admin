import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { timesheetApi } from '@/api/timesheet'
import type {
    TimesheetByDepartmentsParams,
    TimesheetUpdatePayload,
} from '@/api/timesheet'
import type { CreateTimesheetRequest } from '@/types/timesheet'

export const TIMESHEET_QUERY_KEY = ['timesheets']

// ── Запросы ────────────────────────────────────────────────────────────────────

/** Табель по всем отделам (основной для страницы табеля) */
export function useTimesheetByDepartments(params: TimesheetByDepartmentsParams = {}) {
    return useQuery({
        queryKey: [...TIMESHEET_QUERY_KEY, 'by-departments', params],
        queryFn: () => timesheetApi.getByDepartments(params),
    })
}

/** Табель по конкретному отделу */
export function useTimesheetByDepartmentId(
    departmentId: number | null,
    params: Omit<TimesheetByDepartmentsParams, 'page' | 'page_size'> = {},
) {
    return useQuery({
        queryKey: [...TIMESHEET_QUERY_KEY, 'by-department', departmentId, params],
        queryFn: () => timesheetApi.getByDepartmentId(departmentId!, params),
        enabled: departmentId !== null,
    })
}

/** Табель конкретного сотрудника с параметрами */
export function useTimesheetByUser(
    userId: number | null,
    params: { year?: number; month?: number; q?: string; page?: number; page_size?: number } = {},
) {
    return useQuery({
        queryKey: [...TIMESHEET_QUERY_KEY, 'by-user', userId, params],
        queryFn: () => timesheetApi.getByUser(userId!, params),
        enabled: userId !== null,
    })
}

/** Совместимость с существующим кодом */
export function useTimesheet(id: number) {
    return useQuery({
        queryKey: [...TIMESHEET_QUERY_KEY, id],
        queryFn: () => timesheetApi.getTimesheetById(id),
        enabled: !!id,
    })
}

// ── Мутации ────────────────────────────────────────────────────────────────────

export function useCreateTimesheetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateTimesheetRequest) => timesheetApi.createTimesheet(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TIMESHEET_QUERY_KEY })
        },
    })
}

export function useUpdateTimesheetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ timesheets_id, data }: { timesheets_id: number; data: TimesheetUpdatePayload }) =>
            timesheetApi.updateTimesheet(timesheets_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TIMESHEET_QUERY_KEY })
        },
    })
}

export function useDeleteTimesheetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (timesheetId: number) => timesheetApi.deleteTimesheet(timesheetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TIMESHEET_QUERY_KEY })
        },
    })
}

