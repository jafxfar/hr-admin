'use client'

import { useState, type KeyboardEvent } from 'react'
import { Archive, FolderKanban, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { PaginationControls } from '@/components/ui/pagination-controls'
import { useProject, useProjectTasks } from '@/hooks/use-projects'
import {
  formatTaskDate,
  getTaskUserName,
  isDeadlineOverdue,
} from '@/lib/tasks/utils'
import type { TaskItem } from '@/types/tasks'

type ProjectDetailModalProps = {
  open: boolean
  projectId: number | null
  isSuperadmin: boolean
  onClose: () => void
  onEdit: () => void
  onArchive: () => void
  onHardDelete: () => void
  onOpenTask: (task: TaskItem) => void
  isArchivePending?: boolean
  isDeletePending?: boolean
}

export const ProjectDetailModal = ({
  open,
  projectId,
  isSuperadmin,
  onClose,
  onEdit,
  onArchive,
  onHardDelete,
  onOpenTask,
  isArchivePending = false,
  isDeletePending = false,
}: ProjectDetailModalProps) => {
  const [tasksPage, setTasksPage] = useState(1)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: project, isLoading } = useProject(projectId, open)
  const { data: tasksData, isLoading: tasksLoading } = useProjectTasks(
    projectId,
    tasksPage,
    10,
    undefined,
    open
  )

  const isArchived = Boolean(project?.archived_at)
  const isPending = isArchivePending || isDeletePending

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleTaskKeyDown = (event: KeyboardEvent, task: TaskItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenTask(task)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="select-text flex max-h-[90vh] flex-col border border-app-border-accent bg-app-surface-0 text-app-text sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
              <FolderKanban className="h-5 w-5 text-brand-accent" aria-hidden />
              {isLoading ? 'Загрузка...' : project?.name ?? 'Проект'}
            </DialogTitle>
          </DialogHeader>

          {isLoading || !project ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loading />
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
              {project.description ? (
                <p className="text-sm text-app-text-muted">{project.description}</p>
              ) : (
                <p className="text-sm text-app-text-muted/70">Описание не указано</p>
              )}

              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-3">
                  <dt className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                    Автор
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-app-text">
                    {getTaskUserName(project.created_by_user)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-3">
                  <dt className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                    Дедлайн
                  </dt>
                  <dd
                    className={`mt-1 text-sm font-medium ${
                      isDeadlineOverdue(project.deadline) ? 'text-red-400' : 'text-app-text'
                    }`}
                  >
                    {formatTaskDate(project.deadline)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-3 sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                    Участники
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-app-text">
                    {project.members.length > 0
                      ? project.members.map((member) => getTaskUserName(member)).join(', ')
                      : 'Нет участников'}
                  </dd>
                </div>
              </dl>

              <section>
                <h3 className="text-sm font-bold text-app-text">
                  Задачи ({tasksData?.total ?? project.tasks_count})
                </h3>
                {tasksLoading ? (
                  <div className="flex min-h-[120px] items-center justify-center">
                    <Loading />
                  </div>
                ) : (tasksData?.items ?? []).length === 0 ? (
                  <p className="mt-3 text-sm text-app-text-muted">В проекте пока нет задач</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {(tasksData?.items ?? []).map((task) => (
                      <li key={task.id}>
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`Открыть задачу: ${task.title}`}
                          onClick={() => onOpenTask(task)}
                          onKeyDown={(event) => handleTaskKeyDown(event, task)}
                          className="cursor-pointer rounded-2xl border border-app-border-accent bg-app-surface-1 px-4 py-3 transition-colors hover:bg-(--app-glass-inset-bg) hover:backdrop-blur-sm"
                        >
                          <p className="font-medium text-app-text">{task.title}</p>
                          <p className="mt-1 text-xs text-app-text-muted">
                            {task.status_title ?? task.status}
                            {task.deadline ? ` · ${formatTaskDate(task.deadline)}` : ''}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <PaginationControls
                  page={tasksPage}
                  totalPages={tasksData?.total_pages ?? 1}
                  total={tasksData?.total ?? 0}
                  entityLabel="задач"
                  onPageChange={setTasksPage}
                />
              </section>
            </div>
          )}

          <DialogFooter className="shrink-0 border-t border-app-border-accent pt-4">
            {isArchived && isSuperadmin ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
                disabled={isPending || !project}
                className="mr-auto gap-2 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmArchive(true)}
                disabled={isPending || !project || isArchived}
                className="mr-auto gap-2 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Archive className="h-4 w-4" />
                Архивировать
              </Button>
            )}
            {!isArchived ? (
              <Button
                type="button"
                variant="outline"
                onClick={onEdit}
                disabled={isPending || !project}
                className="gap-2 rounded-full border-app-border-accent"
              >
                <Pencil className="h-4 w-4" />
                Изменить
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-full border-app-border-accent"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmArchive} onOpenChange={setConfirmArchive}>
        <AlertDialogContent className="border border-app-border-accent bg-app-surface-0 text-app-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Архивировать проект?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              Проект будет скрыт из рабочих списков. Задачи останутся в системе.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchivePending}>Отменить</AlertDialogCancel>
            <AlertDialogAction
              onClick={onArchive}
              disabled={isArchivePending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isArchivePending ? 'Архивация...' : 'Архивировать'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="border border-app-border-accent bg-app-surface-0 text-app-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить проект навсегда?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              Проект будет удалён безвозвратно. Действие доступно только для архивных проектов.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>Отменить</AlertDialogCancel>
            <AlertDialogAction
              onClick={onHardDelete}
              disabled={isDeletePending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletePending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
