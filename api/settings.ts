import { apiClient } from './client'

export interface SettingsFeatures {
  branches_enabled: boolean
  vacancies_enabled: boolean
  vacancy_applications_enabled: boolean
  timesheets_enabled: boolean
  kpi_enabled: boolean
  news_enabled: boolean
  ideas_enabled: boolean
  lms_enabled: boolean
  tasks_enabled: boolean
}

export interface SettingsFeaturesResponse {
  features: SettingsFeatures
}

export type SystemSettingsResponse = SettingsFeaturesResponse
export interface UserUiSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  density: 'comfortable' | 'compact'
  sidebar_collapsed: boolean
  font_scale: number
  light_primary: string
  light_secondary: string
  dark_primary: string
  dark_secondary: string
}

export const SETTINGS_SYSTEM_QUERY_KEY = ['settings', 'system'] as const
export const SETTINGS_UI_ME_QUERY_KEY = ['settings', 'ui', 'me'] as const
export const SETTINGS_DOCUMENT_TYPES_QUERY_KEY = ['settings', 'document-types'] as const

export type DocumentTypeCategory = 'main' | 'contracts'

export interface DocumentTypeItem {
  id: number
  code: string
  title: string
  category: DocumentTypeCategory | string
  sort_order: number
  is_active: boolean
  auto_complete_on_file_upload: boolean
  allow_received_without_file: boolean
}

export interface DocumentTypeListResponse {
  items: DocumentTypeItem[]
}

/** Нормализует тело ответа GET `/settings/document-types` (объект с `items` или устаревший голый массив). */
const normalizeDocumentTypeListResponse = (raw: unknown): DocumentTypeListResponse => {
  const rows: unknown[] = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as DocumentTypeListResponse).items)
      ? (raw as DocumentTypeListResponse).items
      : []

  const items: DocumentTypeItem[] = rows
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const o = row as Record<string, unknown>
      const id = Number(o.id)
      if (!Number.isFinite(id) || id < 1) return null
      return {
        id,
        code: String(o.code ?? '').trim(),
        title: String(o.title ?? '').trim(),
        category: String(o.category ?? '').trim() || 'main',
        sort_order: Number(o.sort_order) || 0,
        is_active: Boolean(o.is_active),
        auto_complete_on_file_upload: Boolean(
          o.auto_complete_on_file_upload !== undefined ? o.auto_complete_on_file_upload : true,
        ),
        allow_received_without_file: Boolean(o.allow_received_without_file),
      }
    })
    .filter((x): x is DocumentTypeItem => x !== null)

  return { items }
}

export interface DocumentTypeCreateBody {
  code: string
  title: string
  category: DocumentTypeCategory
  sort_order: number
  is_active: boolean
  auto_complete_on_file_upload: boolean
  allow_received_without_file: boolean
}

export type DocumentTypePatchBody = Partial<
  Pick<
    DocumentTypeCreateBody,
    | 'title'
    | 'category'
    | 'sort_order'
    | 'is_active'
    | 'auto_complete_on_file_upload'
    | 'allow_received_without_file'
  >
>

export const settingsApi = {
  getSystemFeatures: (): Promise<SettingsFeaturesResponse> =>
    apiClient.get<SettingsFeaturesResponse>('/settings/system/features'),

  getSystemSettings: (): Promise<SystemSettingsResponse> =>
    apiClient.get<SystemSettingsResponse>('/settings/system'),

  patchSystemSettings: (body: SystemSettingsResponse): Promise<SystemSettingsResponse> =>
    apiClient.patch<SystemSettingsResponse>('/settings/system', body),

  getMyUiSettings: (): Promise<UserUiSettings> =>
    apiClient.get<UserUiSettings>('/settings/ui/me'),

  putMyUiSettings: (body: Partial<UserUiSettings>): Promise<UserUiSettings> =>
    apiClient.put<UserUiSettings>('/settings/ui/me', body),

  getDocumentTypes: async (params?: {
    category?: DocumentTypeCategory
    include_inactive?: boolean
  }): Promise<DocumentTypeListResponse> => {
    const q: Record<string, string> = {}
    if (params?.category) q.category = params.category
    if (params?.include_inactive) q.include_inactive = 'true'
    const query = Object.keys(q).length ? q : undefined
    const raw = await apiClient.get<unknown>('/settings/document-types', query)
    return normalizeDocumentTypeListResponse(raw)
  },

  createDocumentType: (body: DocumentTypeCreateBody): Promise<number> =>
    apiClient.post<number>('/settings/document-types', body),

  patchDocumentType: (typeId: number, body: DocumentTypePatchBody): Promise<{ id: number }> =>
    apiClient.patch<{ id: number }>(`/settings/document-types/${typeId}`, body),
}

