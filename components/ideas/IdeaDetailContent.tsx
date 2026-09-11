'use client'

import Image from 'next/image'

import { authorName, formatRelativeDate, initials } from '@/lib/ideas/utils'
import { Idea, IdeaStatus } from '@/types/idea'

const STATUS_LABELS: Record<IdeaStatus, string> = {
  [IdeaStatus.IN_TALK]: 'Идёт обсуждение',
  [IdeaStatus.ACCEPTED]: 'Принята',
  [IdeaStatus.REJECTED]: 'Отклонена',
  [IdeaStatus.CANCELED]: 'Отменена',
}

const STATUS_COLORS: Record<IdeaStatus, string> = {
  [IdeaStatus.IN_TALK]: 'var(--secondary)',
  [IdeaStatus.ACCEPTED]: 'var(--brand-accent)',
  [IdeaStatus.REJECTED]: '#ffb4ab',
  [IdeaStatus.CANCELED]: 'var(--app-text-muted)',
}

export interface IdeaDetailContentProps {
  idea: Idea
  coverUrl: string | null
}

export const IdeaDetailContent = ({ idea, coverUrl }: IdeaDetailContentProps) => {
  const statusLabel = STATUS_LABELS[idea.status] ?? STATUS_LABELS[IdeaStatus.CANCELED]
  const statusColor = STATUS_COLORS[idea.status] ?? STATUS_COLORS[IdeaStatus.CANCELED]
  const name = authorName(idea.author_first_name, idea.author_last_name)

  return (
    <div className="space-y-6">
      {coverUrl && (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-app-surface-1 border border-app-border">
          <Image
            src={coverUrl}
            alt={idea.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ color: statusColor, backgroundColor: 'var(--app-surface-1)' }}
          >
            {statusLabel}
          </span>
          <span className="text-sm text-app-text-muted">
            {formatRelativeDate(idea.created_at)}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-on-surface leading-tight">
          {idea.title}
        </h1>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-app-surface-1 flex items-center justify-center text-xs font-bold text-app-text-muted shrink-0">
            {initials(idea.author_first_name, idea.author_last_name)}
          </div>
          <span className="text-sm font-medium text-app-text-muted">{name}</span>
        </div>

        <p className="text-app-text-muted leading-relaxed whitespace-pre-wrap">{idea.body}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-app-border-accent">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-bold tracking-wider text-app-text-muted mb-1">
              За
            </p>
            <p className="text-xl font-extrabold text-brand-accent">{idea.likes_count}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-bold tracking-wider text-app-text-muted mb-1">
              Против
            </p>
            <p className="text-xl font-extrabold text-[#ffb4ab]">{idea.dislikes_count}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-bold tracking-wider text-app-text-muted mb-1">
              Комментарии
            </p>
            <p className="text-xl font-extrabold text-on-surface">{idea.comments_count}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-bold tracking-wider text-app-text-muted mb-1">
              Статус
            </p>
            <p className="text-sm font-bold" style={{ color: statusColor }}>
              {statusLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
