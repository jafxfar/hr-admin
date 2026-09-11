/**
 * Компонент карточки идеи — точное соответствие макету index.html
 */

'use client'

import { Idea, IdeaStatus } from '@/types/idea'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface IdeaCardProps {
  idea: Idea
  onDelete?: (id: number) => void
  onChangeStatus?: (id: number, status: IdeaStatus) => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8000'

function buildSrc(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path.replace(/^\//, '')}`
}

// Цвета взяты напрямую из CSS-переменных dark-темы (index.html)
const STATUS_CONFIG: Record<IdeaStatus, { label: string; color: string; thumbBg: string }> = {
  [IdeaStatus.IN_TALK]: {
    label: 'Идёт обсуждение',
    color: 'var(--secondary)',
    thumbBg: 'hover:bg-secondary/10',
  },
  [IdeaStatus.ACCEPTED]: {
    label: 'Принята',
    color: 'var(--brand-accent)',
    thumbBg: 'hover:bg-brand-accent/10',
  },
  [IdeaStatus.REJECTED]: {
    label: 'Отклонена',
    color: '#ffb4ab',
    thumbBg: 'hover:bg-[#ffb4ab]/10',
  },
  [IdeaStatus.CANCELED]: {
    label: 'Отменена',
    color: 'var(--app-text-muted)',
    thumbBg: 'hover:bg-app-text-muted/10',
  },
}

const STATUS_OPTIONS = [
  { value: IdeaStatus.IN_TALK,  label: 'Идёт обсуждение' },
  { value: IdeaStatus.ACCEPTED, label: 'Принять,' },
  { value: IdeaStatus.REJECTED, label: 'Отклонить' },
  { value: IdeaStatus.CANCELED, label: 'Отменена' },
]

function formatRelativeDate(dateStr: string): string {
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

export function IdeaCard({ idea, onDelete, onChangeStatus }: IdeaCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cfg = STATUS_CONFIG[idea.status] ?? STATUS_CONFIG[IdeaStatus.CANCELED]

  const coverSrc = buildSrc(idea.cover_url)
  const authorPhotoSrc = buildSrc(idea.author_photo_url)

  const authorInitials = [idea.author_first_name, idea.author_last_name]
    .filter(Boolean)
    .map((s) => s[0].toUpperCase())
    .join('')

  const authorName = `${idea.author_first_name} ${idea.author_last_name}`.trim()

  const handleDelete = () => {
    onDelete?.(idea.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      {/* Card — горизонтальный макет: изображение слева, текст справа */}
      <div className="bg-app-surface-0 border border-app-border gap-4 p-6 rounded-3xl flex flex-row justify-between hover:-translate-y-1 transition-transform duration-300 group shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
        <Link
          href={`/ideas/${idea.id}`}
          className="w-1/2 h-68 rounded-2xl bg-app-surface-1 shrink-0 overflow-hidden relative cursor-pointer"
          aria-label={`Открыть идею: ${idea.title}`}
        >
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={idea.title}
              fill
              className="object-cover rounded-2xl"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">💡</span>
            </div>
          )}
        </Link>

        {/* Right: content */}
        <div className="flex flex-col w-1/2 gap-3 min-w-0">
          {/* Top row: status tag + date */}
          <div className="flex justify-between items-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-app-surface-1 rounded-full text-xs font-bold focus:outline-none"
                  style={{ color: cfg.color }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {cfg.label}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-52 bg-app-surface-0 border-app-border-accent text-on-surface"
              >
                {STATUS_OPTIONS.filter((o) => o.value !== idea.status).map((option) => {
                  const optCfg = STATUS_CONFIG[option.value]
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      className="cursor-pointer text-[13px] focus:bg-app-surface-1"
                      style={{ color: optCfg.color }}
                      onSelect={() => onChangeStatus?.(idea.id, option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-xs text-app-text-muted font-medium shrink-0 group-hover:hidden">
              {formatRelativeDate(idea.created_at)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteDialog(true)
              }}
              className="hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full hover:bg-[#93000a] hover:text-[#ffdad6] text-app-text-muted transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <Link href={`/ideas/${idea.id}`} className="block group/title">
            <h3 className="text-on-surface font-bold text-[15px] leading-snug line-clamp-2 group-hover/title:text-brand-accent transition-colors">
              {idea.title}
            </h3>
          </Link>

          {/* Body */}
          <p className="text-app-text-muted text-[13px] leading-relaxed line-clamp-3 flex-1">
            {idea.body}
          </p>

          {/* Footer: author + reactions + delete */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-app-border-accent">
            {/* Author */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-app-surface-1 shrink-0 overflow-hidden relative flex items-center justify-center">
                {authorPhotoSrc ? (
                  <Image
                    src={authorPhotoSrc}
                    alt={authorName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs font-black text-app-text-muted">{authorInitials}</span>
                )}
              </div>
              <span className="text-xs font-bold text-app-text-muted truncate">
                {authorName}
              </span>
            </div>

            {/* Reactions + delete */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-app-surface-1 rounded-full transition-colors ${
                  idea.my_reaction === 'like' ? 'bg-brand-accent/10' : cfg.thumbBg
                }`}
              >
                <ThumbsUp
                  className="w-3.5 h-3.5"
                  style={{ color: idea.my_reaction === 'like' ? 'var(--brand-accent)' : cfg.color }}
                />
                {idea.likes_count > 0 && (
                  <span
                    className="text-xs font-black"
                    style={{ color: idea.my_reaction === 'like' ? 'var(--brand-accent)' : cfg.color }}
                  >
                    {idea.likes_count}
                  </span>
                )}
              </button>

              {idea.dislikes_count > 0 && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-app-surface-1 rounded-full transition-colors hover:bg-[#ffb4ab]/10">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#ffb4ab]" />
                  <span className="text-xs font-black text-[#ffb4ab]">{idea.dislikes_count}</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Диалог удаления */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-app-surface-0 border-app-border-accent text-on-surface">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-on-surface">Удалить идею?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              Вы уверены, что хотите удалить идею &quot;{idea.title}&quot;? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-app-surface-1 text-on-surface border-app-border-accent hover:bg-app-surface-2">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#93000a] text-[#ffdad6] hover:bg-[#b00010]"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
