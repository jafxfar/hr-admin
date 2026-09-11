'use client'

import { useMemo, useState } from 'react'
import {
  useDepartmentEmployees,
  useUpdateDepartmentMutation,
  useSearchDepartments,
} from '@/hooks/use-departments'
import { useEmployees } from '@/hooks/use-employees'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useBranchesList } from '@/hooks/use-branches'
import type { Department, UpdateDepartmentDTO } from '@/types/departments'

export const DEPARTMENT_DETAIL_PAGE_SIZE = 20

export const useDepartmentDetailPage = (departmentId: number) => {
  const [page, setPage] = useState(1)
  const { data: employeesData, isLoading: empLoading } = useDepartmentEmployees(
    departmentId,
    page,
    DEPARTMENT_DETAIL_PAGE_SIZE,
  )
  const employees = employeesData?.items ?? []
  const totalPages = employeesData?.total_pages ?? 1

  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editHeadUserId, setEditHeadUserId] = useState<string>('')
  const [editParentId, setEditParentId] = useState<string>('')
  const [editAllowedPositionIds, setEditAllowedPositionIds] = useState<number[]>([])
  const [editBranchId, setEditBranchId] = useState<string>('')

  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartmentMutation(departmentId)
  const { data: allEmployeesData } = useEmployees(1, 20)
  const allEmployees = allEmployeesData?.items ?? []
  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { data: branchesData } = useBranchesList('', 1, 20, false, branchesEnabled)
  const branchSelectOptions = (branchesData?.items ?? []).map((b) => ({
    value: String(b.id),
    label: b.name,
  }))

  const { data: allDepartmentsData } = useSearchDepartments('', 1, 20)
  const allDepartments = allDepartmentsData?.items ?? []

  const currentDepartment = useMemo(
    () => allDepartments.find((d: Department) => d.id === departmentId),
    [allDepartments, departmentId],
  )

  const handleEditSave = () => {
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
      onSuccess: () => setEditOpen(false),
    })
  }

  return {
    page,
    setPage,
    employeesData,
    employees,
    totalPages,
    empLoading,
    editOpen,
    setEditOpen,
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
    branchesEnabled,
    branchSelectOptions,
    allDepartments,
    currentDepartment,
    handleEditSave,
  }
}
