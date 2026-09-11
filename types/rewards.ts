import { Paginated } from "./pagination";

export interface Reward {
    id: number
    title: string
    description: string
    image_url?: string
    icon_name?: string
    user_id?: number
}

export type PaginatedRewards = Paginated<Reward>;

export interface CreateRewardRequest {
    title: string
    description: string
    image_base64?: string
    icon_name?: string
}

export interface UpdateRewardRequest {
    title?: string
    description?: string
    image_base64?: string
    icon_name?: string
}
