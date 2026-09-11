'use client'

import { Modal, ModalHeader, ModalActions, DarkInput, DarkTextarea } from '@/components/custom-ui'
import { positionsLabelCls } from '@/components/ui/positions-multi-select'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck } from 'lucide-react'

type RoleRbacFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  name: string
  description: string
  isActive: boolean
  canAccessAdminUi: boolean
  isSaving: boolean
  onClose: () => void
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onIsActiveChange: (value: boolean) => void
  onCanAccessAdminUiChange: (value: boolean) => void
  onSave: () => void
}

export const RoleRbacFormModal = ({
  open,
  mode,
  name,
  description,
  isActive,
  canAccessAdminUi,
  isSaving,
  onClose,
  onNameChange,
  onDescriptionChange,
  onIsActiveChange,
  onCanAccessAdminUiChange,
  onSave,
}: RoleRbacFormModalProps) => (
  <Modal open={open} onClose={() => !isSaving && onClose()}>
    <ModalHeader
      icon={ShieldCheck}
      title={mode === 'create' ? 'Новая роль' : 'Редактирование роли'}
      subtitle={
        mode === 'create'
          ? 'Создание роли и настройка матрицы прав'
          : 'Изменение данных роли и её статуса'
      }
      onClose={() => !isSaving && onClose()}
    />
    <div className="flex flex-col gap-5">
      <NameField name={name} onNameChange={onNameChange} />
      <div>
        <label className={positionsLabelCls}>Описание</label>
        <DarkTextarea
          placeholder="Кратко, для чего роль"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-app-border-accent px-4 py-3">
        <p className="text-sm text-app-text-muted">Доступ в админ часть</p>
        <Switch
          checked={canAccessAdminUi}
          onCheckedChange={onCanAccessAdminUiChange}
          aria-label="переключить доступ в админ часть"
        />
      </div>
      {mode === 'edit' && (
        <div className="flex items-center justify-between rounded-2xl border border-app-border-accent px-4 py-3">
          <p className="text-sm text-app-text-muted">Роль активна</p>
          <Switch
            checked={isActive}
            onCheckedChange={onIsActiveChange}
            aria-label="переключить активность роли"
          />
        </div>
      )}
    </div>
    <ModalActions
      onCancel={() => !isSaving && onClose()}
      onConfirm={onSave}
      confirmLabel={
        mode === 'create'
          ? isSaving
            ? 'Создание...'
            : 'Создать роль'
          : isSaving
            ? 'Сохранение...'
            : 'Сохранить'
      }
    />
  </Modal>
)

const NameField = ({
  name,
  onNameChange,
}: Pick<RoleRbacFormModalProps, 'name' | 'onNameChange'>) => (
  <div>
    <label className={positionsLabelCls}>
      Название <span className="text-brand-accent">*</span>
    </label>
    <DarkInput
      placeholder="Например, менеджер отдела"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
    />
  </div>
)
