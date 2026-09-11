import React from 'react'
import { NewsRow } from './NewsRow'
import type { News } from '@/types/news'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Newspaper } from 'lucide-react'
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface NewsTableProps {
  news: News[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit?: (newsItem: News) => void
  onDelete?: (newsItem: News) => void
}

export const NewsTable: React.FC<NewsTableProps> = ({ news, total, page, totalPages, onPageChange, onEdit, onDelete }) => {
  if (!news.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-app-text-muted">
        <Newspaper size={40} className="opacity-30" />
        <p className="text-sm">Новости не найдены</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead>Заголовок</DataTableHead>
            <DataTableHead>Содержание</DataTableHead>
            <DataTableHead>Дата публикации</DataTableHead>
            <DataTableHead>Статус</DataTableHead>
            <DataTableHead className="w-16" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
          {news.map((newsItem) => (
            <NewsRow key={newsItem.id} newsItem={newsItem} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </DataTableBody>
      </DataTable>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="новостей"
        onPageChange={onPageChange}
      />
    </>
  )
}
