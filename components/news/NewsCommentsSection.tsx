'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { useNewsComments } from '@/hooks/use-news'
import type { NewsComment } from '@/types/news'
import Loading from '@/components/ui/loading'
import { CommentItem } from './CommentItem'

export interface NewsCommentsSectionProps {
  newsId: number
  commentText: string
  isSubmitting: boolean
  onCommentTextChange: (value: string) => void
  onSubmitComment: () => void
}

export const NewsCommentsSection = ({
  newsId,
  commentText,
  isSubmitting,
  onCommentTextChange,
  onSubmitComment,
}: NewsCommentsSectionProps) => {
  const { data: comments, isLoading: isCommentsLoading } = useNewsComments(newsId)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-app-text">Комментарии</h2>

      <div className="flex gap-3">
        <Textarea
          className="min-h-20 text-sm resize-none"
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
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
      ) : comments && comments.length > 0 ? (
        <CommentsList comments={comments} newsId={newsId} />
      ) : (
        <p className="text-sm text-[#9CA3AF] text-center py-6">Нет комментариев. Будьте первым!</p>
      )}
    </div>
  )
}

const CommentsList = ({ comments, newsId }: { comments: NewsComment[]; newsId: number }) => (
  <div className="divide-y divide-gray-100">
    {comments.map((comment) => (
      <CommentItem key={comment.id} comment={comment} newsId={newsId} depth={0} />
    ))}
  </div>
)
