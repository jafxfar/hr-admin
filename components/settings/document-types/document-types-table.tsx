'use client'

import type { DocumentTypeItem } from '@/api/settings'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { CATEGORY_LABEL } from './constants'
import type { DocumentTypeCategory } from '@/api/settings'
import {
  DataTable,
  DataTableBody,
  DataTableBodyRow,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
  DataTableStatus,
} from '@/components/ui/data-table'

type DocumentTypesTableProps = {
  items: DocumentTypeItem[]
  isPending: boolean
  onEdit: (row: DocumentTypeItem) => void
  onToggleActive: (row: DocumentTypeItem) => void
}

export const DocumentTypesTable = ({
  items,
  isPending,
  onEdit,
  onToggleActive,
}: DocumentTypesTableProps) => (
  <DataTable className="min-w-0">
    <DataTableHeader>
      <DataTableHeaderRow>
        <DataTableHead>Название</DataTableHead>
        <DataTableHead>Код</DataTableHead>
        <DataTableHead>Категория</DataTableHead>
        <DataTableHead>Порядок</DataTableHead>
        <DataTableHead>Статус</DataTableHead>
        <DataTableHead>Флаги</DataTableHead>
        <DataTableHead className="text-right">Действия</DataTableHead>
      </DataTableHeaderRow>
    </DataTableHeader>
    <DataTableBody>
      {items.length === 0 ? (
        <DataTableBodyRow>
          <DataTableCell className="py-8 text-center text-app-text-muted" colSpan={7}>
            Нет записей
          </DataTableCell>
        </DataTableBodyRow>
      ) : (
        items.map((row) => (
          <DocumentTypeTableRow
            key={row.id}
            row={row}
            isPending={isPending}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        ))
      )}
    </DataTableBody>
  </DataTable>
)

const DocumentTypeTableRow = ({
  row,
  isPending,
  onEdit,
  onToggleActive,
}: {
  row: DocumentTypeItem
  isPending: boolean
  onEdit: (row: DocumentTypeItem) => void
  onToggleActive: (row: DocumentTypeItem) => void
}) => (
  <DataTableBodyRow>
    <DataTableCell className="font-medium text-app-text">{row.title}</DataTableCell>
    <DataTableCell className="font-mono text-xs text-app-text-muted">{row.code}</DataTableCell>
    <DataTableCell>
      {CATEGORY_LABEL[row.category as DocumentTypeCategory] ?? row.category}
    </DataTableCell>
    <DataTableCell className="tabular-nums">{row.sort_order}</DataTableCell>
    <DataTableCell>
      {row.is_active ? (
        <DataTableStatus
          className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          dotClassName="bg-emerald-500"
        >
          Активен
        </DataTableStatus>
      ) : (
        <DataTableStatus
          className="bg-app-surface-2 text-app-text-muted"
          dotClassName="bg-app-text-muted/50"
        >
          Неактивен
        </DataTableStatus>
      )}
    </DataTableCell>
    <DataTableCell className="max-w-50 text-xs text-app-text-muted">
      {row.auto_complete_on_file_upload ? 'Авто при загрузке · ' : ''}
      {row.allow_received_without_file ? 'Без файла' : '—'}
    </DataTableCell>
    <DataTableCell className="whitespace-nowrap text-right">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mr-1 h-8 rounded-full px-2"
        onClick={() => onEdit(row)}
        aria-label={`Редактировать ${row.title}`}
      >
        <Pencil size={14} />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 rounded-full text-xs"
        onClick={() => onToggleActive(row)}
        disabled={isPending}
      >
        {row.is_active ? 'Деактивировать' : 'Активировать'}
      </Button>
    </DataTableCell>
  </DataTableBodyRow>
)
