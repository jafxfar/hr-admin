'use client'

import { useEffect, useMemo, useState } from 'react'
import type { DocumentTypeCategory } from '@/api/settings'
import { useActiveDocumentTypesQuery } from '@/hooks/use-document-types'
import { getApiErrorMessage } from '@/lib/api-error'
import { buildFileUrl } from '@/lib/files'
import type { ModalMode } from './base-modal'
import { catalogCategoryMatches, stripDataPrefix, type FormDocument } from './helpers'

export const useDocumentModalState = (
    open: boolean,
    mode: ModalMode,
    initial: FormDocument | undefined,
) => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState<DocumentTypeCategory>('main')
    const [selectedTypeId, setSelectedTypeId] = useState('')
    const [fileBase64, setFileBase64] = useState('')
    const [filename, setFilename] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')

    const { data: catalogResponse, isLoading: typesLoading, isError: typesError, error: typesQueryError } =
        useActiveDocumentTypesQuery(open)
    const catalogItems = catalogResponse?.items ?? []

    const typesErrorMessage = getApiErrorMessage(
        typesQueryError,
        'Не удалось загрузить типы документов',
    )

    const typeOptionsForCategory = useMemo(
        () =>
            catalogItems
                .filter((item) => catalogCategoryMatches(item.category, category))
                .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
                .map((item) => ({ value: String(item.id), label: item.title })),
        [catalogItems, category],
    )

    const reset = () => {
        setTitle('')
        setCategory('main')
        setSelectedTypeId('')
        setFileBase64('')
        setFilename('')
        setPreviewUrl('')
    }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            const doc = initial
            setTitle(initial.title ?? '')
            setFileBase64(doc.file_base64 ?? '')
            setFilename(initial.filename ?? '')
            const serverPreview = doc._previewUrl || (doc._serverPath ? buildFileUrl(doc._serverPath) : '')
            setPreviewUrl(serverPreview)
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?._serverId])

    useEffect(() => {
        if (!open || catalogItems.length === 0) return

        if (mode === 'edit' && initial) {
            const wantId = initial.document_type_id
            const idMatch =
                wantId != null && Number.isFinite(Number(wantId))
                    ? catalogItems.find((x) => Number(x.id) === Number(wantId))
                    : undefined
            const codeMatch =
                !idMatch && initial.type
                    ? catalogItems.find((x) => x.code === String(initial.type).trim())
                    : undefined
            const row = idMatch ?? codeMatch
            if (row) {
                setCategory(row.category as DocumentTypeCategory)
                setSelectedTypeId(String(row.id))
                return
            }
        }

        if (mode === 'create') {
            const firstMain = catalogItems
                .filter((i) => catalogCategoryMatches(i.category, 'main'))
                .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)[0]
            if (firstMain) {
                setCategory('main')
                setSelectedTypeId(String(firstMain.id))
            }
        }
    }, [open, mode, initial, catalogItems])

    useEffect(() => {
        if (!open || catalogItems.length === 0 || typeOptionsForCategory.length === 0) return

        const inCategory = typeOptionsForCategory.some((o) => o.value === selectedTypeId)
        if (!inCategory) {
            setSelectedTypeId(typeOptionsForCategory[0].value)
        }
    }, [open, catalogItems.length, category, typeOptionsForCategory, selectedTypeId])

    const handleCategoryChange = (next: string) => {
        const cat = next as DocumentTypeCategory
        setCategory(cat)
        const nextOptions = catalogItems
            .filter((item) => catalogCategoryMatches(item.category, cat))
            .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
        const first = nextOptions[0]
        setSelectedTypeId(first ? String(first.id) : '')
    }

    const handleFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            const dataUri = reader.result as string
            setPreviewUrl(dataUri)
            setFileBase64(stripDataPrefix(dataUri))
            setFilename(file.name)
            if (!title) setTitle(file.name)
        }
        reader.readAsDataURL(file)
    }

    const selectedRow = catalogItems.find((x) => String(x.id) === selectedTypeId)

    return {
        title,
        setTitle,
        category,
        selectedTypeId,
        setSelectedTypeId,
        fileBase64,
        filename,
        previewUrl,
        typesLoading,
        typesError,
        typesErrorMessage,
        typeOptionsForCategory,
        handleCategoryChange,
        handleFile,
        selectedRow,
        reset,
    }
}
