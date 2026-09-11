'use client'

import type { Document } from '@/types/documents'
import type { DocumentTypeCategory } from '@/api/settings'

export function stripDataPrefix(dataUri: string): string {
    const idx = dataUri.indexOf('base64,')
    return idx !== -1 ? dataUri.slice(idx + 7) : dataUri
}

export const isImage = (src: string) =>
    src.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(src)

export type FormDocument = Document & {
    _serverId?: number
    _serverPath?: string
    _previewUrl?: string
}

export const DOCUMENT_CATEGORY_OPTIONS: { value: DocumentTypeCategory; label: string }[] = [
    { value: 'main', label: 'Основные документы' },
    { value: 'contracts', label: 'Контракты и акты' },
]

export const catalogCategoryMatches = (itemCategory: string | undefined, cat: DocumentTypeCategory) =>
    String(itemCategory ?? '')
        .trim()
        .toLowerCase() === cat

export const labelCls = 'block text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted mb-[8px]'

export type BasicOption = { value: string; label: string }
