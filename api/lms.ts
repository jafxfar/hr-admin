import { apiClient } from './client'
import {
  normalizeLmsCourses,
  normalizeLmsFullCourse,
  normalizeLmsLeaderboard,
  normalizeLmsList,
} from '@/lib/lms-normalize'
import type {
  LmsChapterCreate,
  LmsCourse,
  LmsCourseCreate,
  LmsFullCourse,
  LmsLeaderboardEntry,
  LmsLeaderboardType,
  LmsModuleCreate,
  LmsStepCreate,
} from '@/types/lms'

export const LMS_COURSES_QUERY_KEY = ['lms', 'courses'] as const
export const LMS_LEADERBOARD_QUERY_KEY = ['lms', 'leaderboards'] as const

export const lmsApi = {
  getAllCourses: async (): Promise<LmsCourse[]> => {
    const raw = await apiClient.get<unknown>('/courses/all')
    return normalizeLmsCourses(raw)
  },

  getMyCourses: async (): Promise<LmsCourse[]> => {
    const raw = await apiClient.get<unknown>('/courses/my')
    return normalizeLmsCourses(raw)
  },

  getCourse: (courseId: number) => apiClient.get<LmsCourse>(`/courses/${courseId}`),

  getFullCourse: async (courseId: number): Promise<LmsFullCourse> => {
    const raw = await apiClient.get<unknown>(`/courses/${courseId}/full`)
    return normalizeLmsFullCourse(raw) ?? {
      id: courseId,
      title: '',
      info: null,
      users_count: null,
      max_points: null,
      max_attempts: null,
      passing_percentage: null,
      badge_url: null,
      image_url: null,
      main_source_url: null,
      modules: [],
    }
  },

  createCourse: (data: LmsCourseCreate) =>
    apiClient.post<number>('/courses/create', data),

  createModules: (courseId: number, modules: LmsModuleCreate[]) =>
    apiClient.post<number[]>(`/courses/${courseId}/modules`, modules),

  registerMe: (courseId: number) =>
    apiClient.post<number>(`/courses/${courseId}/register`),

  registerEmployee: (courseId: number, employeeId: number) =>
    apiClient.post<number>(`/courses/${courseId}/employees/${employeeId}/register`),

  createChapter: (moduleId: number, chapter: LmsChapterCreate) =>
    apiClient.post<number>(`/modules/${moduleId}/chapters`, chapter),

  createStep: (chapterId: number, step: LmsStepCreate) =>
    apiClient.post<number>(`/chapters/${chapterId}/steps`, step),

  getLeaderboardTop: async (lbType: LmsLeaderboardType, limit = 10): Promise<LmsLeaderboardEntry[]> => {
    const raw = await apiClient.get<unknown>(`/leaderboards/top/${lbType}`, { limit })
    return normalizeLmsLeaderboard(raw)
  },
}

export { normalizeLmsList }
