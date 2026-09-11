import React, { useState } from 'react'
import { Trash2, MoreVertical } from 'lucide-react'
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
import { Request, REQUEST_TYPE_LABELS, REQUEST_STATUS_LABELS } from '@/types/request'
import { useDeleteRequestMutation } from '@/hooks/use-requests'

interface RequestRowProps {
  request: Request
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso ?? ''
  }
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-blue-500/10 text-blue-400',
  rejected: 'bg-red-500/10 text-red-400',
  completed: 'bg-brand-accent/10 text-brand-accent',
}

const STATUS_DOT: Record<string, string> = {
  new: 'bg-yellow-400',
  approved: 'bg-blue-400',
  rejected: 'bg-red-400',
  completed: 'bg-brand-accent',
}

export const RequestRow: React.FC<RequestRowProps> = ({ request }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteMutation = useDeleteRequestMutation()

  return (
    <>
      <DataTableBodyRow>
        <DataTableCell>
          <span className="text-sm font-medium text-app-text">
            {REQUEST_TYPE_LABELS[request.type] ?? request.type}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            #{request.user_id}
          </span>
        </DataTableCell>
        <DataTableCell className="max-w-xs">
          {request.body ? (
            <span className="line-clamp-2 text-sm text-app-text-muted">
              {request.body}
            </span>
          ) : (
            <span className="text-sm text-app-text-muted/40">—</span>
          )}
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {formatDate(request.created_at)}
          </span>
        </DataTableCell>
        <DataTableCell>
          <DataTableStatus
            className={STATUS_STYLES[request.status] ?? 'bg-app-surface-2 text-app-text-muted'}
            dotClassName={STATUS_DOT[request.status] ?? 'bg-app-text-muted/40'}
          >
            {REQUEST_STATUS_LABELS[request.status] ?? request.status}
          </DataTableStatus>
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
              Удалить заявку?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
              Заявка <span className="font-medium text-app-text">«{request.title}»</span> будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
            <AlertDialogCancel className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { deleteMutation.mutate(request.id); setConfirmOpen(false) }}
              className="h-9 rounded-full border border-red-500/30 bg-red-500/20 px-4 text-[13px] font-medium text-red-400 hover:bg-red-500/30"
              disabled={deleteMutation.isPending}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
