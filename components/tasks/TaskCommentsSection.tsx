'use client'

import { useState } from 'react'
import { Pencil, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Loading from '@/components/ui/loading'
import {
  formatTaskDateTime,
  getTaskUserName,
} from '@/lib/tasks/utils'
import type { TaskComment } from '@/types/tasks'

type TaskCommentsSectionProps = {
  comments: TaskComment[]
  isLoading: boolean
  isSubmitting: boolean
  currentUserId?: number
  isSuperadmin?: boolean
  onCreate: (body: string, isImportant: boolean) => void
  onUpdate: (commentId: number, body: string, isImportant: boolean) => void
  onDelete: (commentId: number) => void
}

export const TaskCommentsSection = ({
  comments,
  isLoading,
  isSubmitting,
  currentUserId,
  isSuperadmin = false,
  onCreate,
  onUpdate,
  onDelete,
}: TaskCommentsSectionProps) => {
  const [commentText, setCommentText] = useState('')
  const [isImportant, setIsImportant] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editImportant, setEditImportant] = useState(false)

  const handleSubmit = () => {
    const trimmed = commentText.trim()
    if (!trimmed || isSubmitting) return
    onCreate(trimmed, isImportant)
    setCommentText('')
    setIsImportant(false)
  }

  const handleStartEdit = (comment: TaskComment) => {
    setEditingId(comment.id)
    setEditText(comment.body)
    setEditImportant(comment.is_important)
  }

  const handleSaveEdit = () => {
    if (editingId == null) return
    const trimmed = editText.trim()
    if (!trimmed) return
    onUpdate(editingId, trimmed, editImportant)
    setEditingId(null)
  }

  const canModify = (comment: TaskComment) =>
    isSuperadmin || (currentUserId != null && comment.author_user_id === currentUserId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold text-app-text">Комментарии</h3>
        <span className="rounded-full bg-app-surface-1 px-2.5 py-0.5 text-xs font-bold text-app-text-muted">
          {comments.length}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl border border-app-border-accent bg-app-surface-1 p-4">
        <Textarea
          className="min-h-20 resize-none text-sm"
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-app-text-muted">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="rounded border-app-border-accent"
            />
            Важный комментарий
          </label>
          <Button
            className="gap-2 rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim()}
          >
            <Send className="h-4 w-4" />
            Отправить
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : comments.length > 0 ? (
        <div className="divide-y divide-app-border-accent rounded-2xl border border-app-border-accent">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-app-text">
                    {getTaskUserName(comment.author_user)}
                  </p>
                  <p className="text-xs text-app-text-muted">
                    {formatTaskDateTime(comment.created_at)}
                    {comment.is_important ? (
                      <span className="ml-2 font-bold text-amber-400">Важно</span>
                    ) : null}
                  </p>
                </div>
                {canModify(comment) ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Редактировать комментарий"
                      onClick={() => handleStartEdit(comment)}
                      className="rounded-full p-2 text-app-text-muted hover:bg-app-surface-1 hover:text-app-text"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Удалить комментарий"
                      onClick={() => onDelete(comment.id)}
                      className="rounded-full p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-20 resize-none text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-app-text-muted">
                    <input
                      type="checkbox"
                      checked={editImportant}
                      onChange={(e) => setEditImportant(e.target.checked)}
                    />
                    Важный
                  </label>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editText.trim()}>
                      Сохранить
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-app-text-muted">
                  {comment.body}
                </p>
              )}

              {comment.mentioned_users.length > 0 ? (
                <p className="text-xs text-app-text-muted">
                  Упомянуты: {comment.mentioned_users.map((u) => getTaskUserName(u)).join(', ')}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-app-text-muted">Комментариев пока нет</p>
      )}
    </div>
  )
}
