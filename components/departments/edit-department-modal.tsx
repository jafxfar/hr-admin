'use client'

import type { ReactNode } from 'react'
import type { Department } from '@/types/departments'
import type { Employee } from '@/types/employees'
import { DarkInput } from '@/components/custom-ui'
import { PositionsMultiSelect } from '@/components/ui/positions-multi-select'
import { InlineSelect } from '@/components/org-structure/inline-select'
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

export type DepartmentEditHeadVariant = 'list' | 'detail'

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'
const selectTriggerCls = 'border border-app-border-accent'

type EditDepartmentModalProps = {
  open: boolean
  onClose: () => void
  excludeDepartmentId?: number
  name: string
  onNameChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  parentId: string
  onParentIdChange: (value: string) => void
  headUserId: string
  onHeadUserIdChange: (value: string) => void
  allowedPositionIds: number[]
  onAllowedPositionIdsChange: (ids: number[]) => void
  branchId: string
  onBranchIdChange: (value: string) => void
  branchesEnabled: boolean
  allDepartments: Department[]
  allEmployees: Employee[]
  branchSelectOptions: { value: string; label: string }[]
  onConfirm: () => void
  isUpdating: boolean
  headVariant?: DepartmentEditHeadVariant
}

const buildHeadOptions = (
  allEmployees: Employee[],
  variant: DepartmentEditHeadVariant,
) => {
  const emptyOption =
    variant === 'list'
      ? { value: 'none', label: 'Не назначен' }
      : { value: '', label: '— Не назначен —' }

  return [
    emptyOption,
    ...allEmployees.map((emp) => ({
      value: String(emp.id),
      label:
        [emp.properties?.first_name, emp.properties?.last_name].filter(Boolean).join(' ') ||
        emp.email,
    })),
  ]
}

export const EditDepartmentModal = ({
  open,
  onClose,
  excludeDepartmentId,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  parentId,
  onParentIdChange,
  headUserId,
  onHeadUserIdChange,
  allowedPositionIds,
  onAllowedPositionIdsChange,
  branchId,
  onBranchIdChange,
  branchesEnabled,
  allDepartments,
  allEmployees,
  branchSelectOptions,
  onConfirm,
  isUpdating,
  headVariant = 'list',
}: EditDepartmentModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(next) => {
      if (!next) onClose()
    }}
  >
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-app-surface-0 border border-app-border-accent text-app-text">
      <DialogHeader>
        <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
          Редактировать отдел
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <Field label="Название" required>
          <DarkInput
            placeholder="Название отдела"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </Field>

        <Field label="Описание">
          <Textarea
            placeholder="Описание отдела..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={textareaCls}
          />
        </Field>

        <Field label="Родительский отдел">
          <InlineSelect
            value={parentId}
            onChange={onParentIdChange}
            placeholder="Без родительского отдела"
            triggerClassName={selectTriggerCls}
            options={[
              { value: '', label: 'Без родительского отдела' },
              ...allDepartments
                .filter((d) => d.id !== excludeDepartmentId)
                .map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />
        </Field>

        <Field label="Руководитель">
          <InlineSelect
            value={headUserId}
            onChange={onHeadUserIdChange}
            placeholder="Выберите сотрудника"
            triggerClassName={selectTriggerCls}
            options={buildHeadOptions(allEmployees, headVariant)}
          />
        </Field>

        <Field label="Доступные должности">
          <PositionsMultiSelect
            value={allowedPositionIds}
            onChange={onAllowedPositionIdsChange}
            placeholder="Выберите должности для отдела"
            bordered
          />
        </Field>

        {branchesEnabled ? (
          <Field label="Филиал">
            <InlineSelect
              value={branchId}
              onChange={onBranchIdChange}
              placeholder="Выберите филиал"
              triggerClassName={selectTriggerCls}
              options={branchSelectOptions}
            />
          </Field>
        ) : null}
      </div>

      <DialogFooter className="border-t border-app-border-accent pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isUpdating}
          className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isUpdating}
          className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
        >
          {isUpdating ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const Field = ({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) => (
  <div className="space-y-2">
    <Label className={labelCls}>
      {label} {required ? <span className="text-brand-accent">*</span> : null}
    </Label>
    {children}
  </div>
)
