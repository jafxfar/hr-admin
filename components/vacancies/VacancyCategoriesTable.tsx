import React, { useState } from 'react'
import { Tag, Pencil, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { VacancyCategory } from '@/types/vacancyCategories'
import { PaginationControls } from '@/components/ui/pagination-controls'
import {
  DataTable,
  DataTableBody,
  DataTableBodyRow,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableHeaderRow,
} from '@/components/ui/data-table'

interface VacancyCategoriesTableProps {
  categories: VacancyCategory[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  onEdit?: (category: VacancyCategory) => void
  onDelete?: (category: VacancyCategory) => void
}

export const VacancyCategoriesTable: React.FC<VacancyCategoriesTableProps> = ({
  categories,
  total,
  page,
  totalPages,
  onPageChange,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [confirmCategory, setConfirmCategory] = useState<VacancyCategory | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-app-text-muted text-sm">
        Загрузка...
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-app-text-muted">
        <Tag size={36} className="opacity-30" />
        <p className="text-sm">Категории не найдены</p>
      </div>
    )
  }

  return (
    <>
      <DataTable>
        <DataTableHeader>
          <DataTableHeaderRow>
            <DataTableHead className="w-12">#</DataTableHead>
            <DataTableHead>Название</DataTableHead>
            <DataTableHead>Описание</DataTableHead>
            <DataTableHead className="w-16" />
          </DataTableHeaderRow>
        </DataTableHeader>
        <DataTableBody>
            {categories.map((cat, idx) => (
              <DataTableBodyRow key={cat.id}>
                <DataTableCell className="text-app-text-muted">
                  {(page - 1) * 20 + idx + 1}
                </DataTableCell>
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10">
                      <Tag size={13} className="text-brand-accent" />
                    </span>
                    <span className="text-sm font-medium text-app-text">{cat.name}</span>
                  </div>
                </DataTableCell>
                <DataTableCell className="max-w-xs truncate text-app-text-muted">
                  {cat.description || <span className="italic opacity-40">Без описания</span>}
                </DataTableCell>
                <DataTableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="rounded-full p-2 text-app-text-muted transition-colors hover:bg-app-surface-2"
                        aria-label="Действия"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-35 border-app-border-accent bg-app-surface-0 text-app-text">
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(cat)}
                          className="cursor-pointer gap-2 text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                        >
                          <Pencil className="h-3.5 w-3.5 text-app-text-muted" />
                          Редактировать
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setConfirmCategory(cat)}
                        className="cursor-pointer gap-2 text-sm text-red-400 hover:bg-app-surface-3 focus:bg-app-surface-3"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DataTableCell>
              </DataTableBodyRow>
            ))}
        </DataTableBody>
      </DataTable>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="категорий"
        onPageChange={onPageChange}
      />

      <AlertDialog open={!!confirmCategory} onOpenChange={(open) => { if (!open) setConfirmCategory(null) }}>
        <AlertDialogContent className="bg-app-surface-0 border border-app-border-accent rounded-2xl max-w-sm p-0 gap-0 overflow-hidden">
          <AlertDialogHeader className="px-6 pt-6 pb-4">
            <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
              Удалить категорию?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-app-text-muted mt-1">
              <span className="font-medium text-app-text">{confirmCategory?.name}</span> будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 px-6 py-4 border-t border-app-border-accent bg-app-surface-2">
            <AlertDialogCancel className="h-9 px-4 text-[13px] font-medium rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmCategory) { onDelete?.(confirmCategory); setConfirmCategory(null) } }}
              className="h-9 px-4 text-[13px] font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
