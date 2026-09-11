'use client'

import type { Department } from '@/types/departments'
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

type DeleteDepartmentModalProps = {
  target: Department | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteDepartmentModal = ({
  target,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteDepartmentModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) onClose()
  }

  return (
    <AlertDialog open={!!target} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-app-border-accent bg-app-surface-0 p-0">
        <AlertDialogHeader className="px-6 pb-4 pt-6">
          <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
            Удалить отдел?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
            Вы уверены, что хотите удалить отдел{' '}
            <span className="font-medium text-app-text">«{target?.name}»</span>? Это действие нельзя
            отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9 rounded-full border border-red-500/30 bg-red-500/20 px-4 text-[13px] font-medium text-red-400 hover:bg-red-500/30"
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
