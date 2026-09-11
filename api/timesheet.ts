import type { CreateTimesheetRequest, Timesheet } from "@/types/timesheet";
import { apiClient } from './client'

// ── Extended Types ─────────────────────────────────────────────────────────────

export interface TimesheetRecord {
    id: number
    user_id: number
    work_date: string       // "YYYY-MM-DD"
    check_in: string | null // "HH:MM:SS"
    check_out: string | null
    status: string | null   // present | absent | late | ...
    details: Record<string, unknown> | null
    created_at: string
}

export interface TimesheetEmployee {
    user_id: number
    email: string | null
    timesheets: TimesheetRecord[]
}

export interface TimesheetDepartment {
    department_id: number
    department_name: string
    employees: TimesheetEmployee[]
}

export interface PaginatedTimesheetDepartments {
    items: TimesheetDepartment[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface PaginatedTimesheetList {
    items: TimesheetRecord[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export interface TimesheetByDepartmentsParams {
    year?: number
    month?: number
    q?: string
    page?: number
    page_size?: number
}

export interface TimesheetUpdatePayload {
    work_date?: string
    check_in?: string
    check_out?: string
    status?: string
    details?: Record<string, unknown>
}

// ── API ────────────────────────────────────────────────────────────────────────

export const timesheetApi = {

    /** GET /timesheets/by-user/{user_id} */
    getTimesheetById: (user_id: number): Promise<Timesheet[]> => {
        return apiClient.get<Timesheet[]>(`/timesheets/by-user/${user_id}`);
    },

    /** GET /timesheets/by-user/{user_id} с параметрами */
    getByUser: (
        userId: number,
        params: { year?: number; month?: number; q?: string; page?: number; page_size?: number } = {},
    ): Promise<PaginatedTimesheetList> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        q.set('page', String(params.page ?? 1))
        q.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedTimesheetList>(`/timesheets/by-user/${userId}?${q.toString()}`)
    },

    /** GET /timesheets/by-departments — сгруппировано по отделам */
    getByDepartments: (params: TimesheetByDepartmentsParams = {}): Promise<PaginatedTimesheetDepartments> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        q.set('page', String(params.page ?? 1))
        q.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedTimesheetDepartments>(`/timesheets/by-departments?${q.toString()}`)
    },

    /** GET /timesheets/by-departments/{id} — один отдел */
    getByDepartmentId: (
        departmentId: number,
        params: Omit<TimesheetByDepartmentsParams, 'page' | 'page_size'> = {},
    ): Promise<TimesheetDepartment> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        return apiClient.get<TimesheetDepartment>(`/timesheets/by-departments/${departmentId}?${q.toString()}`)
    },

    /** POST /timesheets/create */
    createTimesheet: (data: CreateTimesheetRequest): Promise<number> => {
        return apiClient.post<number>('/timesheets/create', data);
    },

    /** PUT /timesheets/{id} */
    updateTimesheet: (timesheet_id: number, data: TimesheetUpdatePayload): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/timesheets/${timesheet_id}`, data);
    },

    /** DELETE /timesheets/{id} */
    deleteTimesheet: (timesheet_id: number): Promise<void> => {
        return apiClient.delete<void>(`/timesheets/${timesheet_id}`)
    },

    /** GET /timesheets/by-departments/export */
    exportByDepartments: (
        params: Omit<TimesheetByDepartmentsParams, 'page' | 'page_size'> = {},
    ): Promise<Blob> => {
        const q = new URLSearchParams()
        if (params.year !== undefined) q.set('year', String(params.year))
        if (params.month !== undefined) q.set('month', String(params.month))
        if (params.q?.trim()) q.set('q', params.q.trim())
        return apiClient.get<Blob>(`/timesheets/by-departments/export?${q.toString()}`, {}, 'blob')
    },
}
