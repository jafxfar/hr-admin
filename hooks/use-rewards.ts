import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rewardsApi } from '@/api/rewards'
import type { CreateRewardRequest, UpdateRewardRequest } from '@/types/rewards'

export const REWARDS_QUERY_KEY = ['rewards']


export function useRewards(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...REWARDS_QUERY_KEY, page, pageSize],
        queryFn: () => rewardsApi.getRewards(page, pageSize),
    })
}

/** @deprecated use useRewards instead */
export function useReward(page = 1, pageSize = 20) {
    return useRewards(page, pageSize)
}

export function useRewardByUser(id: number) {
    return useQuery({
        queryKey: [...REWARDS_QUERY_KEY, id],
        queryFn: () => rewardsApi.getRewardByUserId(id),
        enabled: !!id,
    })
}

export function useCreateRewardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateRewardRequest) => rewardsApi.createReward(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REWARDS_QUERY_KEY })
        },
    })
}

export function useAssignewardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ reward_id, user_ids }: { reward_id: number; user_ids: number[] }) =>
            rewardsApi.assignReward(reward_id, user_ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REWARDS_QUERY_KEY })
        },
    })
}

export function useUnAssignRewardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ reward_id, user_id }: { reward_id: number; user_id: number }) =>
            rewardsApi.unAssignReward(reward_id, user_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REWARDS_QUERY_KEY })
        },
    })
}

export function useUpdateRewardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ rewards_id, data }: { rewards_id: number; data: UpdateRewardRequest }) =>
            rewardsApi.updateReward(rewards_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REWARDS_QUERY_KEY })
        },
    })
}

export function useDeleteRewardMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (reward_id: number) => rewardsApi.deleteReward(reward_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REWARDS_QUERY_KEY })
        },
    })
}
