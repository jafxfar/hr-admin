export type RequestType = 'leave' | 'equipment' | 'vacation' | 'document' | 'other'

export type RequestStatus = 'new' | 'approved' | 'rejected' | 'completed'

import { Paginated } from "./pagination";

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
    leave: 'Отгул',
    equipment: 'Оборудование/расходники',
    vacation: 'Отпуск',
    document: 'Справка/документ',
    other: 'Другое',
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    new: 'Новая',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    completed: 'Выполнено',
}

export interface Request {
    id: number
    user_id: number
    type: RequestType
    title: string
    body?: string
    status: RequestStatus
    created_at: string
}

export interface CreateRequestDTO {
    type: RequestType
    title: string
    body?: string
}

export interface UpdateRequestStatusDTO {
    status: RequestStatus
}

export type PaginatedRequests = Paginated<Request>;
