'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { isForbiddenError } from '@/lib/query-error'
import { useDocumentTypesSettings } from '@/hooks/use-document-types-settings'
import { CATEGORY_LABEL, type CategoryFilter } from './constants'
import { DocumentTypesTable } from './document-types-table'
import { DocumentTypeCreateDialog } from './document-type-create-dialog'
import { DocumentTypeEditDialog } from './document-type-edit-dialog'

export const DocumentTypesSettings = () => {
  const settings = useDocumentTypesSettings()

  if (!settings.isSuperadmin) {
    return null
  }

  return (
    <div className="rounded-3xl border border-app-surface-4 bg-app-surface-0 p-6 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-app-text">Типы документов</h2>
          <p className="text-xs text-app-text-muted leading-relaxed">
            Справочник для загрузок и чек-листа документов. Удаление недоступно — используйте деактивацию.
          </p>
        </div>
        <Button
          type="button"
          onClick={settings.handleOpenCreate}
          className="rounded-full shrink-0 gap-2"
          disabled={settings.isLoading || settings.isError}
        >
          <Plus size={16} aria-hidden />
          Добавить тип
        </Button>
      </div>

      <DocumentTypeCategoryFilter
        value={settings.categoryFilter}
        onChange={settings.setCategoryFilter}
      />

      {settings.isLoading ? (
        <DocumentTypesLoading />
      ) : settings.isError ? (
        <DocumentTypesError error={settings.error} />
      ) : (
        <DocumentTypesTable
          items={settings.filteredItems}
          isPending={settings.patchMutation.isPending}
          onEdit={settings.handleOpenEdit}
          onToggleActive={settings.handleToggleActive}
        />
      )}

      <DocumentTypeCreateDialog
        open={settings.createOpen}
        onOpenChange={settings.setCreateOpen}
        form={settings.createForm}
        setForm={settings.setCreateForm}
        isPending={settings.createMutation.isPending}
        onSubmit={settings.handleCreateSubmit}
      />

      <DocumentTypeEditDialog
        editRow={settings.editRow}
        onClose={() => settings.setEditRow(null)}
        form={settings.editForm}
        setForm={settings.setEditForm}
        isPending={settings.patchMutation.isPending}
        onSave={settings.handleEditSave}
      />
    </div>
  )
}

const DocumentTypeCategoryFilter = ({
  value,
  onChange,
}: {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Фильтр по категории">
    {(['all', 'main', 'contracts'] as const).map((key) => (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={value === key}
        onClick={() => onChange(key)}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          value === key
            ? 'bg-(--theme-primary) text-white'
            : 'bg-app-surface-0 text-app-text-muted hover:text-app-text border border-app-border'
        }`}
      >
        {key === 'all' ? 'Все' : CATEGORY_LABEL[key]}
      </button>
    ))}
  </div>
)

const DocumentTypesLoading = () => (
  <div className="rounded-2xl border border-app-surface-4 px-5 py-4 text-sm text-app-text-muted">
    Загрузка справочника…
  </div>
)

const DocumentTypesError = ({ error }: { error: unknown }) => (
  <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
    {isForbiddenError(error)
      ? 'Нет доступа к списку типов'
      : (error as Error)?.message ?? 'Не удалось загрузить типы документов'}
  </div>
)
