import React from 'react'
import { RequestRow } from './RequestRow'
import { Request } from '@/types/request'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { ClipboardList } from 'lucide-react'
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface RequestsTableProps {
  requests: Request[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const RequestsTable: React.FC<RequestsTableProps> = ({ requests, total, page, totalPages, onPageChange }) => {
  if (!requests.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-app-text-muted">
        <ClipboardList size={40} className="opacity-30" />
        <p className="text-sm">Заявки не найдены</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead>Тип заявки</DataTableHead>
            <DataTableHead>Заявитель</DataTableHead>
            <DataTableHead>Описание</DataTableHead>
            <DataTableHead>Дата заявки</DataTableHead>
            <DataTableHead>Статус</DataTableHead>
            <DataTableHead className="w-16" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </DataTableBody>
      </DataTable>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="заявок"
        onPageChange={onPageChange}
      />
    </>
  )
}
