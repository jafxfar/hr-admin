import type { DocumentTypeItem } from '@/api/settings'

const LEGACY_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: 'Паспорт',
  diploma: 'Диплом',
  contract: 'Трудовой договор',
  other: 'Другое',
}

export const resolveDocumentTypeTitle = (
  catalog: DocumentTypeItem[] | undefined,
  doc: { document_type_id?: number | null | undefined; type?: string | null | undefined },
): string => {
  if (catalog?.length && doc.document_type_id) {
    const row = catalog.find((x) => x.id === doc.document_type_id)
    if (row) return row.title
  }
  const code = doc.type?.trim()
  if (code && LEGACY_DOCUMENT_TYPE_LABELS[code]) {
    return LEGACY_DOCUMENT_TYPE_LABELS[code]
  }
  if (code) return code
  return 'Документ'
}
