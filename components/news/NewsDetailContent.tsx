'use client'

import { Badge } from '@/components/ui/badge'
import type { News } from '@/types/news'

export interface NewsDetailContentProps {
  newsItem: News
}

export const NewsDetailContent = ({ newsItem }: NewsDetailContentProps) => {
  const publishedDate = newsItem.published_at
    ? new Date(newsItem.published_at).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <>
      {newsItem.cover_url && (
        <img
          src={newsItem.cover_url}
          alt={newsItem.title}
          className="w-full max-h-72 object-cover rounded-xl"
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge
            variant={newsItem.is_published ? 'default' : 'secondary'}
            className={
              newsItem.is_published ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''
            }
          >
            {newsItem.is_published ? 'Опубликовано' : 'Черновик'}
          </Badge>
          {publishedDate && <span className="text-sm text-[#9CA3AF]">{publishedDate}</span>}
        </div>
        <h1 className="text-2xl font-bold text-app-text">{newsItem.title}</h1>
        <p className="text-[#374151] leading-relaxed whitespace-pre-wrap">{newsItem.body}</p>
      </div>
    </>
  )
}
