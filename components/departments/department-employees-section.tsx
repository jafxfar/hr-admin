'use client'

import { Users } from 'lucide-react'
import { EmployeeTable } from '@/components/employees'
import type { Employee } from '@/types/employees'
import { DEPARTMENT_DETAIL_PAGE_SIZE } from '@/hooks/use-department-detail-page'

type DepartmentEmployeesSectionProps = {
  empLoading: boolean
  employees: Employee[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  branchesEnabled: boolean
}

export const DepartmentEmployeesSection = ({
  empLoading,
  employees,
  total,
  page,
  totalPages,
  onPageChange,
  branchesEnabled,
}: DepartmentEmployeesSectionProps) => (
  <div>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 className="text-sm font-semibold text-app-text tracking-tight">Сотрудники отдела</h2>
    </div>
    {empLoading ? (
      <div className="flex items-center justify-center h-32 text-app-text-muted text-sm">
        Загрузка...
      </div>
    ) : employees.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-32 gap-2 text-app-text-muted bg-app-surface-3 rounded-2xl border border-app-surface-4">
        <Users className="w-9 h-9 opacity-40" />
        <span className="text-sm">В этом отделе нет сотрудников</span>
      </div>
    ) : (
      <EmployeeTable
        employees={employees}
        total={total}
        page={page}
        pageSize={DEPARTMENT_DETAIL_PAGE_SIZE}
        totalPages={totalPages}
        onPageChange={onPageChange}
        branchesEnabled={branchesEnabled}
      />
    )}
  </div>
)
