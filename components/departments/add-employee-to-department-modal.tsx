'use client'

import type { ReactNode, RefObject } from 'react'
import { UserPlus } from 'lucide-react'
import { AddEmployeeFileField } from '@/components/departments/add-employee-file-field'
import type { Employee } from '@/types/employees'
import type { Positions } from '@/types/positions'
import {
  Modal,
  ModalHeader,
  ModalActions,
  DarkInput,
  DarkTextarea,
  DarkSearchableSelect,
} from '@/components/custom-ui'
import { positionsLabelCls } from '@/components/ui/positions-multi-select'
import { InlineSelect } from '@/components/org-structure/inline-select'
import { employeeSelectLabel } from '@/components/departments/department-assign-utils'

type AddEmployeeToDepartmentModalProps = {
  open: boolean
  onClose: () => void
  addUserId: string
  onAddUserIdChange: (value: string) => void
  addUserSearch: string
  onAddUserSearchChange: (value: string) => void
  addUserSearchItems: Employee[]
  isAddUserSearchLoading: boolean
  addPositionId: string
  onAddPositionIdChange: (value: string) => void
  deptPositions: Positions[]
  deptPositionsLoading: boolean
  addManagerId: string
  onAddManagerIdChange: (value: string) => void
  managerCandidates: Employee[]
  addPositionChangeReason: string
  onAddPositionChangeReasonChange: (value: string) => void
  addPositionChangeBasisType: string
  onAddPositionChangeBasisTypeChange: (value: string) => void
  addPositionChangeBasisFilename: string
  addPositionChangeFileError: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileSelect: (file: File) => void
  assignMutation: { isPending: boolean }
  onConfirm: () => void
}

export const AddEmployeeToDepartmentModal = ({
  open,
  onClose,
  addUserId,
  onAddUserIdChange,
  addUserSearch,
  onAddUserSearchChange,
  addUserSearchItems,
  isAddUserSearchLoading,
  addPositionId,
  onAddPositionIdChange,
  deptPositions,
  deptPositionsLoading,
  addManagerId,
  onAddManagerIdChange,
  managerCandidates,
  addPositionChangeReason,
  onAddPositionChangeReasonChange,
  addPositionChangeBasisType,
  onAddPositionChangeBasisTypeChange,
  addPositionChangeBasisFilename,
  addPositionChangeFileError,
  fileInputRef,
  onFileSelect,
  assignMutation,
  onConfirm,
}: AddEmployeeToDepartmentModalProps) => {
  const isPending = assignMutation.isPending

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader
        icon={UserPlus}
        title="Добавить сотрудника в отдел"
        subtitle="Назначение должности и руководителя в этом отделе"
        onClose={onClose}
      />
      <div className="flex flex-col gap-5">
        <Field label="Сотрудник" required>
          <DarkSearchableSelect
            value={addUserId}
            onChange={onAddUserIdChange}
            searchValue={addUserSearch}
            onSearchChange={onAddUserSearchChange}
            options={addUserSearchItems.map((emp) => ({
              value: String(emp.id),
              label: employeeSelectLabel(emp),
            }))}
            isLoading={isAddUserSearchLoading}
            minSearchLength={2}
            placeholder="Найти и выбрать сотрудника"
            searchPlaceholder="Фамилия, имя или email..."
            emptyHint="Никого не найдено"
            disabled={isPending}
          />
        </Field>
        <Field label="Должность в отделе" required>
          {deptPositionsLoading ? (
            <p className="text-sm text-app-text-muted">Загрузка должностей...</p>
          ) : (
            <InlineSelect
              value={addPositionId}
              onChange={onAddPositionIdChange}
              options={[
                { value: '', label: '— Выберите должность —' },
                ...deptPositions.map((pos) => ({
                  value: String(pos.id),
                  label: pos.title,
                })),
              ]}
            />
          )}
          {!deptPositionsLoading && deptPositions.length === 0 ? (
            <p className="mt-1.5 text-xs text-app-text-muted">
              Для отдела не настроены должности. Добавьте их при редактировании отдела.
            </p>
          ) : null}
        </Field>
        <Field label="Непосредственный руководитель">
          <InlineSelect
            value={addManagerId}
            onChange={onAddManagerIdChange}
            options={[
              { value: '', label: '— Без руководителя —' },
              ...managerCandidates.map((emp) => ({
                value: String(emp.id),
                label: employeeSelectLabel(emp),
              })),
            ]}
          />
          <p className="mt-1.5 text-xs text-app-text-muted">
            Только сотрудники с текущей должностью в этом отделе (как в бэкенде).
          </p>
        </Field>
        <Field label="Причина смены">
          <DarkTextarea
            placeholder="Например: перевод сотрудника на основании приказа"
            value={addPositionChangeReason}
            onChange={(e) => onAddPositionChangeReasonChange(e.target.value)}
            rows={3}
          />
        </Field>
        <Field label="Тип основания">
          <DarkInput
            placeholder="Например: order"
            value={addPositionChangeBasisType}
            onChange={(e) => onAddPositionChangeBasisTypeChange(e.target.value)}
            disabled={isPending}
          />
        </Field>
        <AddEmployeeFileField
          fileInputRef={fileInputRef}
          filename={addPositionChangeBasisFilename}
          fileError={addPositionChangeFileError}
          disabled={isPending}
          onFileSelect={onFileSelect}
        />
      </div>
      <ModalActions
        onCancel={onClose}
        onConfirm={onConfirm}
        confirmLabel={isPending ? 'Сохранение...' : 'Добавить'}
      />
    </Modal>
  )
}

const Field = ({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) => (
  <div>
    <label className={positionsLabelCls}>
      {label}{' '}
      {required ? <span style={{ color: 'var(--brand-accent)' }}>*</span> : null}
    </label>
    {children}
  </div>
)
