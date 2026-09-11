import React from 'react'
import { Users } from 'lucide-react'
import { PaginationControls } from '@/components/ui/pagination-controls'
import type { VacancyApplication } from '@/types/vacancyApplications'
import { VacancyApplicationRow } from './VacancyApplicationRow'
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface VacancyApplicationsTableProps {
  applications: VacancyApplication[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  getCategoryName: (application: VacancyApplication) => string
  onManage: (application: VacancyApplication) => void
}

export const VacancyApplicationsTable: React.FC<VacancyApplicationsTableProps> = ({
  applications,
  total,
  page,
  totalPages,
  onPageChange,
  getCategoryName,
  onManage,
}) => {
  if (!applications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-app-text-muted">
        <Users size={40} className="opacity-30" />
        <p className="text-sm">Отклики не найдены</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead>ФИО</DataTableHead>
            <DataTableHead>Email</DataTableHead>
            <DataTableHead>Вакансия</DataTableHead>
            <DataTableHead>Категория</DataTableHead>
            <DataTableHead>Дата отклика</DataTableHead>
            <DataTableHead>Статус</DataTableHead>
            <DataTableHead className="w-28" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {applications.map((application) => (
            <VacancyApplicationRow
              key={application.id}
              application={application}
              categoryName={getCategoryName(application)}
              onManage={onManage}
            />
          ))}
        </DataTableBody>
      </DataTable>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="откликов"
        onPageChange={onPageChange}
      />
    </>
  )
}
