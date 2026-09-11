
import { Paginated } from "./pagination";

export enum IdeaStatus {
    IN_TALK = 'in_talk',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
}

export interface Idea {
    id: number
    author_id: number
    body: string
    title: string
    status: IdeaStatus
    created_at: string
    is_active: number
    cover_url: string | null
    author_first_name: string
    author_last_name: string
    author_middle_name: string | null
    author_photo_url: string | null
    comments_count: number
    likes_count: number
    dislikes_count: number
    my_reaction: 'like' | 'dislike' | null
}

export type PaginatedIdeas = Paginated<Idea>;

export interface CreateIdeaRequest {
    body: string
    title: string
}

export interface UpdateIdeaRequest {
    body?: string
    title?: string
    status?: IdeaStatus
}

export type ReactionType = 'like' | 'dislike'

export interface CommentAuthor {
    id: number
    email: string
    first_name: string
    last_name: string
    middle_name: string
}

export interface IdeaComment {
    id: number
    idea_id: number
    user_id: number
    parent_id: number | null
    body: string
    created_at: string
    updated_at: string
    author: CommentAuthor
    replies: IdeaComment[]
}

export interface CreateCommentRequest {
    body: string
    parent_id?: number
}