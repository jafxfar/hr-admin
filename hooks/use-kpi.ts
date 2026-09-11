import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { kpiApi } from '@/api/kpi'
import type {
    KPIByDepartmentsParams,
    KPIByUserParams,
    KPICreatePayload,
    KPIUpdatePayload,
    KPIBulkUpsertPayload,
} from '@/api/kpi'

export const KPI_QUERY_KEY = ['kpis']

// ── Запросы ────────────────────────────────────────────────────────────────────

/** KPI по всем отделам (с пагинацией по отделам) */
export function useKPIByDepartments(params: KPIByDepartmentsParams = {}) {
    return useQuery({
        queryKey: [...KPI_QUERY_KEY, 'by-departments', params],
        queryFn: () => kpiApi.getByDepartments(params),
    })
}

/** KPI по конкретному отделу */
export function useKPIByDepartmentId(
    departmentId: number | null,
    params: Omit<KPIByDepartmentsParams, 'page' | 'page_size'> = {},
) {
    return useQuery({
        queryKey: [...KPI_QUERY_KEY, 'by-department', departmentId, params],
        queryFn: () => kpiApi.getByDepartmentId(departmentId!, params),
        enabled: departmentId !== null,
    })
}

/** Все KPI (flat list) */
export function useKPIAll(params: KPIByDepartmentsParams = {}) {
    return useQuery({
        queryKey: [...KPI_QUERY_KEY, 'all', params],
        queryFn: () => kpiApi.getAll(params),
    })
}

/** KPI конкретного сотрудника */
export function useKPIByUser(userId: number | null, params: KPIByUserParams = {}) {
    return useQuery({
        queryKey: [...KPI_QUERY_KEY, 'by-user', userId, params],
        queryFn: () => kpiApi.getByUser(userId!, params),
        enabled: userId !== null,
    })
}

/** Один KPI по id */
export function useKPIById(kpiId: number | null) {
    return useQuery({
        queryKey: [...KPI_QUERY_KEY, kpiId],
        queryFn: () => kpiApi.getById(kpiId!),
        enabled: kpiId !== null,
    })
}

// ── Мутации ────────────────────────────────────────────────────────────────────

export function useCreateKPIMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (payload: KPICreatePayload) => kpiApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KPI_QUERY_KEY })
        },
    })
}

export function useUpdateKPIMutation(kpiId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (payload: KPIUpdatePayload) => kpiApi.update(kpiId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KPI_QUERY_KEY })
        },
    })
}

export function useBulkUpsertKPIMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (payload: KPIBulkUpsertPayload) => kpiApi.bulkUpsert(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KPI_QUERY_KEY })
        },
    })
}

export function useDeleteKPIMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (kpiId: number) => kpiApi.delete(kpiId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KPI_QUERY_KEY })
        },
    })
}
