import type { DocumentTypeCategory } from '@/api/settings'

export type CategoryFilter = 'all' | DocumentTypeCategory

export const CATEGORY_LABEL: Record<DocumentTypeCategory, string> = {
  main: 'Основные',
  contracts: 'Контракты',
}

/** Как в форме сотрудника: InlineSelect / EmployeeModals */
export const DOC_SELECT_TRIGGER_CLASS =
  'w-full h-12 border border-app-border-accent rounded-full px-4 bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 [&_svg]:text-app-text-muted'

export const toggleRowClass =
  'flex items-center justify-between gap-3 rounded-full bg-app-surface-0 px-4 py-3'

export const emptyCreateForm = () => ({
  code: '',
  title: '',
  category: 'main' as DocumentTypeCategory,
  sort_order: 0,
  is_active: true,
  auto_complete_on_file_upload: true,
  allow_received_without_file: false,
})

export type DocumentTypeCreateForm = ReturnType<typeof emptyCreateForm>

export type DocumentTypeEditForm = {
  title: string
  category: DocumentTypeCategory
  sort_order: number
  is_active: boolean
  auto_complete_on_file_upload: boolean
  allow_received_without_file: boolean
}
