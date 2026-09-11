import React, { useState } from 'react'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
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
import { DataTableBodyRow, DataTableCell, DataTableStatus } from '@/components/ui/data-table'
import type { Vacancy } from '@/types/vacancies'
import { VACANCY_TYPE_LABELS } from '@/types/vacancies'

interface VacancyRowProps {
  vacancy: Vacancy
  categoryName?: string
  onEdit?: (vacancy: Vacancy) => void
  onDelete?: (vacancy: Vacancy) => void
}

export const VacancyRow: React.FC<VacancyRowProps> = ({ vacancy, categoryName, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DataTableBodyRow>
        <DataTableCell>
          <span className="text-sm font-medium text-app-text">
            {vacancy.title}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {categoryName ?? '—'}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {VACANCY_TYPE_LABELS[vacancy.type] ?? vacancy.type}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {vacancy.branch_name ?? '—'}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {vacancy.deadline_at
              ? new Date(vacancy.deadline_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'}
          </span>
        </DataTableCell>
        <DataTableCell>
          <div className="flex flex-wrap gap-1.5">
            {vacancy.is_closed || vacancy.closed_at ? (
              <DataTableStatus
                className="bg-red-500/10 text-red-400"
                dotClassName="bg-red-400"
              >
                Закрыта
              </DataTableStatus>
            ) : null}
            {vacancy.is_deadline_passed && !vacancy.is_closed && !vacancy.closed_at ? (
              <DataTableStatus
                className="bg-amber-500/10 text-amber-400"
                dotClassName="bg-amber-400"
              >
                Срок истёк
              </DataTableStatus>
            ) : null}
            {vacancy.is_published ? (
              <DataTableStatus
                className="bg-brand-accent/10 text-brand-accent"
                dotClassName="bg-brand-accent"
              >
                Опубликована
              </DataTableStatus>
            ) : (
              <DataTableStatus
                className="bg-app-surface-2 text-app-text-muted"
                dotClassName="bg-app-text-muted/50"
              >
                Черновик
              </DataTableStatus>
            )}
          </div>
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
            <DropdownMenuContent align="end" className="min-w-35 rounded-2xl border-app-border-accent bg-app-surface-0 text-app-text">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(vacancy)}
                  className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                >
                  <Pencil className="h-3.5 w-3.5 text-app-text-muted" />
                  Редактировать
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setConfirmOpen(true)}
                className="cursor-pointer gap-2 rounded-2xl text-sm text-red-400 hover:bg-app-surface-3 focus:bg-app-surface-3"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DataTableCell>
      </DataTableBodyRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-app-border-accent bg-app-surface-0 p-0">
          <AlertDialogHeader className="px-6 pb-4 pt-6">
            <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
              Удалить вакансию?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
              <span className="font-medium text-app-text">{vacancy.title}</span> будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
            <AlertDialogCancel className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(vacancy); setConfirmOpen(false) }}
              className="h-9 rounded-full border border-red-500/30 bg-red-500/20 px-4 text-[13px] font-medium text-red-400 hover:bg-red-500/30"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
