import type { IdeaComment } from '@/types/idea'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8000'

export function getPhotoUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path.replace(/^\//, '')}`
}

export function authorName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  return [firstName, lastName].filter(Boolean).join(' ') || 'Сотрудник'
}

export function initials(firstName?: string | null, lastName?: string | null): string {
  return ((firstName?.[0] ?? '') + (lastName?.[0] ?? '')).toUpperCase() || '?'
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'только что'
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function normalizeComments(input: unknown): IdeaComment[] {
  if (Array.isArray(input)) return input as IdeaComment[]

  if (input && typeof input === 'object') {
    const maybe = input as Record<string, unknown>
    const candidates = [maybe.items, maybe.results, maybe.data, maybe.comments]
    const found = candidates.find(Array.isArray)
    if (found && Array.isArray(found)) return found as IdeaComment[]
  }

  return []
}
