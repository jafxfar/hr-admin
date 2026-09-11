'use client'

import { useEffect, useId, useState } from 'react'
import type { Branch } from '@/api/branches'
import { useToast } from '@/hooks/use-toast'
import {
  useBranchesList,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
} from '@/hooks/use-branches'

const PAGE_SIZE = 20

export function useBranchesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data, isLoading } = useBranchesList(debouncedSearch, page, PAGE_SIZE, true, true)
  const branches = data?.items ?? []
  const totalPages = data?.total_pages ?? 1

  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createCode, setCreateCode] = useState('')
  const createMutation = useCreateBranchMutation()

  const branchActiveSwitchId = useId()

  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const updateMutation = useUpdateBranchMutation()

  const deleteMutation = useDeleteBranchMutation()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleCreateSave = () => {
    if (!createName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название филиала',
      })
      return
    }
    createMutation.mutate(
      {
        name: createName.trim(),
        description: createDescription.trim() || undefined,
        code: createCode.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCreateOpen(false)
          setCreateName('')
          setCreateDescription('')
          setCreateCode('')
        },
      },
    )
  }

  const openCreate = () => {
    setCreateName('')
    setCreateDescription('')
    setCreateCode('')
    setCreateOpen(true)
  }

  const openEdit = (b: Branch) => {
    setEditId(b.id)
    setEditName(b.name)
    setEditDescription(b.description ?? '')
    setEditCode(b.code ?? '')
    setEditIsActive(b.is_active !== false)
  }

  const handleEditSave = () => {
    if (!editId || !editName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название филиала',
      })
      return
    }
    updateMutation.mutate(
      {
        id: editId,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
          code: editCode.trim() || undefined,
          is_active: editIsActive,
        },
      },
      {
        onSuccess: () => {
          setEditId(null)
        },
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (deleteId == null) return
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  return {
    search,
    setSearch,
    page,
    setPage,
    branches,
    totalPages,
    isLoading,
    createOpen,
    setCreateOpen,
    createName,
    setCreateName,
    createDescription,
    setCreateDescription,
    createCode,
    setCreateCode,
    createMutation,
    branchActiveSwitchId,
    editId,
    setEditId,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editCode,
    setEditCode,
    editIsActive,
    setEditIsActive,
    updateMutation,
    deleteId,
    setDeleteId,
    deleteMutation,
    openCreate,
    openEdit,
    handleCreateSave,
    handleEditSave,
    handleDeleteConfirm,
  }
}
