import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { requestsApi } from '@/api/requests'
import type { CreateRequestDTO, UpdateRequestStatusDTO } from '@/types/request'

export const REQUESTS_QUERY_KEY = ['requests']

export function useRequests(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...REQUESTS_QUERY_KEY, page, pageSize],
        queryFn: () => requestsApi.getAllRequests(page, pageSize),
    })
}

export function useRequest(request_id: number) {
    return useQuery({
        queryKey: [...REQUESTS_QUERY_KEY, request_id],
        queryFn: () => requestsApi.getRequestById(request_id),
        enabled: !!request_id,
    })
}

export function useCreateRequestMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateRequestDTO) => requestsApi.createRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY })
        },
    })
}

export function useUpdateRequestStatusMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ request_id, data }: { request_id: number; data: UpdateRequestStatusDTO }) =>
            requestsApi.updateRequestStatus(request_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY })
        },
    })
}

export function useDeleteRequestMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (request_id: number) => requestsApi.deleteRequest(request_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY })
        },
    })
}
