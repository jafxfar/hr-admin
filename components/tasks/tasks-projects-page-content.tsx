'use client'

import { useEffect, useState } from 'react'
import { Archive, Plus } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import { TasksProjectsTable } from '@/components/tasks/TasksProjectsTable'
import { ProjectFormModal } from '@/components/tasks/ProjectFormModal'
import { ProjectDetailModal } from '@/components/tasks/ProjectDetailModal'
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal'
import { HeaderActionButton, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'
import { useMe } from '@/hooks/use-employees'
import {
  useArchiveProjectMutation,
  useCreateProjectMutation,
  useHardDeleteProjectMutation,
  useProject,
  useProjects,
  useUpdateProjectMutation,
} from '@/hooks/use-projects'
import { useTaskStatuses } from '@/hooks/use-task-board'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import { mutationOpts } from '@/lib/mutation-options'
import { cn } from '@/lib/utils'
import type { CreateProjectDTO, ProjectItem } from '@/types/projects'
import type { TaskItem } from '@/types/tasks'

const PAGE_SIZE = 20

export const TasksProjectsPageContent = () => {
  const { data: me } = useMe()
  const isSuperadmin = getSystemRoleName(me)?.toLowerCase() === 'superadmin'

  const [isArchiveMode, setIsArchiveMode] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isTaskOpen, setIsTaskOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, isArchiveMode])

  const { data, isLoading } = useProjects(
    isArchiveMode ? 'archive' : 'all',
    page,
    PAGE_SIZE,
    debouncedSearch || undefined
  )
  const { data: editingProject } = useProject(editingProjectId, isFormOpen && editingProjectId != null)
  const { data: statusesData } = useTaskStatuses()
  const createMutation = useCreateProjectMutation()
  const updateMutation = useUpdateProjectMutation()
  const archiveMutation = useArchiveProjectMutation()
  const hardDeleteMutation = useHardDeleteProjectMutation()

  const handleToggleArchive = () => {
    setIsArchiveMode((prev) => !prev)
  }

  const handleOpenCreate = () => {
    setEditingProjectId(null)
    setIsFormOpen(true)
  }

  const handleOpenProject = (project: ProjectItem) => {
    setSelectedProjectId(project.id)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedProjectId(null)
  }

  const handleEditFromDetail = () => {
    setEditingProjectId(selectedProjectId)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    if (createMutation.isPending || updateMutation.isPending) return
    setIsFormOpen(false)
    setEditingProjectId(null)
  }

  const handleSubmitForm = (form: CreateProjectDTO) => {
    if (editingProjectId) {
      updateMutation.mutate(
        { projectId: editingProjectId, data: form },
        mutationOpts({
          meta: { successTitle: 'Проект обновлён' },
          onSuccess: () => handleCloseForm(),
        })
      )
      return
    }

    createMutation.mutate(
      form,
      mutationOpts({
        meta: { successTitle: 'Проект создан' },
        onSuccess: () => handleCloseForm(),
      })
    )
  }

  const handleArchive = () => {
    if (!selectedProjectId) return
    archiveMutation.mutate(
      selectedProjectId,
      mutationOpts({
        meta: { successTitle: 'Проект архивирован' },
        onSuccess: handleCloseDetail,
      })
    )
  }

  const handleHardDelete = () => {
    if (!selectedProjectId) return
    hardDeleteMutation.mutate(
      selectedProjectId,
      mutationOpts({
        meta: { successTitle: 'Проект удалён' },
        onSuccess: handleCloseDetail,
      })
    )
  }

  const handleOpenTask = (task: TaskItem) => {
    setSelectedTaskId(task.id)
    setIsTaskOpen(true)
  }

  return (
    <HRLayout
      title="Проекты"
      topActions={
        <HeaderToolbarRow>
          <HeaderSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Поиск по проектам"
            widthClassName="min-w-[12rem] flex-1 max-w-xs"
          />
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleToggleArchive}
              aria-pressed={isArchiveMode}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200',
                isArchiveMode
                  ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                  : 'border border-transparent bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.14)] hover:text-app-text'
              )}
            >
              <Archive className="h-4 w-4" aria-hidden />
              Архив
            </button>
            {!isArchiveMode ? (
              <HeaderActionButton onClick={handleOpenCreate} icon={<Plus size={16} />}>
                Создать проект
              </HeaderActionButton>
            ) : null}
          </div>
        </HeaderToolbarRow>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-3">
        <TasksProjectsTable
          projects={data?.items ?? []}
          total={data?.total ?? 0}
          page={page}
          totalPages={data?.total_pages ?? 1}
          isLoading={isLoading}
          isArchiveMode={isArchiveMode}
          onPageChange={setPage}
          onOpenProject={handleOpenProject}
        />
      </div>

      <ProjectDetailModal
        open={isDetailOpen}
        projectId={selectedProjectId}
        isSuperadmin={isSuperadmin}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onArchive={handleArchive}
        onHardDelete={handleHardDelete}
        onOpenTask={handleOpenTask}
        isArchivePending={archiveMutation.isPending}
        isDeletePending={hardDeleteMutation.isPending}
      />

      <ProjectFormModal
        open={isFormOpen}
        isPending={createMutation.isPending || updateMutation.isPending}
        isEdit={editingProjectId != null}
        project={editingProjectId ? editingProject : null}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      <TaskDetailModal
        open={isTaskOpen}
        taskId={selectedTaskId}
        statuses={statusesData?.items ?? []}
        onClose={() => {
          setIsTaskOpen(false)
          setSelectedTaskId(null)
        }}
      />
    </HRLayout>
  )
}
