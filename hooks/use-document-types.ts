import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  settingsApi,
  SETTINGS_DOCUMENT_TYPES_QUERY_KEY,
  type DocumentTypeCategory,
  type DocumentTypeCreateBody,
  type DocumentTypePatchBody,
} from '@/api/settings'

export type DocumentTypesQueryFilters = {
  category?: DocumentTypeCategory
  includeInactive?: boolean
}

const filtersKey = (f: DocumentTypesQueryFilters) =>
  [f.category ?? 'all', f.includeInactive ?? false] as const

export const useDocumentTypesQuery = (
  filters: DocumentTypesQueryFilters,
  enabled = true,
) =>
  useQuery({
    queryKey: [...SETTINGS_DOCUMENT_TYPES_QUERY_KEY, ...filtersKey(filters)],
    queryFn: () =>
      settingsApi.getDocumentTypes({
        category: filters.category,
        include_inactive: filters.includeInactive,
      }),
    enabled,
    staleTime: 60_000,
  })

/** Все активные типы (обе категории) — для подписей и модалки документа */
export const useActiveDocumentTypesQuery = (enabled = true) =>
  useDocumentTypesQuery({ includeInactive: false }, enabled)

export const useCreateDocumentTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (body: DocumentTypeCreateBody) => settingsApi.createDocumentType(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...SETTINGS_DOCUMENT_TYPES_QUERY_KEY] })
    },
  })
}

export const usePatchDocumentTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ typeId, body }: { typeId: number; body: DocumentTypePatchBody }) =>
      settingsApi.patchDocumentType(typeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...SETTINGS_DOCUMENT_TYPES_QUERY_KEY] })
    },
  })
}

export { resolveDocumentTypeTitle } from '@/lib/document-type-display'
