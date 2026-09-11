import type { Request, CreateRequestDTO, UpdateRequestStatusDTO, PaginatedRequests } from '@/types/request'
import { apiClient } from './client'

export const requestsApi = {
    getAllRequests: (page = 1, pageSize = 20): Promise<PaginatedRequests> => {
        return apiClient.get<PaginatedRequests>(`/requests/all?page=${page}&page_size=${pageSize}`)
    },

    getRequestById: (request_id: number): Promise<Request> => {
        return apiClient.get<Request>(`/requests/${request_id}`)
    },

    createRequest: (data: CreateRequestDTO): Promise<number> => {
        return apiClient.post<number>('/requests/create', data)
    },

    updateRequestStatus: (request_id: number, data: UpdateRequestStatusDTO): Promise<Request> => {
        return apiClient.put<Request>(`/requests/${request_id}/status`, data)
    },

    deleteRequest: (request_id: number): Promise<void> => {
        return apiClient.delete<void>(`/requests/${request_id}`)
    },
}
