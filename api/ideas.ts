import type {
    CreateCommentRequest,
    CreateIdeaRequest,
    Idea,
    IdeaComment,
    PaginatedIdeas,
    ReactionType,
    UpdateIdeaRequest,
} from '@/types/idea'
import { apiClient } from './client'

export const ideasApi = {
    getAllIdeas: (page = 1, pageSize = 20): Promise<PaginatedIdeas> => {
        return apiClient.get<PaginatedIdeas>(`/ideas/all?page=${page}&page_size=${pageSize}`)
    },

    getIdeaById: (idea_id: number): Promise<Idea> => {
        return apiClient.get<Idea>(`/ideas/${idea_id}`)
    },

    createIdea: (data: CreateIdeaRequest): Promise<number> => {
        return apiClient.post<number>('/ideas/create', data)
    },

    updateIdea: (idea_id: number, data: UpdateIdeaRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/ideas/${idea_id}`, data)
    },

    deleteIdea: (idea_id: number): Promise<void> => {
        return apiClient.delete<void>(`/ideas/${idea_id}`)
    },

    getTrendingIdea: (): Promise<Idea> => {
        return apiClient.get<Idea>('/ideas/trending')
    },

    setReaction: (idea_id: number, reaction: ReactionType): Promise<void> => {
        return apiClient.post<void>(`/ideas/${idea_id}/reaction`, { reaction })
    },

    removeReaction: (idea_id: number): Promise<void> => {
        return apiClient.delete<void>(`/ideas/${idea_id}/reaction`)
    },

    getComments: (idea_id: number): Promise<IdeaComment[]> => {
        return apiClient.get<IdeaComment[]>(`/ideas/${idea_id}/comments`)
    },

    createComment: (idea_id: number, data: CreateCommentRequest): Promise<IdeaComment> => {
        return apiClient.post<IdeaComment>(`/ideas/${idea_id}/comments`, data)
    },
}
