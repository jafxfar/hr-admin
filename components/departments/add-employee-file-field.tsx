'use client'

import type { RefObject } from 'react'
import { FileText } from 'lucide-react'
import { positionsLabelCls } from '@/components/ui/positions-multi-select'

type AddEmployeeFileFieldProps = {
  fileInputRef: RefObject<HTMLInputElement | null>
  filename: string
  fileError: string | null
  disabled: boolean
  onFileSelect: (file: File) => void
}

export const AddEmployeeFileField = ({
  fileInputRef,
  filename,
  fileError,
  disabled,
  onFileSelect,
}: AddEmployeeFileFieldProps) => (
  <div>
    <label className={positionsLabelCls}>
      Файл-основание
    </label>
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (file) onFileSelect(file)
      }}
    />
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={disabled}
      className="w-full h-12 px-4 rounded-full flex items-center gap-2 text-left border border-app-border-accent bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-all disabled:opacity-60"
      aria-label="Выбрать файл-основание смены должности"
    >
      <FileText className="w-4 h-4 shrink-0" />
      <span className="truncate text-sm">{filename || 'Выбрать файл'}</span>
    </button>
    <p className="mt-1.5 text-xs text-app-text-muted">PDF, JPG, PNG, DOC, DOCX, до 10MB</p>
    {fileError ? <p className="mt-1.5 text-xs text-red-400">{fileError}</p> : null}
  </div>
)
