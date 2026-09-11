import { apiClient } from './client'
import type { CreateBusinessRoleRequest, UpdateBusinessRoleRequest, BusinessRole, PaginatedBusinessRoles } from "@/types/businnessRole";

export const businesRoleApi = {

    getBusinessRole: (page = 1, pageSize = 20): Promise<PaginatedBusinessRoles> => {
        return apiClient.get<PaginatedBusinessRoles>(`/business-roles/all?page=${page}&page_size=${pageSize}`);
    },

    createBusinessRole: (data: CreateBusinessRoleRequest): Promise<number> => {
        return apiClient.post<number>('/business-roles/create', data);
    },

    updateBusinessRole: (role_id: number, data: UpdateBusinessRoleRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/business-roles/${role_id}`, data);
    },

    deleteBusinessRole: (role_id: number): Promise<void> => {
        return apiClient.delete<void>(`/business-roles/${role_id}`);
    }
}