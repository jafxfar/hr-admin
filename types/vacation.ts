export enum VacationType {
    ANNUAL = 'annual',
    SICK = 'sick',
    UNPAID = 'unpaid',
    OTHER = 'other',
}

import { Paginated } from "./pagination";

export enum VacationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCALLED = 'cancelled',
}


export interface Vacation {
    id: number
    comment: string
    user_id: number
    ended_at: string
    started_at: string
    type: VacationType
    status: VacationStatus
    created_at?: string
    updated_at?: string
    manager_comment?: string | null
}

export interface CreateVacationRequest {
    comment: string
    ended_at: string
    started_at: string
    type: VacationType
}

export interface UpdateVacationRequest {
    status: VacationStatus
    manager_comment?: string | null
}

export type PaginatedVacations = Paginated<Vacation>;