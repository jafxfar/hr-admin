import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { departmentsApi } from '@/api/departments'
import { BRANCHES_QUERY_KEY } from '@/api/branches'
import type { CreateDepartmentDTO, UpdateDepartmentDTO } from '@/types/departments'

export const DEPARTMENTS_QUERY_KEY = ['departments']

export function useDepartmentsTree(branchId?: number, enabled = true) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, 'tree', branchId ?? null],
        queryFn: () => departmentsApi.getDepartmentsTree(branchId),
        enabled,
    })
}

export function useSearchDepartments(q: string, page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, 'all', q, page, pageSize],
        queryFn: () => departmentsApi.getAllDepartments(q, page, pageSize),
        placeholderData: (prev) => prev,
    })
}

export function useDepartment(department_id: number) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, department_id],
        queryFn: () => departmentsApi.getDepartmentById(department_id),
        enabled: !!department_id,
    })
}

export function useDepartmentEmployees(
    department_id: number,
    page = 1,
    pageSize = 20,
    include_inactive = false,
    enabled = true,
) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, department_id, 'employees', page, pageSize, include_inactive],
        queryFn: () => departmentsApi.getDepartmentEmployees(department_id, page, pageSize, include_inactive),
        enabled: !!department_id && enabled,
    })
}

export function useDepartmentChildren(department_id: number) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, department_id, 'children'],
        queryFn: () => departmentsApi.getDepartmentChildren(department_id),
        enabled: !!department_id,
    })
}

export function useDepartmentParents(department_id: number) {
    return useQuery({
        queryKey: [...DEPARTMENTS_QUERY_KEY, department_id, 'parents'],
        queryFn: () => departmentsApi.getDepartmentParents(department_id),
        enabled: !!department_id,
    })
}

export function useCreateDepartmentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateDepartmentDTO) => departmentsApi.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY, 'tree'] })
        },
    })
}

export function useUpdateDepartmentMutation(department_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (data: UpdateDepartmentDTO) => departmentsApi.updateDepartment(department_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY, 'tree'] })
        },
    })
}

export function useDeleteDepartmentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (department_id: number) => departmentsApi.deleteDepartment(department_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY, 'tree'] })
        },
    })
}
