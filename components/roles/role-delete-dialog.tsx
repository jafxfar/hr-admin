'use client'

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

type RoleDeleteDialogProps = {
  open: boolean
  roleName?: string
  isDeleting: boolean
  canDelete: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const RoleDeleteDialog = ({
  open,
  roleName,
  isDeleting,
  canDelete,
  onOpenChange,
  onConfirm,
}: RoleDeleteDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="bg-app-surface-0 border border-app-border-accent rounded-2xl max-w-sm p-0 gap-0 overflow-hidden">
      <AlertDialogHeader className="px-6 pt-6 pb-4">
        <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
          Удалить роль?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[13px] text-app-text-muted mt-1">
          Роль <span className="font-medium text-app-text">«{roleName ?? '—'}»</span> будет удалена
          без возможности восстановления.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row justify-end gap-2 px-6 py-4 border-t border-app-border-accent bg-app-surface-2">
        <AlertDialogCancel
          disabled={isDeleting}
          className="h-9 px-4 text-[13px] font-medium rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
        >
          Отмена
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isDeleting || !canDelete}
          className="h-9 px-4 text-[13px] font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
