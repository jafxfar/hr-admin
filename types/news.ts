
import { Paginated } from "./pagination";

export interface News {
    id: number
    author_id: number
    title: string
    body: string
    is_published: number
    published_at: string | null
    created_at: string
    cover_url?: string | null
    comments_count?: number
    likes_count?: number
    dislikes_count?: number
    my_reaction?: 'like' | 'dislike' | null
}

export type PaginatedNews = Paginated<News>;

export interface CreateNewsRequest {
    body: string
    title: string
    is_published: boolean
    cover_base64?: string
}

export type ReactionType = 'like' | 'dislike'

export interface CommentAuthor {
    id: number
    email: string
    first_name: string
    last_name: string
    middle_name: string
}

export interface NewsComment {
    id: number
    news_id: number
    user_id: number
    parent_id: number
    body: string
    created_at: string
    updated_at: string
    author: CommentAuthor
    replies: NewsComment[]
}

export interface CreateCommentRequest {
    body: string
    parent_id?: number
}