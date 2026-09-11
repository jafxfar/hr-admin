import type { CreateWorkExperienceRequest, WorkExperience } from "@/types/workExperience";
import { apiClient } from './client'

export const workExperienceApi = {

    getWorkExperienceById: (user_id: number): Promise<WorkExperience[]> => {
        return apiClient.get<WorkExperience[]>(`/work-experiences/by-user/${user_id}`);
    },

    createWorkExperience: (data: CreateWorkExperienceRequest): Promise<number> => {
        return apiClient.post<number>('/work-experiences/create', data);
    },

    updateWorkExperience: (work_experience_id: number, data: CreateWorkExperienceRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/work-experiences/${work_experience_id}`, data);
    },

    deleteWorkExperience: (work_experience_id: number): Promise<void> => {
        return apiClient.delete<void>(`/work-experiences/${work_experience_id}`);
    },
}
