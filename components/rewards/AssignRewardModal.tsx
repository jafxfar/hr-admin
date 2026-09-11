'use client'

import React, { useState } from 'react'
import { Search, UserSearch, X, Award } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePickerField } from '@/components/custom-ui'
import { useAssignewardMutation, useRewards } from '@/hooks/use-rewards'
import { useEmployees } from '@/hooks/use-employees'
import { buildFileUrl } from '@/lib/files'
import { getIconByName } from '@/lib/lucide-icons'
import type { Employee } from '@/types/employees'

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'

function normalizeLower(input: unknown): string {
  return typeof input === 'string' ? input.toLowerCase() : ''
}

function getFullName(emp: Employee): string {
  const parts = [emp.properties?.last_name, emp.properties?.first_name, emp.properties?.middle_name].filter(Boolean)
  const email = typeof emp.email === 'string' ? emp.email : ''
  return parts.length > 0 ? parts.join(' ') : email
}

function getInitials(emp: Employee): string {
  const last = emp.properties?.last_name?.[0] ?? ''
  const first = emp.properties?.first_name?.[0] ?? ''
  const email = typeof emp.email === 'string' ? emp.email : ''
  const initials = (last + first).toUpperCase()
  if (initials) return initials
  return email[0] ? email[0].toUpperCase() : ''
}

function getPhotoUrl(emp: Employee): string | null {
  const p = emp.properties?.profile_photo_url
  return p ? buildFileUrl(p) : null
}

interface AssignRewardModalProps {
  open: boolean
  onClose: () => void
  /** Pre-select a specific reward when opened from a card */
  preselectedRewardId?: number | null
}

