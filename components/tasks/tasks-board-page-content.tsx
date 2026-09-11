'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
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
import {
  TaskCreateModal,
  TaskDetailModal,
  TaskStatusCreateDialog,
  TasksKanbanTab,
} from '@/components/tasks'
import { TaskPageFiltersToolbar } from '@/components/tasks/task-page-filters-toolbar'
import { TasksTableView } from '@/components/tasks/TasksTableView'
import { useCreateTaskMutation, useTasksTable } from '@/hooks/use-tasks'
import {
  useCreateTaskStatusMutation,
  useDeleteTaskStatusMutation,
  useTaskBoard,
  useTaskStatuses,
  useUpdateTaskBoardPositionMutation,
  useUpdateTaskStatusMutation,
} from '@/hooks/use-task-board'
import { useTaskPageFilters } from '@/hooks/use-task-page-filters'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/lib/api-error'
import { mutationOpts } from '@/lib/mutation-options'
import type {
  CreateTaskStatusDTO,
  TaskStatusItem,
  UpdateTaskStatusDTO,
} from '@/types/taskBoard'
import type { CreateTaskDTO, TaskItem, TaskSortBy, TaskSortOrder } from '@/types/tasks'
import { HeaderActionButton } from '@/components/hr-header-controls'

export const TasksBoardPageContent = () => {
  const {
    assigneeFilter,
    setAssigneeFilter,
    projectFilter,
    setProjectFilter,
    taskSearch,
    setTaskSearch,
    boardFilters,
    tableQueryBase,
  } = useTaskPageFilters()

  const [viewMode, setViewMode] = useState<'board' | 'table'>('board')
  const [tablePage, setTablePage] = useState(1)
  const [sortBy, setSortBy] = useState<TaskSortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>('desc')

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createDefaultStatusCode, setCreateDefaultStatusCode] = useState<string | undefined>()
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<TaskStatusItem | null>(null)
  const [statusToDelete, setStatusToDelete] = useState<TaskStatusItem | null>(null)
  const [statusFormError, setStatusFormError] = useState<string | null>(null)

  const tableQuery = useMemo(
    () => ({
      ...tableQueryBase,
      page: tablePage,
      page_size: 20,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    [tableQueryBase, tablePage, sortBy, sortOrder]
  )

  const { data: statusesData } = useTaskStatuses()
  const { data: boardData, isLoading: boardLoading } = useTaskBoard(
    boardFilters,
    viewMode === 'board'
  )
  const { data: tableData, isLoading: tableLoading } = useTasksTable(
    tableQuery,
    viewMode === 'table'
  )
  const createMutation = useCreateTaskMutation()
  const moveMutation = useUpdateTaskBoardPositionMutation(boardFilters)
  const createStatusMutation = useCreateTaskStatusMutation()
  const updateStatusMutation = useUpdateTaskStatusMutation()
  const deleteStatusMutation = useDeleteTaskStatusMutation()
  const { toast } = useToast()

  const isStatusFormPending = createStatusMutation.isPending || updateStatusMutation.isPending
  const statuses = statusesData?.items ?? []

  useEffect(() => {
    setTablePage(1)
  }, [tableQueryBase])

  const handleSortChange = (nextSortBy: TaskSortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(nextSortBy)
    setSortOrder('desc')
  }

  const handleOpenTask = (task: TaskItem) => {
    setSelectedTaskId(task.id)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedTaskId(null)
  }

  const handleOpenCreateModal = (statusCode?: string) => {
    setCreateDefaultStatusCode(statusCode)
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    if (createMutation.isPending) return
    setIsCreateModalOpen(false)
    setCreateDefaultStatusCode(undefined)
  }

  const handleCreateTask = (data: CreateTaskDTO) => {
    createMutation.mutate(
      data,
      mutationOpts({
        meta: { successTitle: 'Задача создана' },
        onSuccess: () => setIsCreateModalOpen(false),
      })
    )
  }

  const handleOpenCreateStatus = () => {
    setEditingStatus(null)
    setStatusFormError(null)
    setIsStatusFormOpen(true)
  }

  const handleOpenEditStatus = (status: TaskStatusItem) => {
    setEditingStatus(status)
    setStatusFormError(null)
    setIsStatusFormOpen(true)
  }

  const handleCloseStatusForm = () => {
    if (isStatusFormPending) return
    setIsStatusFormOpen(false)
    setEditingStatus(null)
    setStatusFormError(null)
  }

  const handleCreateStatus = (data: CreateTaskStatusDTO) => {
    setStatusFormError(null)
    createStatusMutation.mutate(
      data,
      mutationOpts({
        meta: { successTitle: 'Колонка создана', skipErrorToast: true },
        onSuccess: () => handleCloseStatusForm(),
        onError: (error: unknown) => {
          setStatusFormError(getApiErrorMessage(error, 'Не удалось создать колонку'))
        },
      })
    )
  }

  const handleUpdateStatus = (code: string, data: UpdateTaskStatusDTO) => {
    setStatusFormError(null)
    updateStatusMutation.mutate(
      { code, data },
      mutationOpts({
        meta: { successTitle: 'Колонка обновлена', skipErrorToast: true },
        onSuccess: () => handleCloseStatusForm(),
        onError: (error: unknown) => {
          setStatusFormError(getApiErrorMessage(error, 'Не удалось обновить колонку'))
        },
      })
    )
  }

  const handleRequestDeleteStatus = (status: TaskStatusItem) => {
    if (status.is_default) {
      toast({
        variant: 'destructive',
        title: 'Нельзя удалить колонку',
        description: 'Статус по умолчанию нельзя удалить',
      })
      return
    }
    setStatusToDelete(status)
  }

  const handleConfirmDeleteStatus = () => {
    if (!statusToDelete) return
    deleteStatusMutation.mutate(
      statusToDelete.code,
      mutationOpts({
        meta: { successTitle: 'Колонка удалена' },
        onSuccess: () => setStatusToDelete(null),
      })
    )
  }

  const handleMoveCard = (
    taskId: number,
    statusCode: string,
    position: number,
    globalInsertIndex: number
  ) => {
    moveMutation.mutate({
      taskId,
      data: { status_code: statusCode, position },
      globalInsertIndex,
    })
  }

  return (
    <HRLayout
      title="Задачи"
      topActions={
        <TaskPageFiltersToolbar
          taskSearch={taskSearch}
          onTaskSearchChange={setTaskSearch}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          trailingActions={
            <>
              <HeaderActionButton
                variant={viewMode === 'board' ? 'primary' : 'ghost'}
                icon={<LayoutGrid size={16} />}
                onClick={() => setViewMode('board')}
                aria-pressed={viewMode === 'board'}
                aria-label="Вид доски"
              >
                Доска
              </HeaderActionButton>
              <HeaderActionButton
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                icon={<List size={16} />}
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                aria-label="Табличный вид"
              >
                Таблица
              </HeaderActionButton>
              <HeaderActionButton onClick={() => handleOpenCreateModal()} icon={<Plus size={16} />}>
                Создать задачу
              </HeaderActionButton>
            </>
          }
        />
      }
    >
      <div
        className={
          viewMode === 'board'
            ? 'flex h-full min-h-0 flex-1 flex-col overflow-hidden p-4 pt-3'
            : 'flex min-h-0 flex-col p-4 pt-3'
        }
      >
        {viewMode === 'table' ? (
          <TasksTableView
            columns={tableData?.columns ?? []}
            items={tableData?.items ?? []}
            total={tableData?.total ?? 0}
            page={tablePage}
            totalPages={tableData?.total_pages ?? 1}
            isLoading={tableLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onPageChange={setTablePage}
            onOpenTask={handleOpenTask}
          />
        ) : (
          <TasksKanbanTab
            board={boardData}
            isLoading={boardLoading}
            isMoving={moveMutation.isPending}
            isAddTaskDisabled={createMutation.isPending}
            onOpenCard={handleOpenTask}
            onMoveCard={handleMoveCard}
            onAddTask={handleOpenCreateModal}
            onAddColumn={handleOpenCreateStatus}
            onEditStatus={handleOpenEditStatus}
            onDeleteStatus={handleRequestDeleteStatus}
          />
        )}
      </div>

      <TaskDetailModal
        open={isDetailOpen}
        taskId={selectedTaskId}
        statuses={statuses}
        onClose={handleCloseDetail}
      />

      <TaskCreateModal
        open={isCreateModalOpen}
        isPending={createMutation.isPending}
        defaultStatusCode={createDefaultStatusCode}
        defaultProjectId={boardFilters.projectId}
        statuses={statuses}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateTask}
      />

      <TaskStatusCreateDialog
        isOpen={isStatusFormOpen}
        isPending={isStatusFormPending}
        errorMessage={statusFormError}
        editingStatus={editingStatus}
        onClose={handleCloseStatusForm}
        onSubmitCreate={handleCreateStatus}
        onSubmitUpdate={handleUpdateStatus}
      />

      <AlertDialog
        open={statusToDelete != null}
        onOpenChange={(open) => {
          if (!open && !deleteStatusMutation.isPending) setStatusToDelete(null)
        }}
      >
        <AlertDialogContent className="select-text border border-app-border-accent bg-app-surface-0 text-app-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить колонку?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              {statusToDelete
                ? `Колонка «${statusToDelete.title}» будет удалена. Удаление возможно только если в ней нет задач.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteStatusMutation.isPending}
              className="rounded-full border-app-border-accent"
            >
              Отменить
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteStatus}
              disabled={deleteStatusMutation.isPending}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {deleteStatusMutation.isPending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </HRLayout>
  )
}
