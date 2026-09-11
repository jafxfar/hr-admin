/**
 * Компонент строки должности в таблице
 */

'use client'

import { Trash2, Edit, MoreVertical, Paperclip } from 'lucide-react'
import { Positions } from '@/types/positions'
import { useState } from 'react'
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
import { DataTableBodyRow, DataTableCell } from '@/components/ui/data-table'

interface RoleRowProps {
  role: Positions
  onDelete?: (id: number) => void
  onEdit?: (role: Positions) => void
  onAssign?: (role: Positions) => void
}

export function RoleRow({ role, onDelete, onEdit, onAssign }: RoleRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <DataTableBodyRow>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">#{role.id}</span>
        </DataTableCell>
        <DataTableCell>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-app-text">{role.title}</span>
            {role.job_instruction_path && (
              role.job_instruction_is_active && role.job_instruction_url ? (
                <a
                  href={role.job_instruction_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center text-app-text-muted transition-colors hover:text-brand-accent"
                  title="Открыть должностную инструкцию"
                  aria-label="Открыть должностную инструкцию"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span
                  className="inline-flex items-center text-app-text-muted opacity-40"
                  title="Инструкция скрыта"
                  aria-label="Инструкция скрыта"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </span>
              )
            )}
          </div>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">{role.description || '—'}</span>
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
            <DropdownMenuContent align="end" className="min-w-40 rounded-2xl border-app-border-accent bg-app-surface-0 text-app-text">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(role)}
                  className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                >
                  <Edit className="h-3.5 w-3.5 text-app-text-muted" />
                  Редактировать
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer gap-2 rounded-2xl text-sm text-red-400 hover:bg-app-surface-3 focus:bg-app-surface-3"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DataTableCell>
      </DataTableBodyRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-app-border-accent bg-app-surface-0 p-0">
          <AlertDialogHeader className="px-6 pb-4 pt-6">
            <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
              Удалить должность?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
              Должность <span className="font-medium text-app-text">«{role.title}»</span> будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
            <AlertDialogCancel className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(role.id); setShowDeleteDialog(false) }}
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
