'use client'

import { useEffect, useMemo, useState } from 'react'
import { ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePickerField } from '@/components/custom-ui'
import { TaskAssigneeSection } from '@/components/tasks/TaskAssigneeSection'
import { TaskProjectSelect } from '@/components/tasks/TaskProjectSelect'
import { useSearchDepartments } from '@/hooks/use-departments'
import { buildDeadlineIso } from '@/lib/task-board'
import {
  buildAssigneeIdsForSubmit,
  type AssigneeMode,
} from '@/lib/tasks/assignee-mapping'
import type { CreateTaskDTO } from '@/types/tasks'
import type { TaskStatusItem } from '@/types/taskBoard'
import { NO_PROJECT_VALUE } from '@/hooks/use-task-page-filters'

type TaskCreateModalProps = {
  open: boolean
  isPending: boolean
  defaultStatusCode?: string
  statuses?: TaskStatusItem[]
  parentId?: number | null
  defaultProjectId?: number | null
  onClose: () => void
  onSubmit: (data: CreateTaskDTO) => void
}

export const TaskCreateModal = ({
  open,
  isPending,
  defaultStatusCode,
  statuses = [],
  parentId = null,
  defaultProjectId = null,
  onClose,
  onSubmit,
}: TaskCreateModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [assigneeMode, setAssigneeMode] = useState<AssigneeMode>('employees')
  const [employeeIds, setEmployeeIds] = useState<number[]>([])
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [projectValue, setProjectValue] = useState(NO_PROJECT_VALUE)
  const [localError, setLocalError] = useState('')

  const { data: departmentsData } = useSearchDepartments('', 1, 100)
  const departments = departmentsData?.items ?? []

  const statusOptions = useMemo(
    () =>
      statuses
        .filter((s) => s.is_active)
        .sort((a, b) => a.column_sort_order - b.column_sort_order),
    [statuses]
  )

  useEffect(() => {
    if (!open) {
      setTitle('')
      setDescription('')
      setDeadline('')
      setStatusCode('')
      setAssigneeMode('employees')
      setEmployeeIds([])
      setDepartmentIds([])
      setProjectValue(NO_PROJECT_VALUE)
      setLocalError('')
      return
    }

    setProjectValue(
      defaultProjectId != null && defaultProjectId > 0
        ? String(defaultProjectId)
        : NO_PROJECT_VALUE
    )

    const defaultCode =
      defaultStatusCode ??
      statusOptions.find((s) => s.is_default)?.code ??
      statusOptions[0]?.code ??
      ''
    setStatusCode(defaultCode)
  }, [open, defaultStatusCode, defaultProjectId, statusOptions])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleSubmit = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setLocalError('Укажите название задачи')
      return
    }

    const { assigneeIds, error } = buildAssigneeIdsForSubmit(
      assigneeMode,
      employeeIds,
      departmentIds,
      departments
    )
    if (error) {
      setLocalError(error)
      return
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || null,
      deadline: buildDeadlineIso(deadline),
      status: statusCode || undefined,
      assignee_ids: assigneeIds,
      parent_id: parentId ?? undefined,
      project_id:
        projectValue === NO_PROJECT_VALUE || parentId
          ? undefined
          : Number(projectValue),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="select-text border border-app-border-accent bg-app-surface-0 text-app-text sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-app-text">
            <ListTodo className="h-5 w-5 text-brand-accent" aria-hidden />
            {parentId ? 'Новая подзадача' : 'Новая задача'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Название <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setLocalError('')
              }}
              placeholder="Кратко опишите задачу"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Описание
            </Label>
            <DarkTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробности задачи..."
              rows={4}
            />
          </div>

          {!parentId && statusOptions.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                Колонка
              </Label>
              <Select value={statusCode} onValueChange={setStatusCode}>
                <SelectTrigger className="rounded-3xl border-none bg-app-surface-1">
                  <SelectValue placeholder="Выберите колонку" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.code} value={status.code}>
                      {status.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Дедлайн
            </Label>
            <DatePickerField value={deadline} onChange={setDeadline} />
          </div>

          <TaskAssigneeSection
            mode={assigneeMode}
            onModeChange={setAssigneeMode}
            employeeIds={employeeIds}
            onEmployeeIdsChange={setEmployeeIds}
            departmentIds={departmentIds}
            onDepartmentIdsChange={setDepartmentIds}
            disabled={isPending}
          />

          {!parentId ? (
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                Проект
              </Label>
              <TaskProjectSelect
                value={projectValue}
                onChange={setProjectValue}
                includeNoneOption
                placeholder="Без проекта"
              />
            </div>
          ) : null}

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
            disabled={isPending || !title.trim()}
            className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt hover:bg-brand disabled:opacity-40"
          >
            {isPending ? 'Создание...' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
