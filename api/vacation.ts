import type { CreateVacationRequest, Vacation, UpdateVacationRequest, PaginatedVacations } from "@/types/vacation";
import { apiClient } from './client'

export const vacationsApi = {
    getVacations: (page = 1, pageSize = 20): Promise<PaginatedVacations> => {
        return apiClient.get<PaginatedVacations>(`/vacations/all?page=${page}&page_size=${pageSize}`);
    },

    getMyVacation: (): Promise<Vacation> => {
        return apiClient.get<Vacation>('/vacations/my');
    },

    createVacation: (data: CreateVacationRequest): Promise<number> => {
        return apiClient.post<number>('/vacations/employee/create', data);
    },

    updateVacation: (vacation_id: number, data: UpdateVacationRequest): Promise<Vacation> => {
        return apiClient.put<Vacation>(`/vacations/${vacation_id}/status`, data);
    },

    deleteVacation: (vacation_id: number): Promise<void> => {
        return apiClient.delete<void>(`/vacations/${vacation_id}`);
    },
}
