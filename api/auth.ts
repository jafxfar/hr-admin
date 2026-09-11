import type { LoginRequest, LoginResponse } from "@/types/auth";
import { apiClient } from './client'

export const loginApi = {
    login: (data: LoginRequest): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>(`/auth/login`, data);
    },
    refresh: (refreshToken: string): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>(`/auth/refresh`, { refresh_token: refreshToken });
    },
}