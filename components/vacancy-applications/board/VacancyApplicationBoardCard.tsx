'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Briefcase, Calendar } from 'lucide-react'
import type { VacancyApplication } from '@/types/vacancyApplications'

export const cardDragId = (applicationId: number) => `card-${applicationId}`

export const parseCardDragId = (id: string): number | null => {
  const rawId = id.trim()
  if (/^\d+$/.test(rawId)) {
    const plainNum = Number(rawId)
    return Number.isFinite(plainNum) ? plainNum : null
  }

  if (!rawId.startsWith('card-')) return null
  const num = Number(rawId.slice(5))
  return Number.isFinite(num) ? num : null
}

export const getApplicantFullName = (application: VacancyApplication) =>
  [application.last_name, application.first_name, application.middle_name]
    .filter(Boolean)
    .join(' ')

const formatAddedDate = (iso?: string | null) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

interface VacancyApplicationBoardCardProps {
  application: VacancyApplication
  onOpen: (application: VacancyApplication) => void
}

export const VacancyApplicationBoardCard = ({
  application,
  onOpen,
}: VacancyApplicationBoardCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardDragId(application.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleOpen = () => {
    if (isDragging) return
    onOpen(application)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  const fullName = getApplicantFullName(application) || 'Без имени'
  const vacancyTitle = application.vacancy_title?.trim() || 'Вакансия не указана'

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Открыть отклик: ${fullName}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      {...attributes}
      {...listeners}
      className={`flex min-h-[7rem] touch-none cursor-grab flex-col gap-2.5 rounded-xl border border-app-border bg-app-surface-0 p-4 transition-all active:cursor-grabbing ${
        isDragging
          ? 'opacity-40 shadow-sm ring-1 ring-brand-accent/30'
          : 'hover:border-app-border-accent hover:shadow-sm'
      }`}
    >
      <p className="line-clamp-2 text-base font-semibold leading-snug text-app-text">
        {fullName}
      </p>

      <div className="inline-flex max-w-full items-start gap-1.5 text-sm text-app-text-muted">
        <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="line-clamp-2 min-w-0 leading-snug">{vacancyTitle}</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-app-text-muted">
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{formatAddedDate(application.created_at)}</span>
      </div>
    </div>
  )
}
