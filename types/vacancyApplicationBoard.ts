import type { VacancyApplication } from './vacancyApplications'

export interface VacancyApplicationStatusItem {
  code: string
  title: string
  column_sort_order: number
  is_active: boolean
  is_default: boolean
  closes_vacancy: boolean
}

export interface VacancyApplicationStatusesResponse {
  items: VacancyApplicationStatusItem[]
}

export interface VacancyApplicationBoardColumn {
  status: VacancyApplicationStatusItem
  applications: VacancyApplication[]
}

export interface VacancyApplicationBoardResponse {
  vacancy_id?: number | null
  columns: VacancyApplicationBoardColumn[]
}

export type VacancyApplicationBoardFilters = {
  vacancyId?: number | null
  q?: string
}

export interface BoardPositionPatch {
  status_code: string
  position: number
}

export interface CreateVacancyApplicationStatusDTO {
  code: string
  title: string
  column_sort_order?: number
  is_active?: boolean
  closes_vacancy?: boolean
}

export interface UpdateVacancyApplicationStatusDTO {
  title?: string
  column_sort_order?: number
  is_active?: boolean
  is_default?: boolean
  closes_vacancy?: boolean
}
