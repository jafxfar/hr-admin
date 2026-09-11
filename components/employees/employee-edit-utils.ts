import type { Document } from '@/types/documents'

export type FormDocument = Document & {
  _serverId?: number
  _serverPath?: string
  _previewUrl?: string
}

export const normalizeString = (v: unknown) => (typeof v === 'string' ? v.trim() : v)

const stableStringify = (value: unknown): string => {
  const sortRec = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sortRec)
    if (v && typeof v === 'object') {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = sortRec((v as Record<string, unknown>)[key])
          return acc
        }, {})
    }
    return v
  }

  return JSON.stringify(sortRec(value))
}

export const isSame = (a: unknown, b: unknown) => stableStringify(a) === stableStringify(b)

export const normalizeOptionalId = (value: number | null | undefined) => {
  if (value == null) return null
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null
}

export const normalizeEducation = (e: any) => ({
  institution: normalizeString(e.institution ?? ''),
  degree: normalizeString(e.degree ?? ''),
  specialization: normalizeString(e.specialization ?? ''),
  started_at: normalizeString(e.started_at ?? ''),
  ended_at: normalizeString(e.ended_at ?? ''),
})

export const normalizeSchedule = (s: any) => ({
  days_per_week: s.days_per_week ?? null,
  hours_per_day: s.hours_per_day ?? null,
  started_at: normalizeString(s.started_at ?? ''),
  ended_at: normalizeString(s.ended_at ?? ''),
  details: s.details ?? null,
})

export const normalizeSalary = (s: any) => ({
  amount: s.amount ?? null,
  currency: normalizeString(s.currency ?? ''),
  prepaid_percent: s.prepaid_percent ?? null,
  started_at: normalizeString(s.started_at ?? ''),
  ended_at: normalizeString(s.ended_at ?? ''),
})

export const normalizeWorkExperience = (w: any) => ({
  company: normalizeString(w.company ?? ''),
  position: normalizeString(w.position ?? ''),
  description: normalizeString(w.description ?? ''),
  started_at: normalizeString(w.started_at ?? ''),
  ended_at: normalizeString(w.ended_at ?? ''),
})

export const normalizeContract = (c: any) => ({
  type: normalizeString(c.type ?? ''),
  started_at: normalizeString(c.started_at ?? ''),
  ended_at: normalizeString(c.ended_at ?? ''),
  details: c.details ?? null,
})
