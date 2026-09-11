import type { LmsChapter, LmsCourse, LmsFullCourse, LmsLeaderboardEntry, LmsModule } from '@/types/lms'

export const normalizeLmsList = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const items = (raw as { items?: unknown }).items
    if (Array.isArray(items)) return items as T[]
  }
  return []
}

const normalizeChapters = (raw: unknown): LmsChapter[] =>
  normalizeLmsList<LmsChapter>(raw).map((chapter) => ({
    ...chapter,
    steps: normalizeLmsList(chapter.steps),
  }))

const normalizeModules = (raw: unknown): LmsModule[] =>
  normalizeLmsList<LmsModule>(raw).map((module) => ({
    ...module,
    chapters: normalizeChapters(module.chapters),
  }))

export const normalizeLmsFullCourse = (raw: unknown): LmsFullCourse | null => {
  if (!raw || typeof raw !== 'object') return null
  const course = raw as LmsFullCourse
  return {
    ...course,
    modules: normalizeModules(course.modules),
  }
}

export const normalizeLmsCourses = (raw: unknown): LmsCourse[] => normalizeLmsList<LmsCourse>(raw)

export const normalizeLmsLeaderboard = (raw: unknown): LmsLeaderboardEntry[] =>
  normalizeLmsList<LmsLeaderboardEntry>(raw)
