'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ThumbsUp, Flame } from 'lucide-react'
import type { Idea } from '@/types/idea'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8000'

function buildSrc(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${API_BASE}/${path.replace(/^\//, '')}`
}

function getInitials(idea: Idea): string {
  return `${idea.author_first_name?.[0] ?? ''}${idea.author_last_name?.[0] ?? ''}`.toUpperCase()
}

function getAuthorName(idea: Idea): string {
  const parts = [idea.author_first_name, idea.author_middle_name, idea.author_last_name].filter(Boolean)
  return parts.join(' ')
}

interface IdeaBannerProps {
  idea: Idea
}

export function IdeaBanner({ idea }: IdeaBannerProps) {
  const coverSrc = buildSrc(idea.cover_url)
  const avatarSrc = buildSrc(idea.author_photo_url)

  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="relative block w-full h-95 rounded-3xl overflow-hidden mb-8 group cursor-pointer"
      aria-label={`Открыть идею: ${idea.title}`}
    >
      {/* Background image or placeholder */}
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt={idea.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-app-surface-1" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-app-surface-0 via-app-surface-0/60 to-transparent" />

      {/* Trending badge — top left */}
      <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-accent text-brand-accent-on text-xs font-bold">
        <Flame className="w-3.5 h-3.5" />
        Trending
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={getAuthorName(idea)}
                width={28}
                height={28}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-app-border-accent flex items-center justify-center text-xs font-bold text-brand-accent shrink-0">
                {getInitials(idea)}
              </div>
            )}
            <span className="text-xs font-medium text-app-text-muted truncate">
              {getAuthorName(idea)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-on-surface leading-tight line-clamp-2 mb-2">
            {idea.title}
          </h2>

          {/* Body */}
          <p className="text-sm text-app-text-muted line-clamp-2 max-w-2xl">
            {idea.body}
          </p>
        </div>

        {/* Like count pill — bottom right */}
        {idea.likes_count > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-app-surface-1/90 backdrop-blur-sm rounded-full shrink-0 border border-app-border-accent">
            <ThumbsUp className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-bold text-brand-accent">{idea.likes_count}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
