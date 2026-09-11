'use client'

import { useEffect, useMemo, useState } from 'react'
import { Archive, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import { DatePickerField } from '@/components/custom-ui/date-picker-field'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Loading from '@/components/ui/loading'
import { TaskAssigneeSection } from '@/components/tasks/TaskAssigneeSection'
import { TaskChangesSection } from '@/components/tasks/TaskChangesSection'
import { TaskCommentsSection } from '@/components/tasks/TaskCommentsSection'
import { TaskSubtasksSection } from '@/components/tasks/TaskSubtasksSection'
import { TaskCreateModal } from '@/components/tasks/TaskCreateModal'
import { TaskProjectSelect } from '@/components/tasks/TaskProjectSelect'
import { buildDeadlineIso, parseDeadlineDate } from '@/lib/task-board'
import {
  useArchiveTaskMutation,
  useCreateTaskCommentMutation,
  useCreateTaskMutation,
  useDeleteTaskCommentMutation,
  useTask,
  useTaskChanges,
  useTaskComments,
  useUpdateTaskCommentMutation,
  useUpdateTaskMutation,
} from '@/hooks/use-tasks'
import { useMe } from '@/hooks/use-employees'
import { useSearchDepartments } from '@/hooks/use-departments'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import {
  assigneeIdsToDepartmentIds,
  buildAssigneeIdsForSubmit,
  resolveAssigneeModeFromTask,
  type AssigneeMode,
} from '@/lib/tasks/assignee-mapping'
import { NO_PROJECT_VALUE } from '@/hooks/use-task-page-filters'
import type { TaskStatusItem } from '@/types/taskBoard'

type TaskDetailModalProps = {
  open: boolean
  taskId: number | null
  statuses: TaskStatusItem[]
  onClose: () => void
}

export const TaskDetailModal = ({
  open,
  taskId,
  statuses,
  onClose,
}: TaskDetailModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [statusCode, setStatusCode] = useState('')
  const [assigneeMode, setAssigneeMode] = useState<AssigneeMode>('employees')
  const [employeeIds, setEmployeeIds] = useState<number[]>([])
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [projectValue, setProjectValue] = useState(NO_PROJECT_VALUE)
  const [assigneeError, setAssigneeError] = useState('')
  const [changesPage, setChangesPage] = useState(1)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false)

  const { data: me } = useMe(open)
  const isSuperadmin = getSystemRoleName(me) === 'superadmin'
  const currentUserId = me?.id

  const { data: task, isLoading: taskLoading } = useTask(taskId, open)
  const { data: departmentsData } = useSearchDepartments('', 1, 100)
  const departmentItems = departmentsData?.items
  const { data: comments = [], isLoading: commentsLoading } = useTaskComments(taskId, open)
  const { data: changesData, isLoading: changesLoading } = useTaskChanges(
    taskId,
    changesPage,
    open
  )

  const updateMutation = useUpdateTaskMutation()
  const archiveMutation = useArchiveTaskMutation()
  const createSubtaskMutation = useCreateTaskMutation()
  const createCommentMutation = useCreateTaskCommentMutation(taskId ?? 0)
  const updateCommentMutation = useUpdateTaskCommentMutation(taskId ?? 0)
  const deleteCommentMutation = useDeleteTaskCommentMutation(taskId ?? 0)

  const statusOptions = useMemo(
    () =>
      statuses
        .filter((s) => s.is_active)
        .sort((a, b) => a.column_sort_order - b.column_sort_order),
    [statuses]
  )

  useEffect(() => {
    if (!open) {
      setAssigneeMode('employees')
      setEmployeeIds([])
      setDepartmentIds([])
      setAssigneeError('')
      return
    }

    if (!task) return

    setTitle(task.title)
    setDescription(task.description ?? '')
    setDeadline(parseDeadlineDate(task.deadline))
    setStatusCode(task.status)
    setProjectValue(
      task.project_id != null && task.project_id > 0
        ? String(task.project_id)
        : NO_PROJECT_VALUE
    )
    setChangesPage(1)
    setAssigneeError('')

    const assigneeIds = task.assignees.map((assignee) => assignee.id)
    if (!departmentItems?.length) {
      setAssigneeMode('employees')
      setEmployeeIds(assigneeIds)
      setDepartmentIds([])
      return
    }

    const mode = resolveAssigneeModeFromTask(assigneeIds, departmentItems)
    setAssigneeMode(mode)

    if (mode === 'departments') {
      setDepartmentIds(assigneeIdsToDepartmentIds(assigneeIds, departmentItems) ?? [])
      setEmployeeIds([])
      return
    }

    setEmployeeIds(assigneeIds)
    setDepartmentIds([])
  }, [task, open, departmentItems])

  const handleClose = () => {
    if (updateMutation.isPending || archiveMutation.isPending) return
    onClose()
  }

  const handleSave = () => {
    if (!taskId || !title.trim()) return

    const { assigneeIds, error } = buildAssigneeIdsForSubmit(
      assigneeMode,
      employeeIds,
      departmentIds,
      departmentItems ?? []
    )
    if (error) {
      setAssigneeError(error)
      return
    }

    setAssigneeError('')
    updateMutation.mutate(
      {
        taskId,
        data: {
          title: title.trim(),
          description: description.trim() || null,
          deadline: buildDeadlineIso(deadline),
          status: statusCode,
          assignee_ids: assigneeIds,
          project_id: projectValue === NO_PROJECT_VALUE ? null : Number(projectValue),
        },
      },
      { onSuccess: () => onClose() }
    )
  }

  const handleArchive = () => {
    if (!taskId) return
    archiveMutation.mutate(taskId, {
      onSuccess: () => {
        setIsArchiveOpen(false)
        onClose()
      },
    })
  }

  const handleCreateSubtask = (data: Parameters<typeof createSubtaskMutation.mutate>[0]) => {
    createSubtaskMutation.mutate(data, {
      onSuccess: () => setIsSubtaskModalOpen(false),
    })
  }

  const isPending =
    updateMutation.isPending ||
    archiveMutation.isPending ||
    createSubtaskMutation.isPending

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="select-text flex max-h-[90vh] flex-col border border-app-border-accent bg-app-surface-0 text-app-text sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
              <ListTodo className="h-5 w-5 text-brand-accent" aria-hidden />
              {taskLoading ? 'Загрузка...' : task?.title ?? 'Задача'}
            </DialogTitle>
          </DialogHeader>

          {taskLoading || !task ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loading />
            </div>
          ) : (
            <Tabs defaultValue="main" className="min-h-0 flex-1 overflow-hidden">
              <TabsList className="mb-4 shrink-0">
                <TabsTrigger value="main">Основное</TabsTrigger>
                <TabsTrigger value="subtasks">
                  Подзадачи ({task.subtasks.length})
                </TabsTrigger>
                <TabsTrigger value="comments">
                  Комментарии ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="history">История</TabsTrigger>
              </TabsList>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <TabsContent value="main" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                      Название
                    </Label>
                    <DarkInput value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                      Описание
                    </Label>
                    <DarkTextarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                        Статус
                      </Label>
                      <Select value={statusCode} onValueChange={setStatusCode}>
                        <SelectTrigger className="rounded-3xl border-none bg-app-surface-1">
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
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                        Дедлайн
                      </Label>
                      <DatePickerField value={deadline} onChange={setDeadline} />
                    </div>
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

                  {assigneeError ? (
                    <p className="text-sm text-red-400" role="alert">
                      {assigneeError}
                    </p>
                  ) : null}

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
                </TabsContent>

                <TabsContent value="subtasks">
                  <TaskSubtasksSection
                    subtasks={task.subtasks}
                    statuses={statuses}
                    isPending={createSubtaskMutation.isPending}
                    onCreateSubtask={() => setIsSubtaskModalOpen(true)}
                    onUpdateSubtask={(subtaskId, data) =>
                      updateMutation.mutate({ taskId: subtaskId, data })
                    }
                    onArchiveSubtask={(subtaskId) => archiveMutation.mutate(subtaskId)}
                  />
                </TabsContent>

                <TabsContent value="comments">
                  <TaskCommentsSection
                    comments={comments}
                    isLoading={commentsLoading}
                    isSubmitting={createCommentMutation.isPending}
                    currentUserId={currentUserId}
                    isSuperadmin={isSuperadmin}
                    onCreate={(body, isImportant) =>
                      createCommentMutation.mutate({ body, is_important: isImportant })
                    }
                    onUpdate={(commentId, body, isImportant) =>
                      updateCommentMutation.mutate({
                        commentId,
                        data: { body, is_important: isImportant },
                      })
                    }
                    onDelete={(commentId) => deleteCommentMutation.mutate(commentId)}
                  />
                </TabsContent>

                <TabsContent value="history">
                  <TaskChangesSection
                    changes={changesData?.items ?? []}
                    isLoading={changesLoading}
                    page={changesPage}
                    totalPages={changesData?.total_pages ?? 1}
                    statuses={statuses}
                    onPageChange={setChangesPage}
                  />
                </TabsContent>
              </div>
            </Tabs>
          )}

          <DialogFooter className="shrink-0 border-t border-app-border-accent pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsArchiveOpen(true)}
              disabled={isPending || !taskId}
              className="mr-auto gap-2 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <Archive className="h-4 w-4" />
              Архивировать
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-full border-app-border-accent"
            >
              Закрыть
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending || !title.trim() || !taskId}
              className="rounded-full bg-brand-accent font-bold text-brand-accent-on-alt hover:bg-brand"
            >
              {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskCreateModal
        open={isSubtaskModalOpen}
        isPending={createSubtaskMutation.isPending}
        statuses={statuses}
        parentId={taskId}
        onClose={() => setIsSubtaskModalOpen(false)}
        onSubmit={handleCreateSubtask}
      />

      <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <AlertDialogContent className="border border-app-border-accent bg-app-surface-0 text-app-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Архивировать задачу?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              Задача и все подзадачи будут перемещены в архив и исчезнут с доски.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiveMutation.isPending}>Отменить</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {archiveMutation.isPending ? 'Архивация...' : 'Архивировать'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
