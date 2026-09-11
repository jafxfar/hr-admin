'use client'

import type { KeyboardEvent } from 'react'
import { FolderKanban } from 'lucide-react'
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
  getTaskUserName,
  isDeadlineOverdue,
} from '@/lib/tasks/utils'
import type { ProjectItem } from '@/types/projects'

type TasksProjectsTableProps = {
  projects: ProjectItem[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  isArchiveMode?: boolean
  onPageChange: (page: number) => void
  onOpenProject: (project: ProjectItem) => void
}

export const TasksProjectsTable = ({
  projects,
  total,
  page,
  totalPages,
  isLoading,
  isArchiveMode = false,
  onPageChange,
  onOpenProject,
}: TasksProjectsTableProps) => {
  const handleRowKeyDown = (event: KeyboardEvent, project: ProjectItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenProject(project)
    }
  }

  return (
    <div className="flex min-h-[420px] flex-col gap-6">
      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <Loading />
        </div>
      ) : (
        <DataTable>
          <DataTableHeader>
            <DataTableHeaderRow>
              <DataTableHead>Название</DataTableHead>
              <DataTableHead>Участники</DataTableHead>
              <DataTableHead>Дедлайн</DataTableHead>
              <DataTableHead>Задачи</DataTableHead>
              <DataTableHead>Автор</DataTableHead>
            </DataTableHeaderRow>
          </DataTableHeader>
          <DataTableBody>
            {projects.length === 0 ? (
              <DataTableBodyRow>
                <DataTableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-app-text-muted">
                    <FolderKanban size={40} className="opacity-30" aria-hidden />
                    <p className="max-w-md text-center text-sm">
                      {isArchiveMode
                        ? 'Архивных проектов нет'
                        : 'Проектов пока нет. Создайте первый проект.'}
                    </p>
                  </div>
                </DataTableCell>
              </DataTableBodyRow>
            ) : (
              projects.map((project) => (
                <DataTableBodyRow
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                >
                  <DataTableCell>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Открыть проект: ${project.name}`}
                      onKeyDown={(event) => handleRowKeyDown(event, project)}
                    >
                      <p className="font-semibold text-app-text">{project.name}</p>
                      {project.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-app-text-muted">
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    {project.members.length > 0
                      ? project.members
                          .slice(0, 3)
                          .map((member) => getTaskUserName(member))
                          .join(', ') +
                        (project.members.length > 3
                          ? ` +${project.members.length - 3}`
                          : '')
                      : '—'}
                  </DataTableCell>
                  <DataTableCell
                    className={
                      isDeadlineOverdue(project.deadline) ? 'text-red-400' : undefined
                    }
                  >
                    {formatTaskDate(project.deadline)}
                  </DataTableCell>
                  <DataTableCell>{project.tasks_count}</DataTableCell>
                  <DataTableCell>{getTaskUserName(project.created_by_user)}</DataTableCell>
                </DataTableBodyRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="проектов"
        onPageChange={onPageChange}
      />
    </div>
  )
}
