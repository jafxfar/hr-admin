'use client'

import React, { useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SlidersHorizontal, Archive, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeaderFilterSelect, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'
import type { EmployeeFilterParams } from '@/api/employee'
import { useBranchesList } from '@/hooks/use-branches'
import { useSearchDepartments } from '@/hooks/use-departments'

export interface EmployeeFilterState extends EmployeeFilterParams {
  searchQuery: string
}

interface EmployeeFiltersProps {
  filters: EmployeeFilterState
  onChange: (filters: EmployeeFilterState) => void
  isArchiveMode: boolean
  onToggleArchive: () => void
  branchesEnabled?: boolean
}

const DEFAULT_FILTERS: EmployeeFilterState = {
  searchQuery: '',
  gender: undefined,
  upcoming_birthdays_days: undefined,
  has_contract: undefined,
  has_salary: undefined,
  has_schedule: undefined,
  has_documents: undefined,
  has_profile_photo: undefined,
  branch_ids: undefined,
  department_ids: undefined,
}

export { DEFAULT_FILTERS as defaultEmployeeFilters }

const BOOL_FILTERS: { key: keyof EmployeeFilterState; label: string }[] = [
  { key: 'has_contract',      label: 'Есть контракт'     },
  { key: 'has_salary',        label: 'Есть зарплата'     },
  { key: 'has_schedule',      label: 'Есть график'       },
  { key: 'has_documents',     label: 'Есть документы'    },
  { key: 'has_profile_photo', label: 'Есть фото профиля' },
]

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onChange,
  isArchiveMode,
  onToggleArchive,
  branchesEnabled = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [pending, setPending] = useState<EmployeeFilterState>(filters)

  const { data: branchesData } = useBranchesList('', 1, 100, false, branchesEnabled)
  const { data: departmentsData } = useSearchDepartments('', 1, 100)

  const branches = branchesData?.items ?? []
  const allDepartments = departmentsData?.items ?? []

  const pendingBranchId = pending.branch_ids?.[0] ?? null
  const pendingDepartmentId = pending.department_ids?.[0] ?? null

  const departmentOptions = useMemo(() => {
    if (!pendingBranchId) return allDepartments
    return allDepartments.filter((dept) => dept.branch_id === pendingBranchId)
  }, [allDepartments, pendingBranchId])

  const handlePendingBranchChange = (value: string) => {
    const branchId = value === 'all' ? undefined : Number(value)
    const nextBranchIds = branchId ? [branchId] : undefined

    let nextDepartmentIds = pending.department_ids
    if (branchId && pending.department_ids?.length) {
      const deptId = pending.department_ids[0]
      const dept = allDepartments.find((d) => d.id === deptId)
      if (dept && dept.branch_id != null && dept.branch_id !== branchId) {
        nextDepartmentIds = undefined
      }
    }

    setPending({ ...pending, branch_ids: nextBranchIds, department_ids: nextDepartmentIds })
  }

  const handlePendingDepartmentChange = (value: string) => {
    const departmentId = value === 'all' ? undefined : Number(value)
    setPending({
      ...pending,
      department_ids: departmentId ? [departmentId] : undefined,
    })
  }

  const openModal = () => {
    setPending(filters)
    setModalOpen(true)
  }

  const applyFilter = () => {
    onChange(pending)
    setModalOpen(false)
  }

  const resetFilter = () => {
    setPending({ ...DEFAULT_FILTERS, searchQuery: filters.searchQuery })
  }

  const activeFilterCount = [
    filters.gender,
    filters.upcoming_birthdays_days !== undefined,
    filters.has_contract !== undefined,
    filters.has_salary !== undefined,
    filters.has_schedule !== undefined,
    filters.has_documents !== undefined,
    filters.has_profile_photo !== undefined,
    Boolean(filters.branch_ids?.length),
    Boolean(filters.department_ids?.length),
  ].filter(Boolean).length

  return (
    <>
      <HeaderToolbarRow className="w-full min-w-0 flex-nowrap">
        <HeaderSearchInput
          value={filters.searchQuery}
          onChange={(value) => onChange({ ...filters, searchQuery: value })}
          placeholder="Поиск"
          widthClassName="min-w-0 flex-1 max-w-sm"
          clearable
        />

        <Select
          value={filters.gender ?? 'all'}
          onValueChange={(v) =>
            onChange({ ...filters, gender: v === 'all' ? undefined : (v as 'male' | 'female') })
          }
        >
          <HeaderFilterSelect active={Boolean(filters.gender)} className="w-36 shrink-0">
            <SelectValue />
          </HeaderFilterSelect>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="male">Мужской</SelectItem>
            <SelectItem value="female">Женский</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openModal}
            className={cn(
              'relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200',
              activeFilterCount > 0
                ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                : 'border border-transparent bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.14)] hover:text-app-text',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-brand-accent-on">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleArchive}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200',
              isArchiveMode
                ? 'border border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                : 'border border-transparent bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.14)] hover:text-app-text',
            )}
          >
            <Archive className="h-4 w-4" />
            Архив
          </button>
        </div>
      </HeaderToolbarRow>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-app-surface-0 border border-app-border sm:max-w-md p-0 gap-0 overflow-hidden rounded-3xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5">
            <DialogTitle className="text-app-text font-bold text-[15px] tracking-tight">
              Фильтр сотрудников
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">

            <div className="space-y-3">
              <Label className="text-xs font-bold text-app-text-muted uppercase tracking-[0.15em]">
                Расположение
              </Label>

              {branchesEnabled ? (
                <div className="space-y-1.5">
                  <span className="text-sm text-on-surface">Филиал</span>
                  <Select
                    value={pendingBranchId != null ? String(pendingBranchId) : 'all'}
                    onValueChange={handlePendingBranchChange}
                  >
                    <SelectTrigger className="h-10 w-full rounded-full border border-app-border-accent bg-app-surface-1 px-4 text-sm text-app-text-muted hover:bg-app-surface-2 focus:ring-1 focus:ring-brand-accent/30">
                      <SelectValue placeholder="Все филиалы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все филиалы</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <span className="text-sm text-on-surface">Отдел</span>
                <Select
                  value={pendingDepartmentId != null ? String(pendingDepartmentId) : 'all'}
                  onValueChange={handlePendingDepartmentChange}
                >
                  <SelectTrigger className="h-10 w-full rounded-full border border-app-border-accent bg-app-surface-1 px-4 text-sm text-app-text-muted hover:bg-app-surface-2 focus:ring-1 focus:ring-brand-accent/30">
                    <SelectValue placeholder="Все отделы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все отделы</SelectItem>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-app-text-muted uppercase tracking-[0.15em]">
                Ближайшие дни рождения
              </Label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  placeholder="Кол-во дней, напр. 7"
                  value={pending.upcoming_birthdays_days ?? ''}
                  onChange={(e) =>
                    setPending({
                      ...pending,
                      upcoming_birthdays_days: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-app-surface-0 border-none rounded-full py-2.5 px-4 text-sm text-app-text placeholder:text-app-text-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-accent/30 transition-all"
                />
                {pending.upcoming_birthdays_days !== undefined && (
                  <button
                    onClick={() => setPending({ ...pending, upcoming_birthdays_days: undefined })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-app-text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-app-text-muted uppercase tracking-[0.15em]">
                Данные сотрудника
              </Label>
              <div className="rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                {BOOL_FILTERS.map(({ key, label }) => {
                  const val = pending[key] as boolean | undefined
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between px-4 py-3 bg-app-surface-0 hover:bg-brand-accent/3 transition-colors"
                    >
                      <span className="text-sm text-on-surface">{label}</span>
                      <Select
                        value={val === undefined ? 'all' : val ? 'true' : 'false'}
                        onValueChange={(v) =>
                          setPending({ ...pending, [key]: v === 'all' ? undefined : v === 'true' })
                        }
                      >
                        <SelectTrigger className="h-8 w-20 text-xs bg-app-surface-1 border border-app-border-accent rounded-full text-app-text-muted hover:bg-app-surface-2 focus:ring-1 focus:ring-brand-accent/30 px-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все</SelectItem>
                          <SelectItem value="true" className="text-app-text-muted focus:bg-white/5 focus:text-brand-accent rounded-xl">Да</SelectItem>
                          <SelectItem value="false" className="text-app-text-muted focus:bg-white/5 focus:text-red-400 rounded-xl">Нет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-app-surface-0">
            <button
              onClick={resetFilter}
              className="text-sm font-medium text-app-text-muted hover:text-app-text transition-colors"
            >
              Сбросить
            </button>
            <button
              onClick={applyFilter}
              className="h-10 px-6 text-sm font-bold bg-brand-accent text-brand-accent-on rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgb(var(--theme-primary-rgb) / 0.2)]"
            >
              Применить
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
