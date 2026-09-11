import type { CreateScheduleRequest, Schedule } from "@/types/schedule";
import { apiClient } from './client'

export const scheduleApi = {

    getScheduleById: (user_id: number): Promise<Schedule[]> => {
        return apiClient.get<Schedule[]>(`/schedules/by-user/${user_id}`);
    },

    createSchedule: (data: CreateScheduleRequest): Promise<number> => {
        return apiClient.post<number>('/schedules/create', data);
    },

    updateSchedule: (schedule_id: number, data: Schedule): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/schedules/${schedule_id}`, data);
    },

    deleteSchedule: (schedule_id: number): Promise<void> => {
        return apiClient.delete<void>(`/schedules/${schedule_id}`);
    },
}
