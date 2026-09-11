import type { CreateDepartmentDTO, Department, UpdateDepartmentDTO } from '@/types/departments'
import { apiClient } from './client'
import type { PaginatedEmployees } from '@/types/employees'

export interface PaginatedDepartments {
    items: Department[]
    total: number
    page: number
    page_size: number
    total_pages: number
}

export const departmentsApi = {
    getAllDepartments: (q = '', page = 1, pageSize = 20): Promise<PaginatedDepartments> => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
            include_inactive: 'false',
        })
        if (q.trim()) params.set('q', q.trim())
        return apiClient.get<PaginatedDepartments>(`/departments/all?${params.toString()}`)
    },

    getDepartmentById: (department_id: number): Promise<Department> => {
        return apiClient.get<Department>(`/departments/department/${department_id}`)
    },

    createDepartment: (data: CreateDepartmentDTO): Promise<number> => {
        return apiClient.post<number>('/departments/department/create', data)
    },

    updateDepartment: (department_id: number, data: UpdateDepartmentDTO): Promise<Department> => {
        return apiClient.patch<Department>(`/departments/department/${department_id}`, data)
    },

    deleteDepartment: (department_id: number): Promise<void> => {
        return apiClient.delete<void>(`/departments/department/${department_id}`)
    },

    getDepartmentEmployees: (department_id: number, page = 1, pageSize = 20, include_inactive = false): Promise<PaginatedEmployees> => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
            include_inactive: String(include_inactive),
        })
        return apiClient.get<PaginatedEmployees>(`/employees/admin/departments/${department_id}/employees?${params.toString()}`)
    },

    getDepartmentChildren: (department_id: number): Promise<Department[]> => {
        return apiClient.get<Department[]>(`/departments/department/${department_id}/children`)
    },

    getDepartmentParents: (department_id: number): Promise<Department[]> => {
        return apiClient.get<Department[]>(`/departments/department/${department_id}/parents`)
    },

    // Возвращает плоский список всех отделов с полями level, parentId, path
    getDepartmentsTree: (branchId?: number): Promise<Department[]> => {
        const params = new URLSearchParams()
        if (branchId != null) params.set('branch_id', String(branchId))
        const qs = params.toString()
        return apiClient.get<Department[]>(qs ? `/departments/tree?${qs}` : '/departments/tree')
    },
}
