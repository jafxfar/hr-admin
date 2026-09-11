'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TaskBoardFilters } from '@/types/taskBoard'
import type { TaskDashboardFilters, TaskListQuery } from '@/types/tasks'

export const ALL_ASSIGNEES_VALUE = 'all'
export const ALL_PROJECTS_VALUE = 'all'
export const NO_PROJECT_VALUE = 'none'

export const useTaskPageFilters = () => {
  const [assigneeFilter, setAssigneeFilter] = useState(ALL_ASSIGNEES_VALUE)
  const [projectFilter, setProjectFilter] = useState(ALL_PROJECTS_VALUE)
  const [taskSearch, setTaskSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(taskSearch.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [taskSearch])

  const assigneeId =
    assigneeFilter === ALL_ASSIGNEES_VALUE ? null : Number(assigneeFilter)
  const projectId =
    projectFilter === ALL_PROJECTS_VALUE ? null : Number(projectFilter)

  const boardFilters = useMemo<TaskBoardFilters>(
    () => ({
      assigneeId,
      projectId,
      q: debouncedSearch || undefined,
    }),
    [assigneeId, projectId, debouncedSearch]
  )

  const dashboardFilters = useMemo<TaskDashboardFilters>(
    () => ({
      assigneeId,
      projectId,
    }),
    [assigneeId, projectId]
  )

  const tableQueryBase = useMemo<Omit<TaskListQuery, 'page' | 'page_size' | 'sort_by' | 'sort_order'>>(
    () => ({
      assignee_id: assigneeId,
      project_id: projectId,
      q: debouncedSearch || undefined,
    }),
    [assigneeId, projectId, debouncedSearch]
  )

  return {
    assigneeFilter,
    setAssigneeFilter,
    projectFilter,
    setProjectFilter,
    taskSearch,
    setTaskSearch,
    boardFilters,
    dashboardFilters,
    tableQueryBase,
  }
}
