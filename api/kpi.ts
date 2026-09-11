import { apiClient } from './client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface KPIItem {
    id: number
    user_id: number
    title: string
    target_value: number | null
    actual_value: number | null
    period: string | null
    details: Record<string, unknown> | null
    created_at: string
    updated_at: string
}

export interface KPIEmployee {
    user_id: number
    email: string
    first_name?: string
    last_name?: string
    kpis: KPIItem[]
}

export interface KPIDepartment {
    department_id: number
    department_name: string
    employees: KPIEmployee[]
}

export interface PaginatedKPIDepartments {
    items: KPIDepartment[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface PaginatedKPIList {
    items: KPIItem[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface KPIByDepartmentsParams {
    year?: number
    month?: number
    q?: string
    page?: number
    page_size?: number
}

export interface KPIByUserParams {
    year?: number
    month?: number
    q?: string
    page?: number
    page_size?: number
}

export interface KPICreatePayload {
    user_id: number
    title: string
    target_value?: number
    actual_value?: number
    period?: string
    details?: Record<string, unknown>
}

export interface KPIUpdatePayload {
    title?: string
    target_value?: number
    actual_value?: number
    period?: string
    details?: Record<string, unknown>
}

export interface KPIEmployeeUpdateItem {
    user_id: number
    target_value?: number
    actual_value?: number
    period?: string
    details?: Record<string, unknown>
}

export interface KPIBulkUpsertPayload {
    title: string
    employees: KPIEmployeeUpdateItem[]
}

// ── API ────────────────────────────────────────────────────────────────────────

export const kpiApi = {
    /** GET /kpis/by-departments — KPI сгруппированные по отделам */
    getByDepartments: (params: KPIByDepartmentsParams = {}): Promise<PaginatedKPIDepartments> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        q.set('page', String(params.page ?? 1))
        q.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedKPIDepartments>(`/kpis/by-departments?${q.toString()}`)
    },

    /** GET /kpis/by-departments/{id} — KPI по одному отделу */
    getByDepartmentId: (
        departmentId: number,
        params: Omit<KPIByDepartmentsParams, 'page' | 'page_size'> = {},
    ): Promise<KPIDepartment> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        return apiClient.get<KPIDepartment>(`/kpis/by-departments/${departmentId}?${q.toString()}`)
    },

    /** GET /kpis/all — все KPI */
    getAll: (params: KPIByDepartmentsParams = {}): Promise<PaginatedKPIList> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        q.set('page', String(params.page ?? 1))
        q.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedKPIList>(`/kpis/all?${q.toString()}`)
    },

    /** GET /kpis/by-user/{user_id} — KPI конкретного сотрудника */
    getByUser: (userId: number, params: KPIByUserParams = {}): Promise<PaginatedKPIList> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        q.set('page', String(params.page ?? 1))
        q.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedKPIList>(`/kpis/by-user/${userId}?${q.toString()}`)
    },

    /** GET /kpis/{id} — один KPI */
    getById: (kpiId: number): Promise<KPIItem> => {
        return apiClient.get<KPIItem>(`/kpis/${kpiId}`)
    },

    /** POST /kpis/create */
    create: (payload: KPICreatePayload): Promise<number> => {
        return apiClient.post<number>('/kpis/create', payload)
    },

    /** PUT /kpis/{id} */
    update: (kpiId: number, payload: KPIUpdatePayload): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/kpis/${kpiId}`, payload)
    },

    /** PUT /kpis/bulk/by-employees — массовое создание/обновление */
    bulkUpsert: (payload: KPIBulkUpsertPayload): Promise<{ updated: number }> => {
        return apiClient.put<{ updated: number }>('/kpis/bulk/by-employees', payload)
    },

    /** DELETE /kpis/{id} */
    delete: (kpiId: number): Promise<void> => {
        return apiClient.delete<void>(`/kpis/${kpiId}`)
    },

    /** GET /kpis/by-departments/export — скачать Excel */
    exportByDepartments: (params: Omit<KPIByDepartmentsParams, 'page' | 'page_size'> = {}): Promise<Blob> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        return apiClient.get<Blob>(`/kpis/by-departments/export?${q.toString()}`, {}, 'blob')
    },
}
