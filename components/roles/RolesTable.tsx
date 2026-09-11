/**
 * Компонент таблицы должностей
 */

'use client'

import { RoleRow } from './RoleRow'
import { Positions } from '@/types/positions'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Briefcase } from 'lucide-react'
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface RolesTableProps {
  roles: Positions[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete?: (id: number) => void
  onEdit?: (role: Positions) => void
  onAssign?: (role: Positions) => void
}

export function RolesTable({ roles, total, page, totalPages, onPageChange, onDelete, onEdit, onAssign }: RolesTableProps) {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-app-text-muted">
        <Briefcase size={40} className="opacity-30" />
        <p className="text-sm">Должностей пока нет</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead className="w-24">ID</DataTableHead>
            <DataTableHead>Название должности</DataTableHead>
            <DataTableHead>Описание</DataTableHead>
            <DataTableHead className="w-16" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {roles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              onDelete={onDelete}
              onEdit={onEdit}
              onAssign={onAssign}
            />
          ))}
        </DataTableBody>
      </DataTable>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="должностей"
        onPageChange={onPageChange}
      />
    </>
  )
}
