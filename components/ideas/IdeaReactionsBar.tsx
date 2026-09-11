'use client'

import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'

import type { Idea, ReactionType } from '@/types/idea'

export interface IdeaReactionsBarProps {
  idea: Idea
  isReacting: boolean
  isRemoving: boolean
  onReaction: (reaction: ReactionType) => void
}

export const IdeaReactionsBar = ({
  idea,
  isReacting,
  isRemoving,
  onReaction,
}: IdeaReactionsBarProps) => (
  <div className="flex items-center gap-4 border-t border-b border-app-border-accent py-3">
    <button
      type="button"
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        idea.my_reaction === 'like'
          ? 'bg-brand-accent/10 text-brand-accent font-medium'
          : 'text-app-text-muted hover:bg-app-surface-1'
      }`}
      onClick={() => onReaction('like')}
      disabled={isReacting || isRemoving}
      aria-label="Нравится"
    >
      <ThumbsUp className="w-4 h-4" />
      <span>{idea.likes_count ?? 0}</span>
    </button>
    <button
      type="button"
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        idea.my_reaction === 'dislike'
          ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] font-medium'
          : 'text-app-text-muted hover:bg-app-surface-1'
      }`}
      onClick={() => onReaction('dislike')}
      disabled={isReacting || isRemoving}
      aria-label="Не нравится"
    >
      <ThumbsDown className="w-4 h-4" />
      <span>{idea.dislikes_count ?? 0}</span>
    </button>
    <div className="flex items-center gap-1.5 text-sm text-app-text-muted ml-auto">
      <MessageSquare className="w-4 h-4" />
      <span>{idea.comments_count ?? 0} комментариев</span>
    </div>
  </div>
)
