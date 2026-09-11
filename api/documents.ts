import type { CreateDocumentRequest, Document, DocumentUpdate } from "@/types/documents";
import { apiClient } from './client'

const buildDocumentUpdateBody = (data: DocumentUpdate): DocumentUpdate => {
    const out: DocumentUpdate = { ...data }
    const fb = out.file_base64?.trim()
    if (!fb) {
        delete out.file_base64
        delete out.filename
    }
    return out
}

export const documentsApi = {

    getDocumentsById: (user_id: number): Promise<Document[]> => {
        return apiClient.get<Document[]>(`/documents/by-user/${user_id}`);
    },

    createDocuments: (data: CreateDocumentRequest): Promise<number> => {
        return apiClient.post<number>('/documents/create', data);
    },

    updateDocuments: (documents_id: number, data: DocumentUpdate): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/documents/${documents_id}`, buildDocumentUpdateBody(data));
    },

    deleteDocument: (document_id: number): Promise<void> => {
        return apiClient.delete<void>(`/documents/${document_id}`);
    },
}
