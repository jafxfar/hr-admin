'use client'

import type { ReactNode } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useEmployees } from '@/hooks/use-employees'
import { ALL_ASSIGNEES_VALUE } from '@/hooks/use-task-page-filters'
import { employeeSelectLabel } from '@/components/departments/department-assign-utils'
import { HeaderFilterSelect, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'
import { TaskProjectSelect } from '@/components/tasks/TaskProjectSelect'

const EMPLOYEES_PAGE_SIZE = 50

type TaskPageFiltersToolbarProps = {
  taskSearch: string
  onTaskSearchChange: (value: string) => void
  assigneeFilter: string
  onAssigneeFilterChange: (value: string) => void
  projectFilter?: string
  onProjectFilterChange?: (value: string) => void
  hideSearch?: boolean
  trailingActions?: ReactNode
}

export const TaskPageFiltersToolbar = ({
  taskSearch,
  onTaskSearchChange,
  assigneeFilter,
  onAssigneeFilterChange,
  projectFilter,
  onProjectFilterChange,
  hideSearch = false,
  trailingActions,
}: TaskPageFiltersToolbarProps) => {
  const { data: employeesData } = useEmployees(1, EMPLOYEES_PAGE_SIZE)
  const employees = employeesData?.items ?? []

  return (
    <HeaderToolbarRow>
      {hideSearch ? null : (
        <HeaderSearchInput
          value={taskSearch}
          onChange={onTaskSearchChange}
          placeholder="Поиск по названию"
          widthClassName="min-w-[12rem] flex-1 max-w-xs"
        />
      )}
      <Select value={assigneeFilter} onValueChange={onAssigneeFilterChange}>
        <HeaderFilterSelect
          className="w-full min-w-56 max-w-md sm:w-72"
          active={assigneeFilter !== ALL_ASSIGNEES_VALUE}
        >
          <SelectValue placeholder="Все исполнители" />
        </HeaderFilterSelect>
        <SelectContent>
          <SelectItem value={ALL_ASSIGNEES_VALUE}>Все исполнители</SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={String(employee.id)}>
              {employeeSelectLabel(employee)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onProjectFilterChange && projectFilter != null ? (
        <TaskProjectSelect
          value={projectFilter}
          onChange={onProjectFilterChange}
          includeAllOption
          variant="header"
          placeholder="Все проекты"
        />
      ) : null}
      {trailingActions}
    </HeaderToolbarRow>
  )
}
