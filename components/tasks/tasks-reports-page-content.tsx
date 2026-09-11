'use client'

import { HRLayout } from '@/components/hr-layout'
import { TasksReportsDashboard } from '@/components/tasks/TasksReportsDashboard'
import { TaskPageFiltersToolbar } from '@/components/tasks/task-page-filters-toolbar'
import { useTasksDashboard } from '@/hooks/use-tasks'
import { useTaskPageFilters } from '@/hooks/use-task-page-filters'

export const TasksReportsPageContent = () => {
  const {
    assigneeFilter,
    setAssigneeFilter,
    projectFilter,
    setProjectFilter,
    taskSearch,
    setTaskSearch,
    dashboardFilters,
  } = useTaskPageFilters()

  const { data: dashboard, isLoading } = useTasksDashboard(dashboardFilters)

  return (
    <HRLayout
      title="Отчёты по задачам"
      topActions={
        <TaskPageFiltersToolbar
          taskSearch={taskSearch}
          onTaskSearchChange={setTaskSearch}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          hideSearch
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-3">
        <TasksReportsDashboard dashboard={dashboard} isLoading={isLoading} />
      </div>
    </HRLayout>
  )
}
