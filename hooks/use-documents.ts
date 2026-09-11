import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '@/api/documents'
import type { CreateDocumentRequest, DocumentUpdate } from '@/types/documents'

export const DOCUMENT_QUERY_KEY = ['documents']

export function useDocument(id: number) {
    return useQuery({
        queryKey: [...DOCUMENT_QUERY_KEY, id],
        queryFn: () => documentsApi.getDocumentsById(id),
        enabled: !!id,
    })
}

export function useCreateDocumentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateDocumentRequest) => documentsApi.createDocuments(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY })
        },
    })
}

export function useUpdateDocumentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ documents_id, data }: { documents_id: number; data: DocumentUpdate }) =>
            documentsApi.updateDocuments(documents_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY })
        },
    })
}

export function useDeleteDocumentMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (document_id: number) => documentsApi.deleteDocument(document_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY })
        },
    })
}
