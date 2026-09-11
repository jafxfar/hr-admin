import React from 'react'
import {
  DataTable,
  DataTableHeader,
  DataTableHeaderRow,
  DataTableHead,
  DataTableBody,
} from '@/components/ui/data-table'
import { EmployeeRow } from './EmployeeRow'
import type { Employee } from '@/types/employees'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface EmployeeTableProps {
  employees: Employee[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  branchesEnabled: boolean
  isArchiveMode?: boolean
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  total,
  page,
  totalPages,
  onPageChange,
  branchesEnabled,
  isArchiveMode = false,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead>Сотрудник</DataTableHead>
            <DataTableHead>Должность</DataTableHead>
            <DataTableHead>Отдел</DataTableHead>
            {branchesEnabled ? <DataTableHead>Филиал</DataTableHead> : null}
            <DataTableHead>Email</DataTableHead>
            <DataTableHead>Дата найма</DataTableHead>
            <DataTableHead className="text-right">Действия</DataTableHead>
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              branchesEnabled={branchesEnabled}
              isArchiveMode={isArchiveMode}
            />
          ))}
        </DataTableBody>
      </DataTable>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="сотрудников"
        onPageChange={onPageChange}
      />
    </div>
  )
}
