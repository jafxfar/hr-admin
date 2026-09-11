import {
  VACANCY_APPLICATION_STATUS_LABELS,
  type VacancyApplicationStatusCode,
} from '@/types/vacancyApplications'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'

const STATUS_STYLES: Record<VacancyApplicationStatusCode, string> = {
  new: 'bg-yellow-500/10 text-yellow-400',
  in_review: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-violet-500/10 text-violet-400',
  accepted: 'bg-brand-accent/10 text-brand-accent',
  rejected: 'bg-red-500/10 text-red-400',
}

const STATUS_DOT: Record<VacancyApplicationStatusCode, string> = {
  new: 'bg-yellow-400',
  in_review: 'bg-blue-400',
  contacted: 'bg-violet-400',
  accepted: 'bg-brand-accent',
  rejected: 'bg-red-400',
}

const DEFAULT_STYLE = 'bg-app-surface-2 text-app-text-muted'
const DEFAULT_DOT = 'bg-app-text-muted'

const STATUS_CODE_RE = /^[a-z][a-z0-9_]{0,63}$/

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

export const isValidStatusCode = (code: string): boolean => {
  return STATUS_CODE_RE.test(code.trim())
}

export const normalizeStatusCode = (title: string): string => {
  const lower = title.trim().toLowerCase()
  let slug = ''

  for (const char of lower) {
    if (CYRILLIC_TO_LATIN[char] !== undefined) {
      slug += CYRILLIC_TO_LATIN[char]
      continue
    }
    if (/[a-z0-9]/.test(char)) {
      slug += char
      continue
    }
    if (slug.length > 0 && slug[slug.length - 1] !== '_') {
      slug += '_'
    }
  }

  slug = slug.replace(/_+/g, '_').replace(/^_|_$/g, '')

  if (!slug || !/^[a-z]/.test(slug)) {
    slug = `status_${slug || 'new'}`.replace(/^status_status/, 'status')
  }

  if (!/^[a-z]/.test(slug)) {
    slug = `s_${slug}`
  }

  return slug.slice(0, 64)
}

export const getStatusLabel = (
  code: string,
  statuses?: VacancyApplicationStatusItem[]
): string => {
  const fromApi = statuses?.find((s) => s.code === code)?.title
  if (fromApi) return fromApi
  const known = VACANCY_APPLICATION_STATUS_LABELS[code as VacancyApplicationStatusCode]
  return known ?? code
}

export const getStatusBadgeClass = (code: string): string => {
  return STATUS_STYLES[code as VacancyApplicationStatusCode] ?? DEFAULT_STYLE
}

export const getStatusDotClass = (code: string): string => {
  return STATUS_DOT[code as VacancyApplicationStatusCode] ?? DEFAULT_DOT
}

/** Шаг порядка колонок на доске (сервер: 10, 20, 30, …). */
export const STATUS_COLUMN_SORT_STEP = 10

export const normalizeColumnSortOrder = (raw: number): number => {
  if (!Number.isFinite(raw) || raw < 1) return STATUS_COLUMN_SORT_STEP
  if (raw < STATUS_COLUMN_SORT_STEP) {
    return Math.floor(raw) * STATUS_COLUMN_SORT_STEP
  }
  if (raw % STATUS_COLUMN_SORT_STEP === 0) return Math.floor(raw)
  return Math.round(raw / STATUS_COLUMN_SORT_STEP) * STATUS_COLUMN_SORT_STEP
}

export const parseColumnSortOrderInput = (raw: string): number | undefined => {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) return undefined
  return normalizeColumnSortOrder(parsed)
}

export const getNextColumnSortOrder = (
  statuses: VacancyApplicationStatusItem[]
): number => {
  if (!statuses.length) return STATUS_COLUMN_SORT_STEP
  const max = Math.max(...statuses.map((s) => s.column_sort_order), 0)
  return max + STATUS_COLUMN_SORT_STEP
}

export const getColumnSortPosition = (order: number): number =>
  Math.max(1, Math.round(order / STATUS_COLUMN_SORT_STEP))
