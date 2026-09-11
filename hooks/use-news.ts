import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { newsApi } from '@/api/news'
import type { CreateCommentRequest, CreateNewsRequest, ReactionType } from '@/types/news'

export const NEWS_QUERY_KEY = ['news']

export function useNews(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...NEWS_QUERY_KEY, page, pageSize],
        queryFn: () => newsApi.getAllNews(page, pageSize),
    })
}

export function useCreateNewsMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateNewsRequest) => newsApi.createNews(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}

export function useUpdateNewsMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ news_id, data }: { news_id: number; data: CreateNewsRequest }) =>
            newsApi.updateNews(news_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}

export function useDeleteNewsMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (news_id: number) => newsApi.deleteNews(news_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}

export function useSetReactionMutation(news_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (reaction: ReactionType) => newsApi.setReaction(news_id, reaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}

export function useRemoveReactionMutation(news_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: () => newsApi.removeReaction(news_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}

export function useNewsComments(news_id: number) {
    return useQuery({
        queryKey: [...NEWS_QUERY_KEY, news_id, 'comments'],
        queryFn: () => newsApi.getComments(news_id),
    })
}

export function useCreateCommentMutation(news_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateCommentRequest) => newsApi.createComment(news_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEY, news_id, 'comments'] })
            queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY })
        },
    })
}
