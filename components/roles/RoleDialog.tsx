/**
 * Диалог создания/редактирования должности
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput } from '@/components/custom-ui'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Positions } from '@/types/positions'
import { CreatePositionRequest } from '@/api/positions'
import {
  useJobInstruction,
  useUploadJobInstructionMutation,
  useSetJobInstructionStatusMutation,
} from '@/hooks/use-positions'
import { ExternalLink, FileText, Upload } from 'lucide-react'
import { getApiErrorMessage } from '@/lib/api-error'

const ALLOWED_INSTRUCTION_EXTS = ['.pdf', '.doc', '.docx'] as const
const MAX_INSTRUCTION_SIZE_BYTES = 10 * 1024 * 1024

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: CreatePositionRequest) => void
  role?: Positions | null
  mode?: 'create' | 'edit'
}

export function RoleDialog({
  open,
  onOpenChange,
  onSave,
  role,
  mode = 'create',
}: RoleDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (role) {
      setTitle(role.title)
      setDescription(role.description ?? '')
    } else {
      setTitle('')
      setDescription('')
    }
  }, [role, open])

  const isValid = title.trim()

  const handleClose = () => {
    setTitle('')
    setDescription('')
    onOpenChange(false)
  }

  const handleSubmit = () => {
    if (!isValid) return
    onSave({ title: title.trim(), description: description.trim() })
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            {mode === 'create' ? 'Новая должность' : 'Редактировать должность'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
              Название должности <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Например: Разработчик"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
              Описание
            </Label>
            <Textarea
              placeholder="Краткое описание должности и обязанностей..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none"
            />
          </div>

          {mode === 'edit' && role && (
            <JobInstructionSection positionId={role.id} />
          )}
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface JobInstructionSectionProps {
  positionId: number
}

function JobInstructionSection({ positionId }: JobInstructionSectionProps) {
  const { data, isLoading } = useJobInstruction(positionId)
  const uploadMutation = useUploadJobInstructionMutation()
  const statusMutation = useSetJobInstructionStatusMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const hasFile = !!data?.path
  const isActive = !!data?.is_active
  const isBusy = uploadMutation.isPending || statusMutation.isPending

  const handlePickFile = () => {
    setLocalError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const lowerName = file.name.toLowerCase()
    const ext = lowerName.includes('.') ? '.' + lowerName.split('.').pop() : ''
    if (!ALLOWED_INSTRUCTION_EXTS.includes(ext as (typeof ALLOWED_INSTRUCTION_EXTS)[number])) {
      setLocalError('Допустимые форматы: .pdf, .doc, .docx')
      return
    }
    if (file.size === 0) {
      setLocalError('Файл пустой')
      return
    }
    if (file.size > MAX_INSTRUCTION_SIZE_BYTES) {
      setLocalError('Размер файла не должен превышать 10MB')
      return
    }

    setLocalError(null)
    uploadMutation.mutate(
      { positionId, file },
      {
        onError: (err: unknown) => {
          setLocalError(getApiErrorMessage(err, 'Не удалось загрузить файл'))
        },
      },
    )
  }

  const handleToggleStatus = (next: boolean) => {
    setLocalError(null)
    statusMutation.mutate(
      { positionId, isActive: next },
      {
        onError: (err: unknown) => {
          setLocalError(getApiErrorMessage(err, 'Не удалось изменить статус'))
        },
      },
    )
  }

  const fileName = data?.path ? data.path.split('/').pop() ?? data.path : null
  const uploadError = uploadMutation.error as { message?: string } | null
  const statusError = statusMutation.error as { message?: string } | null
  const errorText =
    localError || uploadError?.message || statusError?.message || null

  return (
    <div className="space-y-3 pt-2 border-t border-app-border-accent/60">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-widest font-black text-app-text-muted">
          Должностная инструкция
        </Label>
        {hasFile && (
          <Switch
            checked={isActive}
            onCheckedChange={handleToggleStatus}
            disabled={isBusy}
            offLabel="Скрыта"
            onLabel="Активна"
            aria-label="Переключить активность инструкции"
            size="sm"
          />
        )}
      </div>

      {isLoading ? (
        <p className="text-xs text-app-text-muted">Загрузка...</p>
      ) : hasFile ? (
        <div className="flex items-center gap-2 rounded-2xl border border-app-border-accent bg-app-surface-0 px-3 py-2.5">
          <FileText className="w-4 h-4 text-app-text-muted shrink-0" />
          <span className="flex-1 truncate text-sm text-app-text" title={fileName ?? undefined}>
            {fileName ?? 'Файл'}
          </span>
          {data?.url && isActive && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
              aria-label="Открыть инструкцию в новой вкладке"
            >
              Открыть
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-app-text-muted">Файл инструкции не загружен</p>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handlePickFile}
          disabled={isBusy}
          className="h-9 px-4 text-xs rounded-full border-app-border-accent bg-transparent text-app-text hover:bg-app-surface-3 gap-2"
        >
          <Upload className="w-3.5 h-3.5" />
          {hasFile ? 'Заменить файл' : 'Загрузить файл'}
        </Button>
        <span className="text-xs font-medium text-app-text-muted">
          PDF, DOC, DOCX, до 10MB
        </span>
      </div>

      {errorText && (
        <p className="text-xs text-red-400">{errorText}</p>
      )}
    </div>
  )
}
