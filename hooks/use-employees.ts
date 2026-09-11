import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '@/api/employee'
import type { EmployeeFilterParams, EmployeeSearchParams } from '@/api/employee'
import type { CreateEmployeeRequest, EmployeeTerminateRequest, UpdateEmployeeRequest } from '@/types/employees'

export const EMPLOYEES_QUERY_KEY = ['employees']

export function useEmployees(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, page, pageSize],
        queryFn: () => employeesApi.getEmployees(page, pageSize),
    })
}

export function useEmployeesFiltered(params: EmployeeFilterParams, enabled = true) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, 'filtered', params],
        queryFn: () => employeesApi.getEmployeesFiltered(params),
        enabled,
    })
}

export function useEmployeesSearch(params: EmployeeSearchParams, enabled = true) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, 'search', params],
        queryFn: () => employeesApi.searchEmployees(params),
        enabled: enabled && params.q.trim().length > 0,
    })
}

export function useEmployee(id: number) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, id],
        queryFn: () => employeesApi.getEmployeeById(id),
        enabled: !!id,
    })
}

export function useEmployeePositionHistory(id: number) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, id, 'position-history'],
        queryFn: () => employeesApi.getEmployeePositionHistory(id),
        enabled: !!id,
    })
}

export function useEmployeePositionChangeReasons(id: number) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, id, 'position-change-reasons'],
        queryFn: () => employeesApi.getEmployeePositionChangeReasons(id),
        enabled: !!id,
    })
}

export function useMe(enabled = true) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, 'me'],
        queryFn: () => employeesApi.getMeEmployee(),
        enabled,
    })
}

export function useCreateEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateEmployeeRequest) => employeesApi.createEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useUpdateEmployeeMutation(id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (data: UpdateEmployeeRequest) => employeesApi.updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] })
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id, 'position-history'] })
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id, 'position-change-reasons'] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useDeleteEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (id: number) => employeesApi.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useDeleteEmployeeProfilePhotoMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (id: number) => employeesApi.deleteEmployeeProfilePhoto(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useTerminateEmployeeMutation(id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (data: EmployeeTerminateRequest) => employeesApi.terminateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useTerminateEmployeeByIdMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ id, data }: { id: number; data: EmployeeTerminateRequest }) =>
            employeesApi.terminateEmployee(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, variables.id] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useReinstateEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (id: number) => employeesApi.reinstateEmployee(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useRestoreEmployeeMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (id: number) => employeesApi.restoreEmployee(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [...EMPLOYEES_QUERY_KEY, id] })
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
        },
    })
}

export function useDepartmentEmployeesAdmin(departmentId: number | null | undefined, page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...EMPLOYEES_QUERY_KEY, 'admin-department', departmentId, page, pageSize],
        queryFn: () => employeesApi.getDepartmentEmployeesAdmin(departmentId!, page, pageSize),
        enabled: !!departmentId && departmentId > 0,
    })
}
