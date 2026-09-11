/** Код типа из справочника document_types (расширяется на бэкенде) */
export type DocumentTypeCode = string

// Document as returned by the server (GET /employees/:id)
export interface EmployeeDocument {
    id: number
    document_type_id?: number | null
    /** Код типа из справочника (joined с document_types.code) */
    type: DocumentTypeCode
    title: string
    path: string          // server-side file path / URL
    /** Публичный URL из ответа профиля / чеклиста */
    file_url?: string
    params: Record<string, any> | null
    created_at: string
    is_active?: boolean
}

// Document DTO for create requests (base64 upload)
export interface Document {
    title: string
    /** Предпочтительно передавать document_type_id; type — совместимость со старым API */
    document_type_id?: number
    type: DocumentTypeCode
    file_base64: string
    filename: string
    params?: Record<string, any>
}

export interface CreateDocumentRequest extends Document {
    user_id: number
}

/** Тело PUT `/documents/:id` — все поля опциональны; файл только если заменяется */
export interface DocumentUpdate {
    document_type_id?: number
    type?: DocumentTypeCode
    title?: string
    file_base64?: string
    filename?: string
    params?: Record<string, unknown> | null
}