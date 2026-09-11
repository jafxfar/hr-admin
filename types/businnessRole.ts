
import { Paginated } from "./pagination";

export interface BusinessRole {
    id: number
    name: string
    description: string
    created_at?: string
    is_active: boolean
}

export type PaginatedBusinessRoles = Paginated<BusinessRole>;

export interface CreateBusinessRoleRequest {
    name: string
    description: string
}

export interface UpdateBusinessRoleRequest {
    name?: string
    description?: string
}