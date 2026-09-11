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
import type { DocumentTypeCreateForm } from './constants'
import {
  bindCreateToggleFields,
  DocumentTypeCategorySortFields,
  DocumentTypeToggleFields,
} from './document-type-form-fields'

type DocumentTypeCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: DocumentTypeCreateForm
  setForm: React.Dispatch<React.SetStateAction<DocumentTypeCreateForm>>
  isPending: boolean
  onSubmit: () => void
}

export const DocumentTypeCreateDialog = ({
  open,
  onOpenChange,
  form,
  setForm,
  isPending,
  onSubmit,
}: DocumentTypeCreateDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md rounded-[24px] border-app-border bg-app-surface-0">
      <DialogHeader>
        <DialogTitle>Новый тип документа</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <label style={labelStyle}>Код (латиница, цифры, _)</label>
          <DarkInput
            value={form.code}
            onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
            placeholder="например inn"
          />
        </div>
        <div>
          <label style={labelStyle}>Название</label>
          <DarkInput
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Отображаемое название"
          />
        </div>
        <DocumentTypeCategorySortFields
          category={form.category}
          sortOrder={form.sort_order}
          onCategoryChange={(category) => setForm((s) => ({ ...s, category }))}
          onSortOrderChange={(sort_order) => setForm((s) => ({ ...s, sort_order }))}
        />
        <DocumentTypeToggleFields {...bindCreateToggleFields(form, setForm)} />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button type="button" className="rounded-full" onClick={onSubmit} disabled={isPending}>
          {isPending ? 'Создание…' : 'Создать'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
