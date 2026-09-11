import type { CreateRewardRequest, UpdateRewardRequest, Reward, PaginatedRewards } from "@/types/rewards";
import { apiClient } from './client'

export const rewardsApi = {

    getRewards: (page = 1, pageSize = 20): Promise<PaginatedRewards> => {
        return apiClient.get<PaginatedRewards>(`/rewards/all?page=${page}&page_size=${pageSize}`);
    },

    getRewardByUserId: (user_id: number): Promise<Reward[]> => {
        return apiClient.get<Reward[]>(`/rewards/by-user/${user_id}`);
    },

    createReward: (data: CreateRewardRequest): Promise<number> => {
        return apiClient.post<number>('/rewards/create', data);
    },

    assignReward: (reward_id: number, user_ids: number[]): Promise<number> => {
        return apiClient.post<number>(`/rewards/${reward_id}/assign`, { user_ids });
    },

    updateReward: (reward_id: number, data: UpdateRewardRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/rewards/${reward_id}`, data);
    },

    unAssignReward: (reward_id: number, user_id: number): Promise<void> => {
        return apiClient.delete<void>(`/rewards/${reward_id}/assign/${user_id}`);
    },

    deleteReward: (reward_id: number): Promise<void> => {
        return apiClient.delete<void>(`/rewards/${reward_id}`);
    },
}
