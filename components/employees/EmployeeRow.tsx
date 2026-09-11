import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableBodyRow, DataTableCell } from '@/components/ui/data-table'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Eye, MoreVertical, Pencil, RotateCcw, Trash2, UserMinus } from 'lucide-react'
import type { Employee } from '@/types/employees'
import {
  useDeleteEmployeeMutation,
  useReinstateEmployeeMutation,
  useRestoreEmployeeMutation,
} from '@/hooks/use-employees'
import { buildFileUrl } from '@/lib/files'
import { formatEmploymentStatus, formatProfileDate } from '@/lib/employee-profile-format'
import { useToast } from '@/hooks/use-toast'
import { EmployeeTerminateDialog } from './employee-terminate-dialog'

const resolveEmployeeBranchLabel = (employee: Employee): string | null => {
  const fromRoot = employee.branch?.name?.trim()
  if (fromRoot) return fromRoot
  const pd = employee.position_department
  const fromPd = pd && typeof pd === 'object' && 'branch' in pd ? pd.branch?.name?.trim() : ''
  if (fromPd) return fromPd
  const current =
    employee.position_history?.find((h) => h.is_current) ?? employee.position_history?.[0]
  const fromHist = current?.branch?.name?.trim()
  if (fromHist) return fromHist
  return null
}

