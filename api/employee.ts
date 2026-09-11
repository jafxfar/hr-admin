import type {
    CreateEmployeeRequest,
    Employee,
    EmployeePositionChangeHistoryEntry,
    EmployeeTerminateRequest,
    PaginatedEmployees,
    PositionHistoryEntry,
    UpdateEmployeeRequest,
} from "@/types/employees";
import { apiClient } from './client'

export interface EmployeeFilterParams {
    q?: string
    employee_status?: 'active' | 'terminated' | 'deleted'
    employee_statuses?: Array<'active' | 'terminated' | 'deleted'>
    gender?: 'male' | 'female'
    upcoming_birthdays_days?: number
    has_contract?: boolean
    has_salary?: boolean
    has_schedule?: boolean
    has_documents?: boolean
    has_profile_photo?: boolean
    branch_ids?: number[]
    department_ids?: number[]
    page?: number
    page_size?: number
}

export interface EmployeeSearchParams {
    q: string
    include_inactive?: boolean
    page?: number
    page_size?: number
}

export const employeesApi = {
    getEmployees: (page = 1, pageSize = 20): Promise<PaginatedEmployees> => {
        return apiClient.get<PaginatedEmployees>(`/employees/all?page=${page}&page_size=${pageSize}`);
    },

    getEmployeesFiltered: (params: EmployeeFilterParams): Promise<PaginatedEmployees> => {
        const query = new URLSearchParams()
        if (params.q !== undefined && params.q.trim().length > 0) query.set('q', params.q.trim())
        if (params.employee_status) query.set('employee_status', params.employee_status)
        params.employee_statuses?.forEach((status) => query.append('employee_statuses', status))
        if (params.gender !== undefined) query.set('gender', params.gender)
        if (params.upcoming_birthdays_days !== undefined) query.set('upcoming_birthdays_days', String(params.upcoming_birthdays_days))
        if (params.has_contract !== undefined) query.set('has_contract', String(params.has_contract))
        if (params.has_salary !== undefined) query.set('has_salary', String(params.has_salary))
        if (params.has_schedule !== undefined) query.set('has_schedule', String(params.has_schedule))
        if (params.has_documents !== undefined) query.set('has_documents', String(params.has_documents))
        if (params.has_profile_photo !== undefined) query.set('has_profile_photo', String(params.has_profile_photo))
        if (params.branch_ids?.length) {
            params.branch_ids.forEach((id) => query.append('branch_ids', String(id)))
        }
        if (params.department_ids?.length) {
            params.department_ids.forEach((id) => query.append('department_ids', String(id)))
        }
        query.set('page', String(params.page ?? 1))
        query.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedEmployees>(`/employees/all?${query.toString()}`);
    },

    searchEmployees: (params: EmployeeSearchParams): Promise<PaginatedEmployees> => {
        const query = new URLSearchParams()
        query.set('q', params.q)
        query.set('include_inactive', String(params.include_inactive ?? false))
        query.set('page', String(params.page ?? 1))
        query.set('page_size', String(params.page_size ?? 20))
        return apiClient.get<PaginatedEmployees>(`/employees/search?${query.toString()}`);
    },

    getMeEmployee: (): Promise<Employee> => {
        return apiClient.get<Employee>('/employees/employee/me');
    },

    getEmployeeById: (employee_id: number): Promise<Employee> => {
        return apiClient.get<Employee>(`/employees/employee/${employee_id}`);
    },

    /** Периоды назначений (user_positions) — даты начала/окончания текущей должности */
    getEmployeePositionHistory: (employee_id: number): Promise<PositionHistoryEntry[]> => {
        return apiClient.get<PositionHistoryEntry[]>(`/employees/employee/${employee_id}/position-history`);
    },

    /** История смен должности/отдела с основаниями (блок «История перемещений» на карточке) */
    getEmployeePositionChangeReasons: (employee_id: number): Promise<EmployeePositionChangeHistoryEntry[]> => {
        return apiClient.get<EmployeePositionChangeHistoryEntry[]>(
            `/employees/employee/${employee_id}/position-change-reasons`,
        );
    },

    createEmployee: (data: CreateEmployeeRequest): Promise<number> => {
        return apiClient.post<number>('/employees/employee/create', data);
    },

    updateEmployee: (employee_id: number, data: UpdateEmployeeRequest): Promise<Employee> => {
        return apiClient.put<Employee>(`/employees/employee/${employee_id}`, data);
    },

    deleteEmployee: (employee_id: number): Promise<void> => {
        return apiClient.delete<void>(`/employees/employee/${employee_id}`);
    },

    deleteEmployeeProfilePhoto: (employee_id: number): Promise<{ id: number }> => {
        return apiClient.delete<{ id: number }>(`/employees/employee/${employee_id}/profile-photo`);
    },

    terminateEmployee: (employee_id: number, data: EmployeeTerminateRequest): Promise<void> => {
        return apiClient.post<void>(`/employees/employee/${employee_id}/terminate`, data);
    },

    reinstateEmployee: (employee_id: number): Promise<void> => {
        return apiClient.post<void>(`/employees/employee/${employee_id}/reinstate`);
    },

    restoreEmployee: (employee_id: number): Promise<void> => {
        return apiClient.post<void>(`/employees/employee/${employee_id}/restore`);
    },

    getDepartmentEmployeesAdmin: (department_id: number, page = 1, pageSize = 20): Promise<PaginatedEmployees> => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
        })
        return apiClient.get<PaginatedEmployees>(`/employees/admin/departments/${department_id}/employees?${params.toString()}`)
    },
}
