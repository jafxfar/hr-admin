import type { CreateNewsRequest, CreateCommentRequest, News, NewsComment, PaginatedNews, ReactionType } from '@/types/news'
import { apiClient } from './client'

export const newsApi = {
    getAllNews: (page = 1, pageSize = 20): Promise<PaginatedNews> => {
        return apiClient.get<PaginatedNews>(`/news/all?page=${page}&page_size=${pageSize}`)
    },

    createNews: (data: CreateNewsRequest): Promise<number> => {
        return apiClient.post<number>('/news/create', data)
    },

    updateNews: (news_id: number, data: CreateNewsRequest): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/news/${news_id}`, data)
    },

    deleteNews: (news_id: number): Promise<void> => {
        return apiClient.delete<void>(`/news/${news_id}`)
    },

    setReaction: (news_id: number, reaction: ReactionType): Promise<void> => {
        return apiClient.post<void>(`/news/${news_id}/reaction`, { reaction })
    },

    removeReaction: (news_id: number): Promise<void> => {
        return apiClient.delete<void>(`/news/${news_id}/reaction`)
    },

    getComments: (news_id: number): Promise<NewsComment[]> => {
        return apiClient.get<NewsComment[]>(`/news/${news_id}/comments`)
    },

    createComment: (news_id: number, data: CreateCommentRequest): Promise<NewsComment> => {
        return apiClient.post<NewsComment>(`/news/${news_id}/comments`, data)
    },
}
