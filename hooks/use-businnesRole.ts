import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { businesRoleApi } from '@/api/businessRole'
import type { CreateBusinessRoleRequest, UpdateBusinessRoleRequest } from '@/types/businnessRole'

export const IDEAS_QUERY_KEY = ['business-ole']

export function useBusinnessRoles(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...IDEAS_QUERY_KEY, page, pageSize],
        queryFn: () => businesRoleApi.getBusinessRole(page, pageSize),
    })
}

export function useCreateBusinnessRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateBusinessRoleRequest) => businesRoleApi.createBusinessRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useUpdateBusinnessRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ idea_id, data }: { idea_id: number; data: UpdateBusinessRoleRequest }) =>
            businesRoleApi.updateBusinessRole(idea_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useDeleteBusinnessRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (role_id: number) => businesRoleApi.deleteBusinessRole(role_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}
