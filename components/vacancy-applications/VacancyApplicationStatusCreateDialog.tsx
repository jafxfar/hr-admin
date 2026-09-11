'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput } from '@/components/custom-ui'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { isValidStatusCode, normalizeStatusCode } from '@/lib/vacancy-application-status'
import type {
  CreateVacancyApplicationStatusDTO,
  UpdateVacancyApplicationStatusDTO,
  VacancyApplicationStatusItem,
} from '@/types/vacancyApplicationBoard'

type VacancyApplicationStatusCreateDialogProps = {
  isOpen: boolean
  isPending?: boolean
  errorMessage?: string | null
  editingStatus?: VacancyApplicationStatusItem | null
  onClose: () => void
  onSubmitCreate: (data: CreateVacancyApplicationStatusDTO) => void
  onSubmitUpdate?: (code: string, data: UpdateVacancyApplicationStatusDTO) => void
}

const StatusToggle = ({
  label,
  description,
  checked,
  onChange,
  ariaLabel,
  disabled = false,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  ariaLabel: string
  disabled?: boolean
}) => (
  <div className="flex items-center justify-between rounded-3xl border border-app-border-accent bg-app-surface-2 p-4">
    <div>
      <p className="text-sm font-bold text-app-text">{label}</p>
      <p className="mt-0.5 text-xs text-app-text-muted">{description}</p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      size="sm"
    />
  </div>
)

export const VacancyApplicationStatusCreateDialog = ({
  isOpen,
  isPending,
  errorMessage,
  editingStatus = null,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: VacancyApplicationStatusCreateDialogProps) => {
  const isEditMode = editingStatus != null

  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isDefault, setIsDefault] = useState(false)
  const [closesVacancy, setClosesVacancy] = useState(false)
  const [codeTouched, setCodeTouched] = useState(false)
  const [localError, setLocalError] = useState('')

  const codeTouchedRef = useRef(codeTouched)
  codeTouchedRef.current = codeTouched

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setCode('')
      setIsActive(true)
      setIsDefault(false)
      setClosesVacancy(false)
      setCodeTouched(false)
      setLocalError('')
      return
    }

    if (editingStatus) {
      setTitle(editingStatus.title)
      setCode(editingStatus.code)
      setIsActive(editingStatus.is_active)
      setIsDefault(editingStatus.is_default)
      setClosesVacancy(editingStatus.closes_vacancy)
      setCodeTouched(true)
      setLocalError('')
    }
  }, [isOpen, editingStatus])

  useEffect(() => {
    if (!isOpen || isEditMode || codeTouchedRef.current) return
    if (!title.trim()) {
      setCode('')
      return
    }
    setCode(normalizeStatusCode(title))
  }, [title, isOpen, isEditMode])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const handleCodeChange = (value: string) => {
    setCodeTouched(true)
    setCode(value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
    setLocalError('')
  }

  const handleSubmit = () => {
    const trimmedTitle = title.trim()
    const trimmedCode = code.trim()

    if (!trimmedTitle) {
      setLocalError('Укажите название колонки')
      return
    }

    if (isEditMode && editingStatus) {
      if (!onSubmitUpdate) return
      const patch: UpdateVacancyApplicationStatusDTO = {
        title: trimmedTitle,
        is_active: isActive,
        is_default: isDefault,
        closes_vacancy: closesVacancy,
      }
      setLocalError('')
      onSubmitUpdate(editingStatus.code, patch)
      return
    }

    if (!trimmedCode) {
      setLocalError('Укажите код колонки')
      return
    }
    if (!isValidStatusCode(trimmedCode)) {
      setLocalError('Код: латиница, начинается с буквы a–z, допустимы цифры и _')
      return
    }

    const payload: CreateVacancyApplicationStatusDTO = {
      code: trimmedCode,
      title: trimmedTitle,
      is_active: isActive,
      closes_vacancy: closesVacancy,
    }

    setLocalError('')
    onSubmitCreate(payload)
  }

  const displayError = localError || errorMessage
  const isValid = isEditMode
    ? Boolean(title.trim())
    : Boolean(title.trim() && code.trim() && isValidStatusCode(code.trim()))

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="select-text border border-app-border-accent bg-app-surface-0 text-app-text sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            {isEditMode ? 'Редактировать колонку' : 'Новая колонка'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Название колонки <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Например: Собеседование"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setLocalError('')
              }}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-app-text-muted">
              Код {isEditMode ? null : <span className="text-brand-accent">*</span>}
            </Label>
            <DarkInput
              placeholder="interview"
              value={code}
              disabled={isEditMode}
              onChange={(e) => handleCodeChange(e.target.value)}
            />
            <p className="text-xs text-app-text-muted">
              {isEditMode
                ? 'Код колонки нельзя изменить после создания'
                : 'Латиница, начинается с a–z, можно цифры и _. Пример: phone_screen'}
            </p>
          </div>

          <StatusToggle
            label="Активна"
            description="Колонка отображается на доске"
            checked={isActive}
            onChange={setIsActive}
            ariaLabel="Колонка активна"
          />

          {isEditMode ? (
            <StatusToggle
              label="По умолчанию"
              description="Статус для новых откликов без указания колонки"
              checked={isDefault}
              onChange={setIsDefault}
              ariaLabel="Статус по умолчанию"
            />
          ) : null}

          <StatusToggle
            label="Закрывает вакансию"
            description="При переносе отклика в эту колонку вакансия закрывается"
            checked={closesVacancy}
            onChange={setClosesVacancy}
            ariaLabel="Закрывает вакансию"
          />

          {displayError ? (
            <p className="text-sm text-red-400" role="alert">
              {displayError}
            </p>
          ) : null}
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="h-10 rounded-full border-app-border-accent bg-transparent px-6 text-sm text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.15)] hover:bg-brand disabled:opacity-40"
          >
            {isPending ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
