'use client'

import { DarkInput } from '@/components/custom-ui'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type PendingMutation = { isPending: boolean }

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'
const cancelBtnCls =
  'h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text'
const confirmBtnCls =
  'h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]'

export interface BranchCreateModalProps {
  open: boolean
  name: string
  description: string
  code: string
  mutation: PendingMutation
  onClose: () => void
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCodeChange: (value: string) => void
  onSave: () => void
}

export const BranchCreateModal = ({
  open,
  name,
  description,
  code,
  mutation,
  onClose,
  onNameChange,
  onDescriptionChange,
  onCodeChange,
  onSave,
}: BranchCreateModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(next) => {
      if (!next && !mutation.isPending) onClose()
    }}
  >
    <DialogContent className="sm:max-w-lg bg-app-surface-0 border border-app-border-accent text-app-text">
      <DialogHeader>
        <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
          Новый филиал
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className={labelCls}>
            Название <span className="text-brand-accent">*</span>
          </Label>
          <DarkInput
            placeholder="Название филиала"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Код</Label>
          <DarkInput
            placeholder="Внутренний код"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Описание</Label>
          <Textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={textareaCls}
          />
        </div>
      </div>

      <DialogFooter className="border-t border-app-border-accent pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={mutation.isPending}
          className={cancelBtnCls}
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={mutation.isPending}
          className={confirmBtnCls}
        >
          {mutation.isPending ? 'Создание...' : 'Создать'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export interface BranchEditModalProps {
  open: boolean
  name: string
  description: string
  code: string
  isActive: boolean
  activeSwitchId: string
  mutation: PendingMutation
  onClose: () => void
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCodeChange: (value: string) => void
  onIsActiveChange: (value: boolean) => void
  onSave: () => void
}

export const BranchEditModal = ({
  open,
  name,
  description,
  code,
  isActive,
  activeSwitchId,
  mutation,
  onClose,
  onNameChange,
  onDescriptionChange,
  onCodeChange,
  onIsActiveChange,
  onSave,
}: BranchEditModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(next) => {
      if (!next && !mutation.isPending) onClose()
    }}
  >
    <DialogContent className="sm:max-w-lg bg-app-surface-0 border border-app-border-accent text-app-text">
      <DialogHeader>
        <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
          Редактировать филиал
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className={labelCls}>
            Название <span className="text-brand-accent">*</span>
          </Label>
          <DarkInput
            placeholder="Название"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Код</Label>
          <DarkInput
            placeholder="Код"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Описание</Label>
          <Textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={textareaCls}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-app-border-accent bg-app-surface-0/50 px-4 py-3">
          <Label htmlFor={activeSwitchId} className={`${labelCls} m-0 cursor-pointer`}>
            Активен
          </Label>
          <Switch
            id={activeSwitchId}
            checked={isActive}
            onCheckedChange={onIsActiveChange}
            aria-label="Активность филиала"
          />
        </div>
      </div>

      <DialogFooter className="border-t border-app-border-accent pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={mutation.isPending}
          className={cancelBtnCls}
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={mutation.isPending}
          className={confirmBtnCls}
        >
          {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export interface BranchDeleteModalProps {
  open: boolean
  mutation: PendingMutation
  onClose: () => void
  onConfirm: () => void
}

export const BranchDeleteModal = ({ open, mutation, onClose, onConfirm }: BranchDeleteModalProps) => (
  <AlertDialog
    open={open}
    onOpenChange={(next) => {
      if (!next && !mutation.isPending) onClose()
    }}
  >
    <AlertDialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border border-app-border-accent bg-app-surface-0 p-0">
      <AlertDialogHeader className="px-6 pb-4 pt-6">
        <AlertDialogTitle className="text-[15px] font-semibold text-app-text">
          Удалить филиал?
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-1 text-[13px] text-app-text-muted">
          Удалить выбранный филиал? Действие необратимо, если нет связанных отделов.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-app-border-accent bg-app-surface-2 px-6 py-4">
        <AlertDialogCancel
          disabled={mutation.isPending}
          className="h-9 rounded-full border-app-border-accent bg-transparent px-4 text-[13px] font-medium text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
        >
          Отмена
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={mutation.isPending}
          className="h-9 rounded-full border border-red-500/30 bg-red-500/20 px-4 text-[13px] font-medium text-red-400 hover:bg-red-500/30"
        >
          {mutation.isPending ? 'Удаление...' : 'Удалить'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
