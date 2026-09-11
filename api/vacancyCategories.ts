import { apiClient } from './client'
import type { CreateVacancyCategoryRequest, UpdateVacancyCategoryRequest, VacancyCategory, PaginatedVacancyCategories } from "@/types/vacancyCategories";

export const vacancyCategoryApi = {

    getVacancyCategoryById: (page = 1, pageSize = 20): Promise<PaginatedVacancyCategories> => {
        return apiClient.get<PaginatedVacancyCategories>(`/vacancy-categories/all?page=${page}&page_size=${pageSize}`);
    },

    createVacancyCategory: (data: CreateVacancyCategoryRequest): Promise<number> => {
        return apiClient.post<number>('/vacancy-categories/create', data);
    },

    updateVacancyCategory: (categoriy_id: number, data: UpdateVacancyCategoryRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/vacancy-categories/${categoriy_id}`, data);
    },

    deleteVacancyCategory: (category_id: number): Promise<void> => {
        return apiClient.delete<void>(`/vacancy-categories/${category_id}`);
    },

}