interface EmployeeRowProps {
  employee: Employee
  branchesEnabled: boolean
  isArchiveMode?: boolean
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, branchesEnabled, isArchiveMode = false }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [terminateOpen, setTerminateOpen] = useState(false)
  const [restoreOpen, setRestoreOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployeeMutation()
  const { mutate: reinstateEmployee, isPending: isReinstating } = useReinstateEmployeeMutation()
  const { mutate: restoreEmployee, isPending: isRestoring } = useRestoreEmployeeMutation()
  const isRestorePending = isReinstating || isRestoring

  const firstName = employee.properties?.first_name
  const lastName = employee.properties?.last_name
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || employee.email
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('')
  const photoUrl = employee.properties?.profile_photo_url
    ? buildFileUrl(employee.properties.profile_photo_url)
    : undefined

  const positionTitle = employee.position?.title ?? employee.positions?.[0]?.title ?? null
  const positionDescription = employee.position?.description ?? employee.positions?.[0]?.description ?? null
  const departmentName = employee.department?.name ?? null
  const branchLabel = branchesEnabled ? resolveEmployeeBranchLabel(employee) : null
  const joinDate = new Date(employee.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const employmentStatus = employee.employment_status
  const isTerminated = employmentStatus === 'terminated'
  const isDeleted = employmentStatus === 'deleted'
  const statusLabel = formatEmploymentStatus(employmentStatus)
  const terminationDateLabel = formatProfileDate(employee.termination?.termination_date)
  const showStatusMeta = isArchiveMode && (isTerminated || isDeleted)
  const canRestore = isTerminated || isDeleted
  const canDelete = !isDeleted

  const handleDelete = () => {
    deleteEmployee(employee.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        toast({ title: 'Сотрудник удалён' })
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Не удалось удалить сотрудника',
        })
      },
    })
  }

  const handleRestore = () => {
    const onSuccess = () => {
      setRestoreOpen(false)
      toast({ title: 'Сотрудник восстановлен' })
    }
    const onError = () => {
      toast({
        variant: 'destructive',
        title: 'Не удалось восстановить сотрудника',
      })
    }

    if (isTerminated) {
      reinstateEmployee(employee.id, { onSuccess, onError })
      return
    }

    if (isDeleted) {
      restoreEmployee(employee.id, { onSuccess, onError })
    }
  }

  return (
    <>
      <DataTableBodyRow onClick={() => router.push(`/employees/${employee.id}`)}>
        {/* Employee */}
        <DataTableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={photoUrl ?? '/default-avatar.png'} alt={fullName} className="object-cover" />
              <AvatarFallback className="bg-app-surface-0 text-app-text-muted text-xs font-medium">
                {initials || employee.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="text-sm font-medium text-app-text">{fullName}</span>
              {showStatusMeta ? (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400">
                    {statusLabel}
                  </span>
                  {isTerminated && terminationDateLabel ? (
                    <span className="text-xs font-medium text-app-text-muted">{terminationDateLabel}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </DataTableCell>

        {/* Position */}
        <DataTableCell>
          <div className="text-app-text font-medium text-sm">{positionTitle ?? '—'}</div>
          {positionDescription && (
            <div className="mt-1">
              <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full uppercase font-bold tracking-wider">
                {positionDescription}
              </span>
            </div>
          )}
        </DataTableCell>

        {/* Department */}
        <DataTableCell>
          <div className="text-app-text-muted text-sm">{departmentName ?? '—'}</div>
        </DataTableCell>

        {branchesEnabled ? (
          <DataTableCell>
            <div className="text-app-text-muted text-sm">{branchLabel ?? '—'}</div>
          </DataTableCell>
        ) : null}

        {/* Email */}
        <DataTableCell>
          <div className="text-app-text-muted text-sm">{employee.email}</div>
        </DataTableCell>

        {/* Join date */}
        <DataTableCell>
          <div className="text-app-text-muted text-sm">{joinDate}</div>
        </DataTableCell>

        {/* Actions */}
        <DataTableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end">
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
              <DropdownMenuContent
                align="end"
                className="min-w-35 rounded-2xl border-app-border-accent bg-app-surface-0 text-app-text"
              >
                <DropdownMenuItem
                  onClick={() => router.push(`/employees/${employee.id}/view`)}
                  className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                >
                  <Eye className="h-3.5 w-3.5 text-app-text-muted" />
                  Просмотр
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/employees/${employee.id}`)}
                  className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                >
                  <Pencil className="h-3.5 w-3.5 text-app-text-muted" />
                  Редактировать
                </DropdownMenuItem>
                {isArchiveMode ? (
                  canRestore ? (
                    <DropdownMenuItem
                      onClick={() => setRestoreOpen(true)}
                      className="cursor-pointer gap-2 rounded-2xl text-sm hover:bg-app-surface-3 focus:bg-app-surface-3"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-app-text-muted" />
                      Восстановить
                    </DropdownMenuItem>
                  ) : null
                ) : (
                  <DropdownMenuItem
                    onClick={() => setTerminateOpen(true)}
                    className="cursor-pointer gap-2 rounded-2xl text-sm text-red-400 hover:bg-app-surface-3 focus:bg-app-surface-3"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                    Уволить
                  </DropdownMenuItem>
                )}
                {canDelete ? (
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="cursor-pointer gap-2 rounded-2xl text-sm text-red-400 hover:bg-app-surface-3 focus:bg-app-surface-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Удалить
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DataTableCell>
      </DataTableBodyRow>

      {!isArchiveMode ? (
        <EmployeeTerminateDialog
          open={terminateOpen}
          employeeId={employee.id}
          employeeName={fullName}
          onOpenChange={setTerminateOpen}
        />
      ) : null}

      {isArchiveMode ? (
        <AlertDialog open={restoreOpen} onOpenChange={setRestoreOpen}>
          <AlertDialogContent className="bg-app-surface-0 border border-app-border rounded-3xl max-w-sm p-0 gap-0 overflow-hidden">
            <AlertDialogHeader className="px-6 pt-6 pb-4">
              <AlertDialogTitle className="text-app-text font-bold text-[15px]">
                Восстановить сотрудника?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-app-text-muted text-[13px] mt-1">
                <span className="font-medium text-app-text">{fullName}</span> будет возвращён в активный
                список.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row justify-end gap-2 px-6 py-4 border-t border-app-border bg-app-surface-0">
              <AlertDialogCancel
                disabled={isRestorePending}
                className="h-9 px-4 text-[13px] font-medium rounded-full border border-app-border bg-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface-1"
              >
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleRestore()
                }}
                disabled={isRestorePending}
                className="h-9 px-4 text-[13px] font-medium rounded-full bg-brand-accent text-brand-accent-on hover:opacity-90 disabled:opacity-50"
              >
                {isRestorePending ? 'Восстановление...' : 'Восстановить'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-app-surface-0 border border-app-border rounded-3xl max-w-sm p-0 gap-0 overflow-hidden">
          <AlertDialogHeader className="px-6 pt-6 pb-4">
            <AlertDialogTitle className="text-app-text font-bold text-[15px]">
              Удалить сотрудника?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted text-[13px] mt-1">
              <span className="font-medium text-app-text">{fullName}</span> будет удалён без возможности
              восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 px-6 py-4 border-t border-app-border bg-app-surface-0">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-9 px-4 text-[13px] font-medium rounded-full border border-app-border bg-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface-1"
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="h-9 px-4 text-[13px] font-medium rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
