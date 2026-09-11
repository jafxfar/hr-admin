import React, { useState } from 'react'
import { ExternalLink, Pencil, Trash2, MoreVertical } from 'lucide-react'
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
import type { News } from '@/types/news'

interface NewsRowProps {
  newsItem: News
  onEdit?: (newsItem: News) => void
  onDelete?: (newsItem: News) => void
}

export const NewsRow: React.FC<NewsRowProps> = ({ newsItem, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DataTableBodyRow>
        <DataTableCell>
          <span className="line-clamp-2 text-sm font-medium text-app-text">
            {newsItem.title}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="line-clamp-2 text-sm text-app-text-muted">
            {newsItem.body}
          </span>
        </DataTableCell>
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {newsItem.published_at
              ? new Date(newsItem.published_at).toLocaleDateString('ru-RU')
              : new Date(newsItem.created_at).toLocaleDateString('ru-RU')}
          </span>
        </DataTableCell>
        <DataTableCell>
          {newsItem.is_published ? (
            <DataTableStatus
              className="bg-brand-accent/10 text-brand-accent"
              dotClassName="bg-brand-accent"
            >
              Опубликована
            </DataTableStatus>
          ) : (
            <DataTableStatus
              className="bg-app-surface-2 text-app-text-muted"
              dotClassName="bg-app-text-muted/40"
            >
              Черновик
            </DataTableStatus>
          )}
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
                onClick={() => { window.location.href = `/news/${newsItem.id}` }}
                className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
              >
                <ExternalLink className="h-3.5 w-3.5 text-app-text-muted" />
                Посмотреть
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(newsItem)}
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
              Удалить новость?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
              <span className="font-medium text-app-text">{newsItem.title}</span> будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
            <AlertDialogCancel className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(newsItem); setConfirmOpen(false) }}
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
