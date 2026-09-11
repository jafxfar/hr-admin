'use client'

import type { Department } from '@/types/departments'
import { DarkInput } from '@/components/custom-ui'
import { PositionsMultiSelect } from '@/components/ui/positions-multi-select'
import { InlineSelect } from '@/components/org-structure/inline-select'
import { IconPicker } from '@/components/rewards/IconPicker'
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

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'
const selectTriggerCls = 'border border-app-border-accent'

type CreateDepartmentModalProps = {
  open: boolean
  onClose: () => void
  name: string
  onNameChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  parentId: string
  onParentIdChange: (value: string) => void
  allowedPositionIds: number[]
  onAllowedPositionIdsChange: (ids: number[]) => void
  branchId: string
  onBranchIdChange: (value: string) => void
  icon: string
  onIconChange: (value: string) => void
  branchesEnabled: boolean
  allDepartments: Department[]
  branchSelectOptions: { value: string; label: string }[]
  onConfirm: () => void
  isCreating: boolean
}

export const CreateDepartmentModal = ({
  open,
  onClose,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  parentId,
  onParentIdChange,
  allowedPositionIds,
  onAllowedPositionIdsChange,
  branchId,
  onBranchIdChange,
  icon,
  onIconChange,
  branchesEnabled,
  allDepartments,
  branchSelectOptions,
  onConfirm,
  isCreating,
}: CreateDepartmentModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(next) => {
      if (!next) onClose()
    }}
  >
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-app-surface-0 border border-app-border-accent text-app-text">
      <DialogHeader>
        <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
          Новый отдел
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label className={labelCls}>
            Название <span className="text-brand-accent">*</span>
          </Label>
          <DarkInput
            placeholder="Введите название отдела"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Описание</Label>
          <Textarea
            placeholder="Краткое описание отдела и его функций..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={textareaCls}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Иконка</Label>
          <IconPicker value={icon} onChange={onIconChange} />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Родительский отдел</Label>
          <InlineSelect
            value={parentId}
            onChange={onParentIdChange}
            placeholder="Без родительского отдела"
            triggerClassName={selectTriggerCls}
            options={[
              { value: '', label: 'Без родительского отдела' },
              ...allDepartments.map((d) => ({ value: String(d.id), label: d.name })),
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label className={labelCls}>Доступные должности</Label>
          <PositionsMultiSelect
            value={allowedPositionIds}
            onChange={onAllowedPositionIdsChange}
            placeholder="Выберите должности для отдела"
            bordered
          />
        </div>

        {branchesEnabled ? (
          <div className="space-y-2">
            <Label className={labelCls}>
              Филиал <span className="text-brand-accent">*</span>
            </Label>
            <InlineSelect
              value={branchId}
              onChange={onBranchIdChange}
              placeholder="Выберите филиал"
              triggerClassName={selectTriggerCls}
              options={branchSelectOptions}
            />
          </div>
        ) : null}
      </div>

      <DialogFooter className="border-t border-app-border-accent pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isCreating}
          className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isCreating}
          className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
        >
          {isCreating ? 'Создание...' : 'Создать отдел'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
