'use client'

import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DarkInput } from '@/components/custom-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getStatusLabel } from '@/lib/tasks/utils'
import type { TaskItem, UpdateTaskDTO } from '@/types/tasks'
import type { TaskStatusItem } from '@/types/taskBoard'

type TaskSubtasksSectionProps = {
  subtasks: TaskItem[]
  statuses: TaskStatusItem[]
  isPending: boolean
  onCreateSubtask: () => void
  onUpdateSubtask: (taskId: number, data: UpdateTaskDTO) => void
  onArchiveSubtask: (taskId: number) => void
}

export const TaskSubtasksSection = ({
  subtasks,
  statuses,
  isPending,
  onCreateSubtask,
  onUpdateSubtask,
  onArchiveSubtask,
}: TaskSubtasksSectionProps) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStatus, setEditStatus] = useState('')

  const handleStartEdit = (subtask: TaskItem) => {
    setEditingId(subtask.id)
    setEditTitle(subtask.title)
    setEditStatus(subtask.status)
  }

  const handleSaveEdit = () => {
    if (editingId == null || !editTitle.trim()) return
    onUpdateSubtask(editingId, {
      title: editTitle.trim(),
      status: editStatus,
    })
    setEditingId(null)
  }

  const statusOptions = statuses.filter((s) => s.is_active)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-app-text">Подзадачи</h3>
        <Button
          type="button"
          size="sm"
          className="gap-2 rounded-full"
          onClick={onCreateSubtask}
          disabled={isPending}
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {subtasks.length === 0 ? (
        <p className="py-4 text-center text-sm text-app-text-muted">Подзадач пока нет</p>
      ) : (
        <ul className="space-y-2">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex items-start gap-3 rounded-2xl border border-app-border-accent bg-app-surface-1 p-3"
            >
              {editingId === subtask.id ? (
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <DarkInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="rounded-3xl border-none bg-app-surface-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.code} value={status.code}>
                          {status.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editTitle.trim()}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-app-text">{subtask.title}</p>
                    <p className="text-xs text-app-text-muted">
                      {getStatusLabel(subtask.status, statuses)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label="Редактировать подзадачу"
                      onClick={() => handleStartEdit(subtask)}
                      className="rounded-full p-2 text-app-text-muted hover:bg-app-surface-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Удалить подзадачу"
                      onClick={() => onArchiveSubtask(subtask.id)}
                      className="rounded-full p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
