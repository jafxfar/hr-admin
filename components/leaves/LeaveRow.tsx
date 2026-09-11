import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableBodyRow, DataTableCell, DataTableStatus } from '@/components/ui/data-table'
import { Vacation, VacationType, VacationStatus } from '@/types/vacation'
import type { Employee } from '@/types/employees'
import { Trash2, Pencil, Check } from 'lucide-react'
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

const VACATION_TYPE_LABELS: Record<VacationType, string> = {
  [VacationType.ANNUAL]: 'Оплачиваемый',
  [VacationType.SICK]: 'Больничный',
  [VacationType.UNPAID]: 'Неоплачиваемый',
  [VacationType.OTHER]: 'Другое',
}

const VACATION_STATUS_STYLES: Record<VacationStatus, { className: string; dotClassName: string; label: string }> = {
  [VacationStatus.PENDING]: {
    className: 'bg-amber-500/10 text-amber-400',
    dotClassName: 'bg-amber-400',
    label: 'На рассмотрении',
  },
  [VacationStatus.APPROVED]: {
    className: 'bg-emerald-500/10 text-emerald-400',
    dotClassName: 'bg-emerald-400',
    label: 'Одобрено',
  },
  [VacationStatus.REJECTED]: {
    className: 'bg-red-500/10 text-red-400',
    dotClassName: 'bg-red-400',
    label: 'Отклонено',
  },
  [VacationStatus.CANCALLED]: {
    className: 'bg-app-surface-2 text-app-text-muted',
    dotClassName: 'bg-app-text-muted/50',
    label: 'Отменено',
  },
}

interface LeaveRowProps {
  leave: Vacation
  employee?: Employee
  onRowClick: (leave: Vacation) => void
  onDelete?: (leave: Vacation) => void
  onStatusUpdate?: (leave: Vacation, status: VacationStatus) => void
  isUpdating?: boolean
}

function getDaysCount(start: string, end: string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function pluralDays(n: number): string {
  if (n === 1) return '1 день'
  if (n >= 2 && n <= 4) return `${n} дня`
  return `${n} дней`
}

function getInitials(emp?: Employee): string {
  if (!emp) return '?'
  const l = emp.properties?.last_name?.[0] ?? ''
  const f = emp.properties?.first_name?.[0] ?? ''
  return (l + f).toUpperCase() || emp.email[0].toUpperCase()
}

function getFullName(emp?: Employee): string {
  if (!emp) return 'Неизвестный сотрудник'
  const parts = [emp.properties?.last_name, emp.properties?.first_name, emp.properties?.middle_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : emp.email
}

export const LeaveRow: React.FC<LeaveRowProps> = ({ leave, employee, onRowClick, onDelete, onStatusUpdate, isUpdating }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedStatus, setEditedStatus] = useState<VacationStatus>(leave.status)
  const days = getDaysCount(leave.started_at, leave.ended_at)
  const status = VACATION_STATUS_STYLES[leave.status] ?? {
    className: 'bg-app-surface-2 text-app-text-muted',
    dotClassName: 'bg-app-text-muted/50',
    label: leave.status,
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditedStatus(leave.status)
    setIsEditing(true)
  }

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStatusUpdate?.(leave, editedStatus)
    setIsEditing(false)
  }

  return (
    <>
      <DataTableBodyRow onClick={() => !isEditing && onRowClick(leave)}>
        {/* Employee */}
        <DataTableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-app-surface-0 text-xs font-medium text-app-text-muted">
                {getInitials(employee)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-app-text">
                {getFullName(employee)}
              </div>
              <div className="text-[12px] text-app-text-muted">
                {employee?.positions?.[0]?.title ?? '—'}
              </div>
            </div>
          </div>
        </DataTableCell>

        {/* Type */}
        <DataTableCell>
          <span className="text-sm text-app-text">
            {VACATION_TYPE_LABELS[leave.type] ?? leave.type}
          </span>
        </DataTableCell>

        {/* Duration */}
        <DataTableCell>
          <span className="text-sm text-app-text-muted">
            {new Date(leave.started_at).toLocaleDateString('ru-RU')} — {new Date(leave.ended_at).toLocaleDateString('ru-RU')}
          </span>
        </DataTableCell>

        {/* Days */}
        <DataTableCell>
          <span className="text-sm text-app-text">{pluralDays(days)}</span>
        </DataTableCell>

        {/* Status */}
        <DataTableCell onClick={(e) => isEditing && e.stopPropagation()}>
          {isEditing ? (
            <Select value={editedStatus} onValueChange={(v) => setEditedStatus(v as VacationStatus)}>
              <SelectTrigger
                className="h-8 min-w-37.5 rounded-full border-app-border bg-app-surface-1 px-3 text-[12px] text-app-text hover:bg-app-surface-2 focus:border-brand-accent/50 focus:ring-brand-accent/30"
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(VacationStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {VACATION_STATUS_STYLES[s]?.label ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <DataTableStatus className={status.className} dotClassName={status.dotClassName}>
              {status.label}
            </DataTableStatus>
          )}
        </DataTableCell>

        {/* Actions */}
        <DataTableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            {onStatusUpdate && (
              isEditing ? (
                <Button
                  size="sm"
                  onClick={handleConfirmClick}
                  disabled={isUpdating}
                  className="bg-brand-accent text-brand-accent-on hover:bg-brand rounded-full px-4 text-xs font-bold shadow-[0_4px_10px_-2px_rgb(var(--theme-primary-rgb) / 0.35)] active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Подтвердить
                </Button>
              ) : (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={handleEditClick}
                  className="text-app-text-muted hover:text-app-text hover:bg-app-surface-2 rounded-full"
                  title="Изменить статус"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )
            )}
            {onDelete && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); setConfirmOpen(true) }}
                className="text-app-text-muted hover:text-[#F87171] hover:bg-[#F87171]/10 rounded-full"
                title="Удалить отпуск"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DataTableCell>
      </DataTableBodyRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отпуск?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить запись об отпуске сотрудника{' '}
              <span className="font-medium">{getFullName(employee)}</span>? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
              onClick={() => onDelete?.(leave)}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
