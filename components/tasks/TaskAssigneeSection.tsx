'use client'

import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DepartmentsMultiSelect } from '@/components/tasks/DepartmentsMultiSelect'
import { EmployeesMultiSelect } from '@/components/tasks/EmployeesMultiSelect'
import type { AssigneeMode } from '@/lib/tasks/assignee-mapping'

type TaskAssigneeSectionProps = {
  mode: AssigneeMode
  onModeChange: (mode: AssigneeMode) => void
  employeeIds: number[]
  onEmployeeIdsChange: (ids: number[]) => void
  departmentIds: number[]
  onDepartmentIdsChange: (ids: number[]) => void
  disabled?: boolean
}

export const TaskAssigneeSection = ({
  mode,
  onModeChange,
  employeeIds,
  onEmployeeIdsChange,
  departmentIds,
  onDepartmentIdsChange,
  disabled = false,
}: TaskAssigneeSectionProps) => {
  const handleModeChange = (nextMode: string) => {
    const resolved = nextMode as AssigneeMode
    onModeChange(resolved)
    if (resolved === 'employees') {
      onDepartmentIdsChange([])
      return
    }
    onEmployeeIdsChange([])
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
        Исполнители
      </Label>
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="mb-3">
          <TabsTrigger value="employees" disabled={disabled}>
            Сотрудники
          </TabsTrigger>
          <TabsTrigger value="departments" disabled={disabled}>
            Отделы
          </TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="mt-0">
          <EmployeesMultiSelect
            value={employeeIds}
            onChange={onEmployeeIdsChange}
            disabled={disabled}
          />
        </TabsContent>
        <TabsContent value="departments" className="mt-0">
          <DepartmentsMultiSelect
            value={departmentIds}
            onChange={onDepartmentIdsChange}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
