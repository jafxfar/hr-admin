'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DatePickerField, DarkTextarea } from '@/components/custom-ui'
import { useMe, useTerminateEmployeeByIdMutation } from '@/hooks/use-employees'
import { useToast } from '@/hooks/use-toast'

type EmployeeTerminateDialogProps = {
  open: boolean
  employeeId: number
  employeeName: string
  onOpenChange: (open: boolean) => void
}

const MIN_REASON_LENGTH = 3

export const EmployeeTerminateDialog = ({
  open,
  employeeId,
  employeeName,
  onOpenChange,
}: EmployeeTerminateDialogProps) => {
  const { toast } = useToast()
  const { data: me } = useMe(open)
  const { mutate: terminateEmployee, isPending } = useTerminateEmployeeByIdMutation()

  const [terminationDate, setTerminationDate] = useState('')
  const [reason, setReason] = useState('')
  const [dateError, setDateError] = useState(false)
  const [reasonError, setReasonError] = useState(false)

  useEffect(() => {
    if (!open) return
    setTerminationDate('')
    setReason('')
    setDateError(false)
    setReasonError(false)
  }, [open])

  const handleOpenChange = (next: boolean) => {
    if (isPending) return
    onOpenChange(next)
  }

  const handleSubmit = () => {
    const trimmedReason = reason.trim()
    const hasDate = Boolean(terminationDate.trim())
    const hasReason = trimmedReason.length >= MIN_REASON_LENGTH

    setDateError(!hasDate)
    setReasonError(!hasReason)

    if (!hasDate || !hasReason) return

    if (!me?.id) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось определить текущего пользователя',
      })
      return
    }

    terminateEmployee(
      {
        id: employeeId,
        data: {
          termination_date: terminationDate,
          reason: trimmedReason,
          decided_by_user_id: me.id,
        },
      },
      {
        onSuccess: () => {
          toast({ title: 'Сотрудник уволен и перенесён в архив' })
          onOpenChange(false)
        },
        onError: () => {
          toast({
            variant: 'destructive',
            title: 'Не удалось уволить сотрудника',
          })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-app-surface-0 border border-app-border rounded-3xl max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-app-text font-bold text-[15px]">
            Уволить сотрудника?
          </DialogTitle>
          <DialogDescription className="text-app-text-muted text-[13px] mt-1">
            <span className="font-medium text-app-text">{employeeName}</span> будет переведён в статус
            «Уволен» и перенесён в архив.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-app-text-muted uppercase tracking-[0.15em]">
              Дата увольнения <span className="text-brand-accent">*</span>
            </Label>
            <DatePickerField
              value={terminationDate}
              onChange={(next) => {
                setDateError(false)
                setTerminationDate(next)
              }}
              hasError={dateError}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-app-text-muted uppercase tracking-[0.15em]">
              Причина <span className="text-brand-accent">*</span>
            </Label>
            <DarkTextarea
              placeholder="Например: увольнение по собственному желанию"
              rows={3}
              value={reason}
              hasError={reasonError}
              onChange={(e) => {
                setReasonError(false)
                setReason(e.target.value)
              }}
            />
            {reasonError ? (
              <p className="text-[12px] text-red-400">Минимум {MIN_REASON_LENGTH} символа</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 px-6 py-4 border-t border-app-border bg-app-surface-0 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
            className="h-9 px-4 text-[13px] font-medium rounded-full border border-app-border bg-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface-1"
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="h-9 px-4 text-[13px] font-medium rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? 'Увольнение...' : 'Уволить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
