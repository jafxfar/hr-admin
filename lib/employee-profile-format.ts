import type { EmploymentStatus, PublicProfileSchedule } from '@/types/employees'
import { CITY_LABELS } from '@/lib/tajikistan-cities'

export const formatProfileYear = (iso?: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    return String(d.getFullYear())
}

export const formatProfilePeriod = (started?: string | null, ended?: string | null) => {
    const start = formatProfileYear(started)
    const end = ended ? formatProfileYear(ended) : null
    if (!start && !end) return null
    if (start && !end) return `${start} — настоящее время`
    if (!start && end) return `до ${end}`
    return `${start} — ${end}`
}

export const formatProfileDate = (iso?: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const EDUCATION_DEGREE_LABELS: Record<string, string> = {
    bachelor: 'Бакалавриат',
    master: 'Магистратура',
    phd: 'Докторантура',
    other: 'Другое',
}

const formatEducationMonthYear = (iso?: string | null) => {
    if (!iso?.trim()) return null
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    return d
        .toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })
        .replace(/\./g, '')
        .toUpperCase()
}

export const formatEducationDegreeLabel = (degree?: string | null) => {
    if (!degree?.trim()) return null
    const key = degree.trim().toLowerCase()
    return EDUCATION_DEGREE_LABELS[key] ?? degree.trim()
}

export const formatEducationPeriodShort = (started?: string | null, ended?: string | null) => {
    const start = formatEducationMonthYear(started)
    const end = formatEducationMonthYear(ended)
    if (!start && !end) return null
    if (start && !end) return start
    if (!start && end) return end
    return `${start} — ${end}`
}

export const formatWorkExperiencePeriod = (
    started?: string | null,
    ended?: string | null,
    presentLabel = 'Настоящее время',
) => {
    const start = formatProfileDate(started)
    const hasEnd = Boolean(ended?.trim())
    const end = hasEnd ? formatProfileDate(ended) : presentLabel
    if (!start && !hasEnd) return null
    if (!start && end) return end
    if (start && !hasEnd) return `${start} — ${presentLabel}`
    return `${start} — ${end}`
}

const joinCompanyLine = (company?: string | null, description?: string | null) => {
    return [company?.trim(), description?.trim()].filter(Boolean).join(' • ')
}

export const formatWorkExperienceCompanyLine = joinCompanyLine

export const getActiveSchedule = (schedules: PublicProfileSchedule[]): PublicProfileSchedule | null => {
    if (!schedules?.length) return null
    const active = schedules.find((s) => !s.ended_at)
    return active ?? schedules[0]
}

export const formatScheduleSummary = (schedule: PublicProfileSchedule) => {
    const parts: string[] = []
    if (typeof schedule.days_per_week === 'number') parts.push(`${schedule.days_per_week} дн./нед.`)
    if (typeof schedule.hours_per_day === 'number') parts.push(`${schedule.hours_per_day} ч./день`)
    return parts.length ? parts.join(' · ') : null
}

export const formatScheduleHours = (schedule: PublicProfileSchedule): string | null => {
    const details = schedule.details
    if (!details || typeof details !== 'object') return null
    const start = (details as Record<string, unknown>).start_time ?? (details as Record<string, unknown>).start
    const end = (details as Record<string, unknown>).end_time ?? (details as Record<string, unknown>).end
    if (typeof start === 'string' && typeof end === 'string') return `${start} — ${end}`
    return null
}

export const formatCityLabel = (city?: string | null): string | null => {
    if (!city?.trim()) return null
    const key = city.trim().toLowerCase()
    return CITY_LABELS[key] ?? city.trim()
}

export const formatGender = (gender?: string | null): string | null => {
    if (gender === '1' || gender === 'male') return 'Мужской'
    if (gender === '0' || gender === 'female') return 'Женский'
    if (!gender?.trim()) return null
    return gender.trim()
}

export const formatMaritalStatus = (value?: string | null): string | null => {
    if (value === 'true') return 'Женат / замужем'
    if (value === 'false') return 'Холост / не замужем'
    if (!value?.trim()) return null
    return value.trim()
}

export const formatContractType = (type?: string | null): string => {
    const labels: Record<string, string> = {
        full_time: 'Полная занятость',
        part_time: 'Частичная занятость',
        contractor: 'Подрядчик',
    }
    if (!type?.trim()) return '—'
    return labels[type] ?? type
}

export const formatCurrencyAmount = (amount: number, currency?: string | null): string => {
    const cur = currency?.trim() || 'TJS'
    return `${amount.toLocaleString('ru-RU')} ${cur}`
}

export const formatBooleanLabel = (value?: boolean | null, yes = 'Да', no = 'Нет'): string => {
    if (value === true) return yes
    if (value === false) return no
    return '—'
}

export const formatEmploymentStatus = (status?: EmploymentStatus | null): string => {
    if (status === 'terminated') return 'Уволен'
    if (status === 'deleted') return 'Удалён'
    if (status === 'active') return 'Активен'
    return '—'
}

export const formatProfileDateTime = (iso?: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    return d.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

