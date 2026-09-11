import { Paginated } from './pagination'

export type VacancyApplicationStatusCode = 'new' | 'in_review' | 'contacted' | 'accepted' | 'rejected'

/** @deprecated use string status codes from API */
export type VacancyApplicationStatus = VacancyApplicationStatusCode
export type VacancyApplicationSourceType = 'self_applied' | 'added_by_staff'

export const VACANCY_APPLICATION_STATUS_LABELS: Record<VacancyApplicationStatusCode, string> = {
  new: 'Не проверено',
  in_review: 'На рассмотрении',
  contacted: 'Связались',
  accepted: 'Принято',
  rejected: 'Отказано',
}

export interface ResumeEducationItem {
  education_type?: string | null
  start_year?: string | null
  end_year?: string | null
  institution?: string | null
  specialty?: string | null
  city?: string | null
}

export interface ResumeWorkExperienceItem {
  position?: string | null
  employer?: string | null
  city?: string | null
  start_year?: string | null
  end_year?: string | null
  leave_reason?: string | null
  is_current?: boolean
  description?: string | null
}

export interface ResumeCourseItem {
  title?: string | null
}

export interface VacancyApplicationResumeData {
  educations?: ResumeEducationItem[]
  pc_skills?: string[]
  other_skills?: string[]
  languages?: string[]
  driver_license_category?: string | null
  car_model?: string | null
  courses?: ResumeCourseItem[]
  work_experiences?: ResumeWorkExperienceItem[]
  about?: string | null
  criminal_record?: string | null
  hobbies?: string | null
  probation_agreed?: string | null
  salary_expectation?: string | null
  recommendations?: string[]
}

export interface VacancyApplication {
  id: number
  vacancy_id: number
  vacancy_title?: string | null
  first_name: string
  last_name: string
  middle_name?: string | null
  email: string
  phone?: string | null
  telegram?: string | null
  city?: string | null
  birth_date?: string | null
  gender?: string | null
  address?: string | null
  marital_status?: string | null
  children_count?: number | null
  has_military_id?: boolean | null
  inn?: string | null
  cover_letter?: string | null
  resume_data?: VacancyApplicationResumeData | null
  source_type?: VacancyApplicationSourceType
  source_user_id?: number | null
  source_user_email?: string | null
  resume_url?: string | null
  photo_url?: string | null
  has_resume?: boolean
  has_photo?: boolean
  status: string
  board_sort_order?: number
  hr_comment?: string | null
  reviewed_by_user_id?: number | null
  reviewed_by_email?: string | null
  created_at?: string | null
  updated_at?: string | null
  reviewed_at?: string | null
}

export interface CreateVacancyApplicationDTO {
  first_name: string
  last_name: string
  middle_name?: string | null
  email: string
  phone?: string | null
  telegram?: string | null
  city?: string | null
  birth_date?: string | null
  gender?: string | null
  address?: string | null
  marital_status?: string | null
  children_count?: number | null
  has_military_id?: boolean | null
  inn?: string | null
  cover_letter?: string | null
  resume_data?: VacancyApplicationResumeData | null
  resume_base64?: string | null
  resume_filename?: string | null
  photo_base64?: string | null
  photo_filename?: string | null
  status_code?: string
}

export interface CreateVacancyApplicationResponse {
  id: number
  message: string
}

export interface UpdateVacancyApplicationDTO {
  status?: string
  hr_comment?: string
}

export type PaginatedVacancyApplications = Paginated<VacancyApplication>
