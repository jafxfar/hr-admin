'use client'

import type { DocumentTypeCategory } from '@/api/settings'
import { DarkInput } from '@/components/custom-ui'
import { labelStyle } from '@/components/employee-form/profile-form/styles'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOC_SELECT_TRIGGER_CLASS, toggleRowClass } from './constants'
import type { DocumentTypeCreateForm, DocumentTypeEditForm } from './constants'

type ToggleFieldsProps = {
  isActive: boolean
  autoCompleteOnFileUpload: boolean
  allowReceivedWithoutFile: boolean
  onActiveChange: (checked: boolean) => void
  onAutoCompleteChange: (checked: boolean) => void
  onAllowWithoutFileChange: (checked: boolean) => void
}

export const DocumentTypeToggleFields = ({
  isActive,
  autoCompleteOnFileUpload,
  allowReceivedWithoutFile,
  onActiveChange,
  onAutoCompleteChange,
  onAllowWithoutFileChange,
}: ToggleFieldsProps) => (
  <>
    <div className={toggleRowClass}>
      <span className="text-sm text-app-text">Активен</span>
      <Switch checked={isActive} onCheckedChange={onActiveChange} />
    </div>
    <DocumentTypeToggleRow
      label="Автозавершение при загрузке файла"
      checked={autoCompleteOnFileUpload}
      onCheckedChange={onAutoCompleteChange}
    />
    <DocumentTypeToggleRow
      label="Можно отметить без файла"
      checked={allowReceivedWithoutFile}
      onCheckedChange={onAllowWithoutFileChange}
    />
  </>
)

const DocumentTypeToggleRow = ({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) => (
  <div className={toggleRowClass}>
    <span className="text-sm text-app-text">{label}</span>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)

type CategorySortFieldsProps = {
  category: DocumentTypeCategory
  sortOrder: number
  onCategoryChange: (category: DocumentTypeCategory) => void
  onSortOrderChange: (sortOrder: number) => void
  sortLabel?: string
}

export const DocumentTypeCategorySortFields = ({
  category,
  sortOrder,
  onCategoryChange,
  onSortOrderChange,
  sortLabel = 'Порядок сортировки',
}: CategorySortFieldsProps) => (
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label style={labelStyle}>Категория</label>
      <Select value={category} onValueChange={(v) => onCategoryChange(v as DocumentTypeCategory)}>
        <SelectTrigger className={DOC_SELECT_TRIGGER_CLASS}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">Основные документы</SelectItem>
          <SelectItem value="contracts">Контракты и акты</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <label style={labelStyle}>{sortLabel}</label>
      <DarkInput
        type="number"
        value={sortOrder}
        onChange={(e) => onSortOrderChange(Number(e.target.value))}
      />
    </div>
  </div>
)

export const bindCreateToggleFields = (
  form: DocumentTypeCreateForm,
  setForm: React.Dispatch<React.SetStateAction<DocumentTypeCreateForm>>,
) => ({
  isActive: form.is_active,
  autoCompleteOnFileUpload: form.auto_complete_on_file_upload,
  allowReceivedWithoutFile: form.allow_received_without_file,
  onActiveChange: (c: boolean) => setForm((s) => ({ ...s, is_active: c })),
  onAutoCompleteChange: (c: boolean) =>
    setForm((s) => ({ ...s, auto_complete_on_file_upload: c })),
  onAllowWithoutFileChange: (c: boolean) =>
    setForm((s) => ({ ...s, allow_received_without_file: c })),
})

export const bindEditToggleFields = (
  form: DocumentTypeEditForm,
  setForm: React.Dispatch<React.SetStateAction<DocumentTypeEditForm>>,
) => ({
  isActive: form.is_active,
  autoCompleteOnFileUpload: form.auto_complete_on_file_upload,
  allowReceivedWithoutFile: form.allow_received_without_file,
  onActiveChange: (c: boolean) => setForm((s) => ({ ...s, is_active: c })),
  onAutoCompleteChange: (c: boolean) =>
    setForm((s) => ({ ...s, auto_complete_on_file_upload: c })),
  onAllowWithoutFileChange: (c: boolean) =>
    setForm((s) => ({ ...s, allow_received_without_file: c })),
})
