import type { VacancyCategory } from './vacancyCategories'
import { Paginated } from "./pagination";

export type VacancyType = 'internal' | 'external' | 'internship' | 'temp' | 'other'

export const VACANCY_TYPE_LABELS: Record<VacancyType, string> = {
    internal: 'Внутренняя',
    external: 'Внешняя',
    internship: 'Стажировка',
    temp: 'Временная',
    other: 'Другое',
}

export interface Vacancy {
    id: number
    title: string
    body: string
    type: VacancyType
    category_id: number
    category?: VacancyCategory
    branch_id?: number | null
    branch_name?: string | null
    is_published: boolean
    image_url: string | null
    deadline_at?: string | null
    is_deadline_passed?: boolean
    is_closed?: boolean
    closed_at?: string | null
    created_at: string
    updated_at: string
}

export interface CreateVacancyRequest {
    title: string
    body: string
    type: VacancyType
    category_id: number
    branch_id?: number | null
    is_published: boolean
    image_base64?: string | null
    deadline_at?: string | null
}

export interface UpdateVacancyRequest {
    title?: string
    body?: string
    type?: VacancyType
    category_id?: number
    branch_id?: number | null
    is_published?: boolean
    image_base64?: string | null
    deadline_at?: string | null
}

export type PaginatedVacancies = Paginated<Vacancy>;