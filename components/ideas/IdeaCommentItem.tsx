'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CornerDownRight, Send } from 'lucide-react'
import { useCreateIdeaCommentMutation } from '@/hooks/use-ideas'
import type { IdeaComment } from '@/types/idea'

export interface IdeaCommentItemProps {
  comment: IdeaComment
  ideaId: number
  depth?: number
}

export const IdeaCommentItem = ({ comment, ideaId, depth = 0 }: IdeaCommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const { mutate: createComment, isPending } = useCreateIdeaCommentMutation(ideaId)

  const handleReply = () => {
    if (!replyText.trim()) return
    createComment(
      { body: replyText.trim(), parent_id: comment.id },
      {
        onSuccess: () => {
          setReplyText('')
          setShowReplyInput(false)
        },
      },
    )
  }

  const authorDisplayName = `${comment.author.first_name} ${comment.author.last_name}`.trim()
  const authorInitials =
    (comment.author.first_name[0] ?? '') + (comment.author.last_name[0] ?? '')
  const date = new Date(comment.created_at).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-app-border-accent pl-4' : ''}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs bg-app-surface-1 text-app-text-muted">
            {authorInitials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-on-surface">{authorDisplayName}</span>
            <span className="text-xs text-app-text-muted">{date}</span>
          </div>
          <p className="text-sm text-app-text-muted">{comment.body}</p>
          {depth === 0 && (
            <button
              type="button"
              className="mt-1 text-xs text-brand-accent hover:underline flex items-center gap-1"
              onClick={() => setShowReplyInput((v) => !v)}
            >
              <CornerDownRight className="w-3 h-3" />
              Ответить
            </button>
          )}
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <Textarea
                className="min-h-15 text-sm resize-none"
                placeholder="Написать ответ..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleReply}
                  disabled={isPending || !replyText.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 text-xs"
                  onClick={() => {
                    setShowReplyInput(false)
                    setReplyText('')
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <IdeaCommentItem key={reply.id} comment={reply} ideaId={ideaId} depth={depth + 1} />
      ))}
    </div>
  )
}