export const AssignRewardModal: React.FC<AssignRewardModalProps> = ({
  open,
  onClose,
  preselectedRewardId,
}) => {
  const [rewardSearch, setRewardSearch] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [selectedRewardId, setSelectedRewardId] = useState<number | null>(preselectedRewardId ?? null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [awardDate, setAwardDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  const assignMutation = useAssignewardMutation()

  const { data: rewardsData } = useRewards(1, 20)
  const rewards = rewardsData?.items ?? []

  const { data: employeesData } = useEmployees(1, 20)
  const employees = employeesData?.items ?? []

  const rewardSearchLower = rewardSearch.toLowerCase()
  const employeeSearchLower = normalizeLower(employeeSearch)

  const filteredRewards = rewards.filter((r) =>
    normalizeLower(r.title).includes(rewardSearchLower),
  )

  const filteredEmployees = employees.filter((emp) => {
    const name = getFullName(emp).toLowerCase()
    const emailLower = normalizeLower(emp.email)
    return name.includes(employeeSearchLower) || emailLower.includes(employeeSearchLower)
  })

  const selectedReward = rewards.find((r) => r.id === selectedRewardId) ?? null
  const canAssign = Boolean(selectedRewardId && selectedEmployee)

  const handleClose = () => {
    setRewardSearch('')
    setEmployeeSearch('')
    setSelectedRewardId(preselectedRewardId ?? null)
    setSelectedEmployee(null)
    setNote('')
    setAwardDate(new Date().toISOString().slice(0, 10))
    onClose()
  }

  const handleAssign = () => {
    if (!selectedRewardId || !selectedEmployee) return
    assignMutation.mutate(
      { reward_id: selectedRewardId, user_ids: [selectedEmployee.id] },
      {
        onSuccess: () => {
          handleClose()
        },
      },
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            Назначить награду
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className={labelCls}>Выберите награду</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-text-muted" />
              <input
                type="text"
                value={rewardSearch}
                onChange={(e) => setRewardSearch(e.target.value)}
                placeholder="Найти награду..."
                className="h-12 w-full rounded-3xl border border-app-border-accent bg-app-surface-1 pl-11 pr-4 text-sm text-app-text placeholder:text-app-text-muted/70 outline-none transition-shadow focus:shadow-[0_0_0_1px_rgb(var(--theme-primary-rgb)/0.4)]"
              />
            </div>
            <div className="mt-1 flex max-h-24 flex-wrap gap-2 overflow-y-auto">
              {filteredRewards.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRewardId(r.id === selectedRewardId ? null : r.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedRewardId === r.id
                      ? 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                      : 'border-app-border-accent bg-app-surface-0 text-app-text-muted hover:bg-app-surface-1 hover:text-app-text'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
            {selectedReward && (
              <div className="mt-1 flex items-center gap-3 rounded-2xl border border-app-border-accent bg-app-surface-0 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-accent/10">
                  {selectedReward.image_url ? (
                    <img
                      src={buildFileUrl(selectedReward.image_url)}
                      alt={selectedReward.title}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : selectedReward.icon_name && getIconByName(selectedReward.icon_name) ? (
                    React.createElement(getIconByName(selectedReward.icon_name)!, {
                      className: 'w-4 h-4 text-brand-accent',
                    })
                  ) : (
                    <Award className="h-4 w-4 text-brand-accent" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-app-text">{selectedReward.title}</p>
                  <p className="truncate text-[0.65rem] text-app-text-muted">{selectedReward.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRewardId(null)}
                  aria-label="Снять выбор награды"
                  className="shrink-0 text-app-text-muted transition-colors hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Выберите получателя</Label>
            <div className="relative">
              <UserSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-text-muted" />
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Поиск по сотрудникам..."
                className="h-12 w-full rounded-3xl border border-app-border-accent bg-app-surface-1 pl-11 pr-4 text-sm text-app-text placeholder:text-app-text-muted/70 outline-none transition-shadow focus:shadow-[0_0_0_1px_rgb(var(--theme-primary-rgb)/0.4)]"
              />
            </div>
            {employeeSearch && !selectedEmployee && (
              <div className="mt-1 max-h-44 overflow-y-auto rounded-2xl border border-app-border-accent bg-app-surface-0">
                {filteredEmployees.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-app-text-muted">Не найдено</p>
                ) : (
                  filteredEmployees.slice(0, 8).map((emp) => {
                    const photo = getPhotoUrl(emp)
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          setSelectedEmployee(emp)
                          setEmployeeSearch('')
                        }}
                        className="flex w-full items-center gap-3 border-b border-app-border-accent px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-app-surface-1"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-app-surface-1 text-xs font-bold text-app-text-muted">
                          {photo ? (
                            <img src={photo} alt={getFullName(emp)} className="h-full w-full object-cover" />
                          ) : (
                            getInitials(emp)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-app-text">{getFullName(emp)}</p>
                          <p className="truncate text-xs text-app-text-muted">
                            {typeof emp.email === 'string' ? emp.email : ''}
                          </p>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            )}
            {selectedEmployee && (
              <div className="mt-1 flex items-center gap-3 rounded-2xl border border-app-border-accent bg-app-surface-0 p-3">
                {(() => {
                  const photo = getPhotoUrl(selectedEmployee)
                  return (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-app-surface-1 text-xs font-bold text-app-text-muted">
                      {photo ? (
                        <img
                          src={photo}
                          alt={getFullName(selectedEmployee)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(selectedEmployee)
                      )}
                    </div>
                  )
                })()}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-app-text">{getFullName(selectedEmployee)}</p>
                  <p className="text-[0.65rem] uppercase tracking-wider text-app-text-muted">
                    {selectedEmployee.positions?.[0]?.title ?? selectedEmployee.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEmployee(null)}
                  aria-label="Снять выбор сотрудника"
                  className="shrink-0 text-app-text-muted transition-colors hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Дата вручения</Label>
            <DatePickerField value={awardDate} onChange={(v) => setAwardDate(v)} />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Сообщение признания</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                selectedEmployee
                  ? `Напишите личное сообщение для ${selectedEmployee.properties?.first_name ?? 'сотрудника'}...`
                  : 'Напишите личное сообщение...'
              }
              className={textareaCls}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={assignMutation.isPending}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!canAssign || assignMutation.isPending}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {assignMutation.isPending ? 'Назначение...' : 'Назначить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
