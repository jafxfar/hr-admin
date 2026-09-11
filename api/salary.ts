import type { CreateSalaryRequest, Salary } from "@/types/salary";
import { apiClient } from './client'

export const salaryApi = {

    getSalaryById: (user_id: number): Promise<Salary[]> => {
        return apiClient.get<Salary[]>(`/salaries/by-user/${user_id}`);
    },

    createSalary: (data: CreateSalaryRequest): Promise<number> => {
        return apiClient.post<number>('/salaries/create', data);
    },

    updateSalary: (education_id: number, data: Salary): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/salaries/${education_id}`, data);
    },

    deleteSalary: (salary_id: number): Promise<void> => {
        return apiClient.delete<void>(`/salaries/${salary_id}`);
    },
}
