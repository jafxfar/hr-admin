import { apiClient } from './client'
import type { CreateVacancyRequest, UpdateVacancyRequest, Vacancy, PaginatedVacancies } from "@/types/vacancies";

export const vacancyApi = {

    getVacancies: (page = 1, pageSize = 20, q?: string): Promise<PaginatedVacancies> => {
        const params: Record<string, string | number> = {
            page,
            page_size: pageSize,
        }
        const search = q?.trim()
        if (search) params.q = search

        return apiClient.get<PaginatedVacancies>('/vacancies/all', params);
    },

    getVacancies4Admin: (page = 1, pageSize = 20, q?: string): Promise<PaginatedVacancies> => {
        return apiClient.get<PaginatedVacancies>(`/vacancies/admin?page=${page}&page_size=${pageSize}&q=${q}`);
    },

    createVacancy: (data: CreateVacancyRequest): Promise<number> => {
        return apiClient.post<number>('/vacancies/create', data);
    },

    updateVacancy: (vacancy_id: number, data: UpdateVacancyRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/vacancies/${vacancy_id}`, data);
    },

    deleteVacancy: (vacancy_id: number): Promise<void> => {
        return apiClient.delete<void>(`/vacancies/${vacancy_id}`);
    },

}
