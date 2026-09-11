import type { CreateEducationRequest, Education } from "@/types/education";
import { apiClient } from './client'

export const educationApi = {

    getEducationById: (user_id: number): Promise<Education[]> => {
        return apiClient.get<Education[]>(`/educations/by-user/${user_id}`);
    },

    createEducation: (data: CreateEducationRequest): Promise<number> => {
        return apiClient.post<number>('/educations/create', data);
    },

    updateEducation: (education_id: number, data: CreateEducationRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/educations/${education_id}`, data);
    },

    deleteEducation: (education_id: number): Promise<void> => {
        return apiClient.delete<void>(`/educations/${education_id}`);
    },
}
