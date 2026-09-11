export type LmsStepType = 'info' | 'video' | 'quiz' | 'code' | 'file'

export type LmsCourseCreate = {
  title: string
  info?: string | null
  badge_url?: string | null
  image_url?: string | null
  main_source_url?: string | null
}

export type LmsCourse = {
  id: number
  title: string
  info: string | null
  users_count: number | null
  max_points: number | null
  max_attempts: number | null
  passing_percentage: number | null
  badge_url: string | null
  image_url: string | null
  main_source_url: string | null
}

export type LmsOptionCreate = {
  text: string
  is_correct?: boolean
  correct_order?: number | null
}

export type LmsQuestionCreate = {
  question_text: string
  type: string
  points?: number
  payload_type?: string | null
  options?: LmsOptionCreate[]
}

export type LmsStepCreate = {
  title: string
  points: number
  position: number
  type: LmsStepType
  content?: string | null
  video_url?: string | null
  code_template?: string | null
  questions?: LmsQuestionCreate[]
}

export type LmsChapterCreate = {
  title: string
  position: number
  audio_url?: string | null
  steps?: LmsStepCreate[]
}

export type LmsModuleCreate = {
  title: string
  position: number
  chapters?: LmsChapterCreate[]
}

export type LmsOption = {
  id: number
  payload_id?: number
  text: string
  correct_order: number | null
}

export type LmsPayload = {
  id: number
  question_id?: number
  type: string
  options: LmsOption[]
}

export type LmsQuestion = {
  id: number
  step_data_id?: number
  question_text: string
  type: string
  points: number
  payloads: LmsPayload[]
}

export type LmsStep = {
  id: number
  chapter_id: number
  title: string
  points: number
  position: number
  type: LmsStepType | string
  content?: string | null
  video_url?: string | null
  code_template?: string | null
  questions?: LmsQuestion[]
}

export type LmsChapter = {
  id: number
  module_id: number
  title: string
  max_points: number | null
  position: number
  audio_url: string | null
  steps: LmsStep[]
}

export type LmsModule = {
  id: number
  title: string
  max_points: number | null
  position: number
  chapters: LmsChapter[]
}

export type LmsFullCourse = LmsCourse & {
  modules: LmsModule[]
}

export type LmsLeaderboardEntry = {
  entity_id: number
  name: string | null
  points: number
  rank: number
}

export type LmsLeaderboardType = 'user' | 'department'
