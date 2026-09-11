/**
 * Диалог назначения бизнес-роли сотруднику
 */

'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Check, Loader2 } from 'lucide-react'
import { BusinessRole } from '@/types/businnessRole'
import { useEmployees } from '@/hooks/use-employees'
import { Employee } from '@/types/employees'

interface AssignRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: BusinessRole | null
}

function getFullName(employee: Employee): string {
  const props = employee.properties ?? {}
  const { first_name, last_name, middle_name } = props
  return [last_name, first_name, middle_name].filter(Boolean).join(' ') || employee.email
}

function getInitials(employee: Employee): string {
  const props = employee.properties ?? {}
  const { first_name, last_name } = props
  return [last_name, first_name]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join('') || employee.email[0].toUpperCase()
}

export function AssignRoleDialog({ open, onOpenChange, role }: AssignRoleDialogProps) {
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const { data: employeesData, isLoading: loadingEmployees } = useEmployees(1, 20)

  const employees = employeesData?.items ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((e) => {
      const name = getFullName(e).toLowerCase()
      return name.includes(q) || e.email.toLowerCase().includes(q)
    })
  }, [employees, search])


  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setSelectedEmployee(null)
      setSearch('')
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Назначить роль сотруднику</DialogTitle>
          <DialogDescription>
            Роль: <span className="font-medium text-app-text">{role?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
            <Input
              placeholder="Поиск сотрудника по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-app-surface-1 border border-app-border-accent text-[13px]"
            />
          </div>

          {/* Employee list */}
          <div className="max-h-64 overflow-y-auto rounded-lg border border-app-border-accent bg-app-surface-1">
            {loadingEmployees ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-app-text-muted" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-app-text-muted">
                Сотрудники не найдены
              </div>
            ) : (
              filtered.map((employee) => {
                const isSelected = selectedEmployee?.id === employee.id
                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => setSelectedEmployee(isSelected ? null : employee)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-app-border-accent last:border-0 ${
                      isSelected
                        ? 'bg-brand-accent/10 hover:bg-brand-accent/15'
                        : 'hover:bg-app-surface-2'
                    }`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-app-surface-2 text-app-text text-xs font-medium">
                        {getInitials(employee)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-app-text truncate">
                        {getFullName(employee)}
                      </p>
                      <p className="text-[12px] text-app-text-muted truncate">{employee.email}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>

          {selectedEmployee && (
            <p className="text-[12px] text-app-text-muted">
              Выбран:{' '}
              <span className="font-medium text-app-text">
                {getFullName(selectedEmployee)}
              </span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
