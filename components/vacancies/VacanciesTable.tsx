import React from 'react'
import { VacancyRow } from './VacancyRow'
import type { Vacancy } from '@/types/vacancies'
import type { VacancyCategory } from '@/types/vacancyCategories'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Briefcase } from 'lucide-react'
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface VacanciesTableProps {
  vacancies: Vacancy[]
  categories: VacancyCategory[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit?: (vacancy: Vacancy) => void
  onDelete?: (vacancy: Vacancy) => void
}

export const VacanciesTable: React.FC<VacanciesTableProps> = ({ vacancies, categories, total, page, totalPages, onPageChange, onEdit, onDelete }) => {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  if (!vacancies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-app-text-muted">
        <Briefcase size={40} className="opacity-30" />
        <p className="text-sm">Вакансии не найдены</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead>Название вакансии</DataTableHead>
            <DataTableHead>Категория</DataTableHead>
            <DataTableHead>Тип</DataTableHead>
            <DataTableHead>Филиал</DataTableHead>
            <DataTableHead>Дата публикации</DataTableHead>
            <DataTableHead>Срок откликов</DataTableHead>
            <DataTableHead>Статус</DataTableHead>
            <DataTableHead className="w-16" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {vacancies.map((vacancy) => (
            <VacancyRow
              key={vacancy.id}
              vacancy={vacancy}
              categoryName={categoryMap[vacancy.category_id]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </DataTableBody>
      </DataTable>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="вакансий"
        onPageChange={onPageChange}
      />
    </>
  )
}
