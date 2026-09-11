'use client'

import { useEffect, useState } from 'react'
import { FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkTextarea, DatePickerField } from '@/components/custom-ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmployeesMultiSelect } from '@/components/tasks/EmployeesMultiSelect'
import { buildDeadlineIso, parseDeadlineDate } from '@/lib/task-board'
import type { CreateProjectDTO, ProjectItem } from '@/types/projects'

type ProjectFormModalProps = {
  open: boolean
  isPending: boolean
  project?: ProjectItem | null
  isEdit?: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectDTO) => void
}

export const ProjectFormModal = ({
  open,
  isPending,
  project = null,
  isEdit = false,
  onClose,
  onSubmit,
}: ProjectFormModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [memberIds, setMemberIds] = useState<number[]>([])
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!open) {
      setName('')
      setDescription('')
      setDeadline('')
      setMemberIds([])
      setLocalError('')
      return
    }

    if (!project) return

    setName(project.name)
    setDescription(project.description ?? '')
    setDeadline(parseDeadlineDate(project.deadline))
    setMemberIds(project.members.map((member) => member.id))
  }, [open, project])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setLocalError('Укажите название проекта')
      return
    }

    onSubmit({
      name: trimmedName,
      description: description.trim() || null,
      deadline: buildDeadlineIso(deadline),
      member_ids: memberIds,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="select-text border border-app-border-accent bg-app-surface-0 text-app-text sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-app-text">
            <FolderKanban className="h-5 w-5 text-brand-accent" aria-hidden />
            {isEdit ? 'Редактировать проект' : 'Новый проект'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Название <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setLocalError('')
              }}
              placeholder="Название проекта"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Описание
            </Label>
            <DarkTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="О чём проект..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Дедлайн
            </Label>
            <DatePickerField value={deadline} onChange={setDeadline} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Участники
            </Label>
            <EmployeesMultiSelect value={memberIds} onChange={setMemberIds} />
          </div>

          {localError ? (
            <p className="text-sm text-red-400" role="alert">
              {localError}
            </p>
          ) : null}
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="h-10 rounded-full border-app-border-accent bg-transparent px-6 text-sm text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt hover:bg-brand disabled:opacity-40"
          >
            {isPending ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
