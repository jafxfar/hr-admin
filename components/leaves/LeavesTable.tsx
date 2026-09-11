import React from 'react'
import { LeaveRow } from './LeaveRow'
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableHeader,
  DataTableHeaderRow,
} from '../ui/data-table'
import type { Vacation } from '@/types/vacation'
import { VacationStatus } from '@/types/vacation'
import type { Employee } from '@/types/employees'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface LeavesTableProps {
  leaves: Vacation[]
  employees: Employee[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onRowClick: (leave: Vacation) => void
  onDelete?: (leave: Vacation) => void
  onStatusUpdate?: (leave: Vacation, status: VacationStatus) => void
  isUpdating?: boolean
}

export const LeavesTable: React.FC<LeavesTableProps> = ({ leaves, employees, total, page, totalPages, onPageChange, onRowClick, onDelete, onStatusUpdate, isUpdating }) => {
  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e]))

  return (
    <>
      <div className="overflow-x-auto">
        <DataTable>
          <DataTableHeader>
            <DataTableHeaderRow>
              <DataTableHead>Имя сотрудника</DataTableHead>
              <DataTableHead>Тип отпуска</DataTableHead>
              <DataTableHead>Дата отпуска</DataTableHead>
              <DataTableHead>Количество дней</DataTableHead>
              <DataTableHead>Статус</DataTableHead>
              <DataTableHead></DataTableHead>
            </DataTableHeaderRow>
          </DataTableHeader>
          <DataTableBody>
            {leaves.map((leave) => (
              <LeaveRow
                key={leave.id}
                leave={leave}
                employee={employeeMap[leave.user_id]}
                onRowClick={onRowClick}
                onDelete={onDelete}
                onStatusUpdate={onStatusUpdate}
                isUpdating={isUpdating}
              />
            ))}
          </DataTableBody>
        </DataTable>
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="отпусков"
        onPageChange={onPageChange}
      />
    </>
  )
}
