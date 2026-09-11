'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import Loading from '@/components/ui/loading'
import { IdeaCommentItem } from './IdeaCommentItem'
import type { IdeaComment } from '@/types/idea'

export interface IdeaCommentsSectionProps {
  ideaId: number
  comments: IdeaComment[]
  visibleComments: IdeaComment[]
  hasMore: boolean
  commentText: string
  isCommentsLoading: boolean
  isSubmitting: boolean
  onCommentTextChange: (value: string) => void
  onSubmitComment: () => void
  onLoadMore: () => void
}

export const IdeaCommentsSection = ({
  ideaId,
  comments,
  visibleComments,
  hasMore,
  commentText,
  isCommentsLoading,
  isSubmitting,
  onCommentTextChange,
  onSubmitComment,
  onLoadMore,
}: IdeaCommentsSectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-semibold text-on-surface">Комментарии</h2>
      <span className="bg-app-surface-1 text-app-text-muted px-2.5 py-0.5 rounded-full text-xs font-bold">
        {comments.length}
      </span>
    </div>

    <div className="flex gap-3">
      <Textarea
        className="min-h-20 text-sm resize-none"
        placeholder="Написать комментарий..."
        value={commentText}
        onChange={(e) => onCommentTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSubmitComment()
        }}
      />
      <Button
        className="self-end h-10 px-4 gap-2"
        onClick={onSubmitComment}
        disabled={isSubmitting || !commentText.trim()}
      >
        <Send className="w-4 h-4" />
        Отправить
      </Button>
    </div>

    {isCommentsLoading ? (
      <Loading />
    ) : visibleComments.length > 0 ? (
      <div className="divide-y divide-app-border-accent">
        {visibleComments.map((comment) => (
          <IdeaCommentItem key={comment.id} comment={comment} ideaId={ideaId} depth={0} />
        ))}
      </div>
    ) : (
      <p className="text-sm text-app-text-muted text-center py-6">
        Нет комментариев. Будьте первым!
      </p>
    )}

    {hasMore && (
      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={onLoadMore}>
          Показать ещё
        </Button>
      </div>
    )}
  </div>
)
