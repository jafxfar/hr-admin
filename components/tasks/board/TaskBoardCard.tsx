'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, FolderKanban, ListTodo, MessageSquare } from 'lucide-react'
import {
  formatTaskDate,
  getTaskUserInitials,
  getTaskUserName,
  isDeadlineOverdue,
} from '@/lib/tasks/utils'
import type { TaskItem } from '@/types/tasks'

export const cardDragId = (taskId: number) => `card-${taskId}`

export const parseCardDragId = (id: string): number | null => {
  const rawId = id.trim()
  if (/^\d+$/.test(rawId)) {
    const plainNum = Number(rawId)
    return Number.isFinite(plainNum) ? plainNum : null
  }

  if (!rawId.startsWith('card-')) return null
  const num = Number(rawId.slice(5))
  return Number.isFinite(num) ? num : null
}

interface TaskBoardCardProps {
  task: TaskItem
  onOpen: (task: TaskItem) => void
}

export const TaskBoardCard = ({ task, onOpen }: TaskBoardCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardDragId(task.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleOpen = () => {
    if (isDragging) return
    onOpen(task)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  const overdue = isDeadlineOverdue(task.deadline)
  const hasMeta =
    Boolean(task.deadline) || task.subtasks_count > 0 || task.comments_count > 0
  const hasAssignees = task.assignees.length > 0
  const showFooter = hasMeta || hasAssignees

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Открыть задачу: ${task.title}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      {...attributes}
      {...listeners}
      className={`flex min-h-[7rem] touch-none cursor-grab flex-col gap-2.5 rounded-xl border border-app-border bg-app-surface-0 p-4 transition-all active:cursor-grabbing ${
        isDragging
          ? 'opacity-40 shadow-sm ring-1 ring-brand-accent/30'
          : 'hover:border-app-border-accent hover:shadow-sm'
      }`}
    >
      <p className="line-clamp-2 text-base font-semibold leading-snug text-app-text">
        {task.title}
      </p>

      {task.project?.name ? (
        <div className="inline-flex max-w-full items-center gap-1.5 text-sm text-app-text-muted">
          <FolderKanban className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{task.project.name}</span>
        </div>
      ) : null}

      {showFooter ? (
        <div className="mt-0.5 flex items-center gap-2">
          {hasMeta ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 text-sm text-app-text-muted">
              {task.deadline ? (
                <div
                  className={`flex items-center gap-1.5 ${overdue ? 'text-red-400' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{formatTaskDate(task.deadline)}</span>
                </div>
              ) : null}
              {task.subtasks_count > 0 ? (
                <div className="flex items-center gap-1.5">
                  <ListTodo className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{task.subtasks_count}</span>
                </div>
              ) : null}
              {task.comments_count > 0 ? (
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{task.comments_count}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="min-w-0 flex-1" />
          )}

          {hasAssignees ? (
            <div className="ml-auto flex shrink-0 items-center -space-x-1.5">
              {task.assignees.slice(0, 3).map((assignee) => (
                <span
                  key={assignee.id}
                  title={getTaskUserName(assignee)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-app-surface-0 bg-brand-accent/15 text-xs font-bold text-brand-accent"
                >
                  {getTaskUserInitials(assignee)}
                </span>
              ))}
              {task.assignees.length > 3 ? (
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-app-surface-0 bg-app-surface-1 px-1.5 text-xs font-medium text-app-text-muted">
                  +{task.assignees.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
