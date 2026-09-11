import type { Document } from '@/types/documents'

export type FormDocument = Document & {
    _serverId?: number
    _serverPath?: string
    _previewUrl?: string
}

export type DeleteKind = 'salary' | 'schedule' | 'work' | 'contract' | 'education' | 'document'

export type PendingDelete = {
    kind: DeleteKind
    index: number
}

export type EditingChip = {
    kind: DeleteKind
    index: number
}

export type BasicOption = { value: string; label: string }

