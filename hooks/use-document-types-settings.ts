'use client'

import { useMemo, useState } from 'react'
import type { DocumentTypeItem } from '@/api/settings'
import {
  useCreateDocumentTypeMutation,
  useDocumentTypesQuery,
  usePatchDocumentTypeMutation,
} from '@/hooks/use-document-types'
import { useMe } from '@/hooks/use-employees'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import { useToast } from '@/hooks/use-toast'
import { mutationOpts } from '@/lib/mutation-options'
import {
  type CategoryFilter,
  type DocumentTypeCreateForm,
  type DocumentTypeEditForm,
  emptyCreateForm,
} from '@/components/settings/document-types/constants'
import type { DocumentTypeCategory } from '@/api/settings'

export const useDocumentTypesSettings = () => {
  const { toast } = useToast()
  const { data: me } = useMe()
  const roleName = getSystemRoleName(me)
  const isSuperadmin = roleName?.toLowerCase() === 'superadmin'
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'))

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState<DocumentTypeItem | null>(null)
  const [createForm, setCreateForm] = useState<DocumentTypeCreateForm>(emptyCreateForm)
  const [editForm, setEditForm] = useState<DocumentTypeEditForm>({
    title: '',
    category: 'main',
    sort_order: 0,
    is_active: true,
    auto_complete_on_file_upload: true,
    allow_received_without_file: false,
  })

  const { data, isLoading, isError, error } = useDocumentTypesQuery(
    { includeInactive: true },
    hasToken && isSuperadmin,
  )

  const createMutation = useCreateDocumentTypeMutation()
  const patchMutation = usePatchDocumentTypeMutation()

  const items = data?.items ?? []

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return items
    return items.filter((x) => x.category === categoryFilter)
  }, [items, categoryFilter])

  const handleOpenCreate = () => {
    setCreateForm(emptyCreateForm())
    setCreateOpen(true)
  }

  const handleCreateSubmit = () => {
    const body = {
      code: createForm.code.trim(),
      title: createForm.title.trim(),
      category: createForm.category,
      sort_order: Number(createForm.sort_order) || 0,
      is_active: createForm.is_active,
      auto_complete_on_file_upload: createForm.auto_complete_on_file_upload,
      allow_received_without_file: createForm.allow_received_without_file,
    }
    if (!body.code || !body.title) {
      toast({ variant: 'destructive', title: 'Заполните код и название' })
      return
    }

    createMutation.mutate(
      body,
      mutationOpts({
        meta: { successTitle: 'Тип документа создан' },
        onSuccess: () => {
          setCreateOpen(false)
        },
      }),
    )
  }

  const handleOpenEdit = (row: DocumentTypeItem) => {
    setEditRow(row)
    setEditForm({
      title: row.title,
      category: row.category as DocumentTypeCategory,
      sort_order: row.sort_order,
      is_active: row.is_active,
      auto_complete_on_file_upload: row.auto_complete_on_file_upload,
      allow_received_without_file: row.allow_received_without_file,
    })
  }

  const handleEditSave = () => {
    if (!editRow) return
    patchMutation.mutate(
      {
        typeId: editRow.id,
        body: {
          title: editForm.title.trim(),
          category: editForm.category,
          sort_order: Number(editForm.sort_order) || 0,
          is_active: editForm.is_active,
          auto_complete_on_file_upload: editForm.auto_complete_on_file_upload,
          allow_received_without_file: editForm.allow_received_without_file,
        },
      },
      mutationOpts({
        meta: { successTitle: 'Сохранено' },
        onSuccess: () => {
          setEditRow(null)
        },
      }),
    )
  }

  const handleToggleActive = (row: DocumentTypeItem) => {
    patchMutation.mutate(
      { typeId: row.id, body: { is_active: !row.is_active } },
      mutationOpts({
        meta: {
          successTitle: row.is_active ? 'Тип деактивирован' : 'Тип активирован',
        },
      }),
    )
  }

  return {
    isSuperadmin,
    categoryFilter,
    setCategoryFilter,
    createOpen,
    setCreateOpen,
    editRow,
    setEditRow,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    isLoading,
    isError,
    error,
    filteredItems,
    createMutation,
    patchMutation,
    handleOpenCreate,
    handleCreateSubmit,
    handleOpenEdit,
    handleEditSave,
    handleToggleActive,
  }
}
