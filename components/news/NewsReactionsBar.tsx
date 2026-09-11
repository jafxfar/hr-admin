'use client'

import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { News, ReactionType } from '@/types/news'

export interface NewsReactionsBarProps {
  newsItem: News
  isReacting: boolean
  isRemoving: boolean
  onReaction: (reaction: ReactionType) => void
}

export const NewsReactionsBar = ({
  newsItem,
  isReacting,
  isRemoving,
  onReaction,
}: NewsReactionsBarProps) => (
  <div className="flex items-center gap-4 border-t border-b border-gray-100 py-3">
    <button
      type="button"
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        newsItem.my_reaction === 'like'
          ? 'bg-blue-100 text-blue-700 font-medium'
          : 'text-[#6B7280] hover:bg-gray-100'
      }`}
      onClick={() => onReaction('like')}
      disabled={isReacting || isRemoving}
    >
      <ThumbsUp className="w-4 h-4" />
      <span>{newsItem.likes_count ?? 0}</span>
    </button>
    <button
      type="button"
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        newsItem.my_reaction === 'dislike'
          ? 'bg-red-100 text-red-700 font-medium'
          : 'text-[#6B7280] hover:bg-gray-100'
      }`}
      onClick={() => onReaction('dislike')}
      disabled={isReacting || isRemoving}
    >
      <ThumbsDown className="w-4 h-4" />
      <span>{newsItem.dislikes_count ?? 0}</span>
    </button>
    <div className="flex items-center gap-1.5 text-sm text-[#6B7280] ml-auto">
      <MessageSquare className="w-4 h-4" />
      <span>{newsItem.comments_count ?? 0} комментариев</span>
    </div>
  </div>
)
