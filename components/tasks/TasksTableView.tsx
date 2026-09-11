'use client'

import type { KeyboardEvent } from 'react'
import {
  DataTable,
  DataTableBody,
  DataTableBodyRow,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'
import { PaginationControls } from '@/components/ui/pagination-controls'
import Loading from '@/components/ui/loading'
import {
  formatTaskDate,
  formatTaskDateTime,
  getTaskUserName,
} from '@/lib/tasks/utils'
import type { TaskItem, TaskSortBy, TaskSortOrder, TaskTableColumn } from '@/types/tasks'

type TasksTableViewProps = {
  columns: TaskTableColumn[]
  items: TaskItem[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  sortBy: TaskSortBy
  sortOrder: TaskSortOrder
  onSortChange: (sortBy: TaskSortBy) => void
  onPageChange: (page: number) => void
  onOpenTask: (task: TaskItem) => void
}

const FALLBACK_COLUMNS: TaskTableColumn[] = [
  { key: 'title', label: 'Название', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'project', label: 'Проект', sortable: false },
  { key: 'assignees', label: 'Исполнители', sortable: false },
  { key: 'deadline', label: 'Дедлайн', sortable: true },
]

const SORTABLE_KEYS: TaskSortBy[] = ['title', 'status', 'deadline', 'created_at', 'updated_at']

const renderCell = (task: TaskItem, key: string) => {
  if (key === 'id') return task.id
  if (key === 'title') return task.title
  if (key === 'status') return task.status_title ?? task.status
  if (key === 'project') return task.project?.name ?? '—'
  if (key === 'assignees') {
    if (task.assignees.length === 0) return '—'
    return task.assignees.map((assignee) => getTaskUserName(assignee)).join(', ')
  }
  if (key === 'deadline') {
    return (
      <span className={task.is_overdue ? 'text-red-400' : undefined}>
        {formatTaskDate(task.deadline)}
      </span>
    )
  }
  if (key === 'is_overdue') return task.is_overdue ? 'Да' : 'Нет'
  if (key === 'subtasks_count') return task.subtasks_count
  if (key === 'comments_count') return task.comments_count
  if (key === 'created_by_user') return getTaskUserName(task.created_by_user)
  if (key === 'created_at') return formatTaskDateTime(task.created_at)
  return '—'
}

export const TasksTableView = ({
  columns,
  items,
  total,
  page,
  totalPages,
  isLoading,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onOpenTask,
}: TasksTableViewProps) => {
  const visibleColumns = columns.length > 0 ? columns : FALLBACK_COLUMNS

  const handleHeadClick = (column: TaskTableColumn) => {
    if (!column.sortable) return
    if (!SORTABLE_KEYS.includes(column.key as TaskSortBy)) return
    onSortChange(column.key as TaskSortBy)
  }

  const handleRowKeyDown = (event: KeyboardEvent, task: TaskItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenTask(task)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            {visibleColumns.map((column) => (
              <DataTableHead key={column.key} sortable={column.sortable}>
                {column.sortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-left"
                    aria-label={`Сортировать по полю ${column.label}`}
                    onClick={() => handleHeadClick(column)}
                  >
                    {column.label}
                    {sortBy === column.key ? (
                      <span className="text-xs font-medium text-brand-accent">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    ) : null}
                  </button>
                ) : (
                  column.label
                )}
              </DataTableHead>
            ))}
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {items.length === 0 ? (
            <DataTableBodyRow>
              <DataTableCell colSpan={visibleColumns.length}>
                <p className="py-10 text-center text-sm text-app-text-muted">
                  Задач не найдено
                </p>
              </DataTableCell>
            </DataTableBodyRow>
          ) : (
            items.map((task) => (
              <DataTableBodyRow key={task.id} onClick={() => onOpenTask(task)}>
                {visibleColumns.map((column) => (
                  <DataTableCell key={column.key}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Открыть задачу: ${task.title}`}
                      onKeyDown={(event) => handleRowKeyDown(event, task)}
                    >
                      {renderCell(task, column.key)}
                    </div>
                  </DataTableCell>
                ))}
              </DataTableBodyRow>
            ))
          )}
        </DataTableBody>
      </DataTable>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="задач"
        onPageChange={onPageChange}
      />
    </div>
  )
}
