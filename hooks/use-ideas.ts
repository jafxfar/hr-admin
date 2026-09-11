import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ideasApi } from '@/api/ideas'
import type { CreateCommentRequest, CreateIdeaRequest, ReactionType, UpdateIdeaRequest } from '@/types/idea'

export const IDEAS_QUERY_KEY = ['ideas']

export function useIdeas(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...IDEAS_QUERY_KEY, page, pageSize],
        queryFn: () => ideasApi.getAllIdeas(page, pageSize),
    })
}

export function useIdea(idea_id: number) {
    return useQuery({
        queryKey: [...IDEAS_QUERY_KEY, idea_id],
        queryFn: () => ideasApi.getIdeaById(idea_id),
        enabled: !!idea_id,
    })
}

export function useCreateIdeaMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateIdeaRequest) => ideasApi.createIdea(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useUpdateIdeaMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ idea_id, data }: { idea_id: number; data: UpdateIdeaRequest }) =>
            ideasApi.updateIdea(idea_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useDeleteIdeaMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (idea_id: number) => ideasApi.deleteIdea(idea_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useTrendingIdea() {
    return useQuery({
        queryKey: [...IDEAS_QUERY_KEY, 'trending'],
        queryFn: () => ideasApi.getTrendingIdea(),
        staleTime: 5 * 60 * 1000,
    })
}

export function useIdeaComments(idea_id: number) {
    return useQuery({
        queryKey: [...IDEAS_QUERY_KEY, idea_id, 'comments'],
        queryFn: () => ideasApi.getComments(idea_id),
        enabled: !!idea_id,
    })
}

export function useSetIdeaReactionMutation(idea_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: (reaction: ReactionType) => ideasApi.setReaction(idea_id, reaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useRemoveIdeaReactionMutation(idea_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: () => ideasApi.removeReaction(idea_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}

export function useCreateIdeaCommentMutation(idea_id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateCommentRequest) => ideasApi.createComment(idea_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...IDEAS_QUERY_KEY, idea_id, 'comments'] })
            queryClient.invalidateQueries({ queryKey: IDEAS_QUERY_KEY })
        },
    })
}
