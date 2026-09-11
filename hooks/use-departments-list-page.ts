'use client'

import { useState, useEffect } from 'react'
import {
  useSearchDepartments,
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation,
  useCreateDepartmentMutation,
} from '@/hooks/use-departments'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useBranchesList } from '@/hooks/use-branches'
import { useEmployees } from '@/hooks/use-employees'
import type { Department, UpdateDepartmentDTO } from '@/types/departments'

export const DEPARTMENTS_LIST_PAGE_SIZE = 20

export const useDepartmentsListPage = () => {
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

  const { data, isLoading } = useSearchDepartments(
    debouncedSearch,
    page,
    DEPARTMENTS_LIST_PAGE_SIZE,
  )
  const departments = data?.items ?? []
  const totalPages = data?.total_pages ?? 1

  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { data: branchesData } = useBranchesList('', 1, 20, false, branchesEnabled)
  const branchSelectOptions = (branchesData?.items ?? []).map((b) => ({
    value: String(b.id),
    label: b.name,
  }))

  const { data: allDepartmentsData } = useSearchDepartments('', 1, 20)
  const allDepartments = allDepartmentsData?.items ?? []

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartmentMutation()

  const [editTarget, setEditTarget] = useState<Department | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editHeadUserId, setEditHeadUserId] = useState<string>('')
  const [editParentId, setEditParentId] = useState<string>('')
  const [editAllowedPositionIds, setEditAllowedPositionIds] = useState<number[]>([])
  const [editBranchId, setEditBranchId] = useState<string>('')

  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartmentMutation(
    editTarget?.id ?? 0,
  )
  const { data: employeesData } = useEmployees(1, 20)
  const allEmployees = employeesData?.items ?? []

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createParentId, setCreateParentId] = useState<string>('')
  const [createAllowedPositionIds, setCreateAllowedPositionIds] = useState<number[]>([])
  const [createBranchId, setCreateBranchId] = useState<string>('')
  const [createIcon, setCreateIcon] = useState('Building2')
  const { mutate: createDepartment, isPending: isCreating } = useCreateDepartmentMutation()

  const openCreate = () => {
    setCreateName('')
    setCreateDescription('')
    setCreateParentId('')
    setCreateAllowedPositionIds([])
    setCreateBranchId('')
    setCreateIcon('Building2')
    setIsCreateOpen(true)
  }

  const handleCreateSave = () => {
    if (!createName.trim()) return
    if (branchesEnabled && !createBranchId) return
    createDepartment(
      {
        name: createName.trim(),
        description: createDescription.trim(),
        parent_id: createParentId ? Number(createParentId) : null,
        head_user_id: 0,
        icon: createIcon || null,
        allowed_position_ids:
          createAllowedPositionIds.length > 0 ? createAllowedPositionIds : undefined,
        ...(branchesEnabled && createBranchId ? { branch_id: Number(createBranchId) } : {}),
      },
      { onSuccess: () => setIsCreateOpen(false) },
    )
  }

  const openEdit = (dept: Department) => {
    setEditTarget(dept)
    setEditName(dept.name)
    setEditDescription(dept.description ?? '')
    setEditHeadUserId(dept.head_user?.id ? String(dept.head_user.id) : '')
    setEditParentId(dept.parent_id ? String(dept.parent_id) : '')
    setEditAllowedPositionIds(dept.allowed_positions?.map((p) => p.id) ?? [])
    setEditBranchId(dept.branch_id ? String(dept.branch_id) : '')
  }

  const handleEditSave = () => {
    if (!editTarget) return
    const payload: UpdateDepartmentDTO = {
      name: editName.trim() || undefined,
      description: editDescription.trim() || undefined,
      head_user_id:
        editHeadUserId && editHeadUserId !== 'none' ? Number(editHeadUserId) : undefined,
      parent_id: editParentId ? Number(editParentId) : null,
      allowed_position_ids:
        editAllowedPositionIds.length > 0 ? editAllowedPositionIds : undefined,
      ...(branchesEnabled && editBranchId ? { branch_id: Number(editBranchId) } : {}),
    }
    updateDepartment(payload, {
      onSuccess: () => setEditTarget(null),
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteDepartment(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
    }
  }

  return {
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    departments,
    totalPages,
    branchesEnabled,
    branchSelectOptions,
    allDepartments,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleDeleteConfirm,
    editTarget,
    setEditTarget,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editHeadUserId,
    setEditHeadUserId,
    editParentId,
    setEditParentId,
    editAllowedPositionIds,
    setEditAllowedPositionIds,
    editBranchId,
    setEditBranchId,
    isUpdating,
    allEmployees,
    isCreateOpen,
    setIsCreateOpen,
    createName,
    setCreateName,
    createDescription,
    setCreateDescription,
    createParentId,
    setCreateParentId,
    createAllowedPositionIds,
    setCreateAllowedPositionIds,
    createBranchId,
    setCreateBranchId,
    createIcon,
    setCreateIcon,
    isCreating,
    openCreate,
    handleCreateSave,
    openEdit,
    handleEditSave,
  }
}
