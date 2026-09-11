'use client'

import { Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalActions, DarkInput, DarkTextarea } from '@/components/custom-ui'
import { PositionsMultiSelect, positionsLabelCls } from '@/components/ui/positions-multi-select'
import { IconPicker } from '@/components/rewards/IconPicker'
import { useCreateDepartmentMutation } from '@/hooks/use-departments'
import { useToast } from '@/hooks/use-toast'
import { useEmployees } from '@/hooks/use-employees'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useBranchesList } from '@/hooks/use-branches'
import { InlineSelect } from './inline-select'

interface CreateDepartmentModalProps {
  parentId: number | null
  onClose: () => void
  defaultBranchId?: number
}

export function CreateDepartmentModal({ parentId, onClose, defaultBranchId }: CreateDepartmentModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [headUserId, setHeadUserId] = useState<string>('')
  const [allowedPositionIds, setAllowedPositionIds] = useState<number[]>([])
  const [branchId, setBranchId] = useState(defaultBranchId != null ? String(defaultBranchId) : '')
  const [icon, setIcon] = useState('Building2')

  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { data: branchesData } = useBranchesList('', 1, 20, false, branchesEnabled)
  const branchOptions = (branchesData?.items ?? []).map((b) => ({
    value: String(b.id),
    label: b.name,
  }))

  const { data: employeesData } = useEmployees(1, 20)
  const employees = employeesData?.items ?? []
  const createMutation = useCreateDepartmentMutation()
  const { toast } = useToast()

  const reset = () => {
    setName('')
    setDescription('')
    setHeadUserId('')
    setAllowedPositionIds([])
    setBranchId(defaultBranchId != null ? String(defaultBranchId) : '')
    setIcon('Building2')
  }

  useEffect(() => {
    if (defaultBranchId == null) return
    setBranchId(String(defaultBranchId))
  }, [defaultBranchId])

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название отдела',
      })
      return
    }
    if (branchesEnabled && !branchId) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Выберите филиал',
      })
      return
    }
    createMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        parent_id: parentId ?? 0,
        head_user_id: headUserId ? Number(headUserId) : 0,
        icon: icon || null,
        allowed_position_ids: allowedPositionIds.length > 0 ? allowedPositionIds : undefined,
        ...(branchesEnabled && branchId ? { branch_id: Number(branchId) } : {}),
      },
      { onSuccess: handleClose }
    )
  }

  const employeeOptions = employees.map((emp) => {
    const firstName = emp.properties?.first_name ?? ''
    const lastName = emp.properties?.last_name ?? ''
    const fullName = [lastName, firstName].filter(Boolean).join(' ') || emp.email
    return { value: String(emp.id), label: fullName }
  })

  return (
    <Modal open onClose={handleClose} panelClassName="max-h-[90vh] overflow-y-auto">
      <ModalHeader icon={Building2} title="Новый отдел" subtitle="Создание подразделения" onClose={handleClose} />
      <div className="flex flex-col gap-5">
        <div>
          <label className={positionsLabelCls}>Название <span style={{ color: 'var(--brand-accent)' }}>*</span></label>
          <DarkInput
            placeholder="Введите название отдела"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={positionsLabelCls}>Описание</label>
          <DarkTextarea
            placeholder="Краткое описание отдела и его функций..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className={positionsLabelCls}>Иконка</label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>
        <div>
          <label className={positionsLabelCls}>Руководитель</label>
          <InlineSelect
            value={headUserId}
            onChange={setHeadUserId}
            placeholder="Выберите сотрудника"
            options={employeeOptions}
          />
        </div>
        <div>
          <label className={positionsLabelCls}>Доступные должности</label>
          <PositionsMultiSelect
            value={allowedPositionIds}
            onChange={setAllowedPositionIds}
            placeholder="Выберите должности для отдела"
          />
        </div>
        {branchesEnabled ? (
          <div>
            <label className={positionsLabelCls}>
              Филиал <span className="text-brand-accent">*</span>
            </label>
            <InlineSelect
              value={branchId}
              onChange={setBranchId}
              placeholder="Выберите филиал"
              options={branchOptions}
            />
          </div>
        ) : null}
      </div>
      <ModalActions
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmLabel={createMutation.isPending ? 'Создание...' : 'Создать отдел'}
      />
    </Modal>
  )
}
