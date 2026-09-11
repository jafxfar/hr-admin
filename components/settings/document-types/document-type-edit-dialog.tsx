'use client'

import { DarkInput } from '@/components/custom-ui'
import { labelStyle } from '@/components/employee-form/profile-form/styles'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DocumentTypeItem } from '@/api/settings'
import type { DocumentTypeEditForm } from './constants'
import {
  bindEditToggleFields,
  DocumentTypeCategorySortFields,
  DocumentTypeToggleFields,
} from './document-type-form-fields'

type DocumentTypeEditDialogProps = {
  editRow: DocumentTypeItem | null
  onClose: () => void
  form: DocumentTypeEditForm
  setForm: React.Dispatch<React.SetStateAction<DocumentTypeEditForm>>
  isPending: boolean
  onSave: () => void
}

export const DocumentTypeEditDialog = ({
  editRow,
  onClose,
  form,
  setForm,
  isPending,
  onSave,
}: DocumentTypeEditDialogProps) => (
  <Dialog open={editRow !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-md rounded-[24px] border-app-border bg-app-surface-0">
      <DialogHeader>
        <DialogTitle>Изменить тип документа</DialogTitle>
        {editRow ? (
          <p className="text-xs text-app-text-muted font-mono pt-1">Код: {editRow.code}</p>
        ) : null}
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <label style={labelStyle}>Название</label>
          <DarkInput
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Название типа"
          />
        </div>
        <DocumentTypeCategorySortFields
          category={form.category}
          sortOrder={form.sort_order}
          sortLabel="Порядок"
          onCategoryChange={(category) => setForm((s) => ({ ...s, category }))}
          onSortOrderChange={(sort_order) => setForm((s) => ({ ...s, sort_order }))}
        />
        <DocumentTypeToggleFields {...bindEditToggleFields(form, setForm)} />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
          Отмена
        </Button>
        <Button type="button" className="rounded-full" onClick={onSave} disabled={isPending}>
          {isPending ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
