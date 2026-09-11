'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { departmentsApi } from '@/api/departments'
import type { CreatePositionRequest } from '@/api/positions'
import {
  useCreateDepartmentMutation,
  useSearchDepartments,
  DEPARTMENTS_QUERY_KEY,
} from '@/hooks/use-departments'
import { useCreateBranchMutation, useBranchesList } from '@/hooks/use-branches'
import {
  useCreatePositionMutation,
  usePositionsByDepartment,
  POSITIONS_QUERY_KEY,
} from '@/hooks/use-positions'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/lib/api-error'
import type { Positions } from '@/types/positions'
import type { EmployeeFormData } from '../EmployeeFormContext'

type CreateTarget = 'department' | 'position' | 'branch' | null

type UsePositionSectionCreateArgs = {
  departmentId: number | null
  updateFormData: (data: Partial<EmployeeFormData>) => void
}

export const usePositionSectionCreate = ({
  departmentId,
  updateFormData,
}: UsePositionSectionCreateArgs) => {
  const queryClient = useQueryClient()
  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { toast } = useToast()

  const { data: departmentsData, isFetched: departmentsFetched } = useSearchDepartments('', 1, 20)
  const allDepartments = departmentsData?.items ?? []
  const departmentsEmpty = departmentsFetched && allDepartments.length === 0

  const { data: branchesData, isFetched: branchesFetched } = useBranchesList(
    '',
    1,
    20,
    false,
    branchesEnabled,
  )
  const branchSelectOptions = (branchesData?.items ?? []).map((b) => ({
    value: String(b.id),
    label: b.name,
  }))
  const branchesEmpty = branchesEnabled && branchesFetched && (branchesData?.items?.length ?? 0) === 0

  const {
    data: allowedPositions = [],
    isFetching: positionsFetching,
    isFetched: positionsFetched,
  } = usePositionsByDepartment(departmentId)
  const positionsEmpty =
    !!departmentId && positionsFetched && !positionsFetching && allowedPositions.length === 0

  const [createTarget, setCreateTarget] = useState<CreateTarget>(null)

  const [deptName, setDeptName] = useState('')
  const [deptDescription, setDeptDescription] = useState('')
  const [deptParentId, setDeptParentId] = useState('')
  const [deptAllowedPositionIds, setDeptAllowedPositionIds] = useState<number[]>([])
  const [deptBranchId, setDeptBranchId] = useState('')
  const [deptIcon, setDeptIcon] = useState('Building2')

  const [branchName, setBranchName] = useState('')
  const [branchDescription, setBranchDescription] = useState('')
  const [branchCode, setBranchCode] = useState('')

  const hasAutoPromptedDept = useRef(false)
  const hasAutoPromptedBranch = useRef(false)
  const hasAutoPromptedPos = useRef(false)

  const { mutate: createDepartment, isPending: isCreatingDepartment } = useCreateDepartmentMutation()
  const { mutateAsync: createPositionAsync, isPending: isCreatingPosition } =
    useCreatePositionMutation()
  const { mutate: createBranch, isPending: isCreatingBranch } = useCreateBranchMutation()

  const resetDepartmentForm = useCallback(() => {
    setDeptName('')
    setDeptDescription('')
    setDeptParentId('')
    setDeptAllowedPositionIds([])
    setDeptBranchId('')
    setDeptIcon('Building2')
  }, [])

  const resetBranchForm = useCallback(() => {
    setBranchName('')
    setBranchDescription('')
    setBranchCode('')
  }, [])

  const openCreateDepartment = useCallback(() => {
    resetDepartmentForm()
    setCreateTarget('department')
  }, [resetDepartmentForm])

  const openCreatePosition = useCallback(() => {
    setCreateTarget('position')
  }, [])

  const openCreateBranch = useCallback(() => {
    resetBranchForm()
    setCreateTarget('branch')
  }, [resetBranchForm])

  const closeCreate = useCallback(() => {
    setCreateTarget(null)
  }, [])

  useEffect(() => {
    if (createTarget !== null) return

    // Branch first when enabled: CreateDepartmentModal requires a branch_id
    if (branchesEmpty && !hasAutoPromptedBranch.current) {
      hasAutoPromptedBranch.current = true
      openCreateBranch()
      return
    }

    if (departmentsEmpty && !hasAutoPromptedDept.current) {
      hasAutoPromptedDept.current = true
      openCreateDepartment()
      return
    }

    if (
      !departmentsEmpty &&
      !branchesEmpty &&
      positionsEmpty &&
      !hasAutoPromptedPos.current
    ) {
      hasAutoPromptedPos.current = true
      openCreatePosition()
    }
  }, [
    createTarget,
    departmentsEmpty,
    branchesEmpty,
    positionsEmpty,
    openCreateDepartment,
    openCreateBranch,
    openCreatePosition,
  ])

  const handleCreateDepartment = () => {
    if (!deptName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название отдела',
      })
      return
    }
    if (branchesEnabled && !deptBranchId) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Выберите филиал',
      })
      return
    }

    createDepartment(
      {
        name: deptName.trim(),
        description: deptDescription.trim(),
        parent_id: deptParentId ? Number(deptParentId) : null,
        head_user_id: 0,
        icon: deptIcon || null,
        allowed_position_ids:
          deptAllowedPositionIds.length > 0 ? deptAllowedPositionIds : undefined,
        ...(branchesEnabled && deptBranchId ? { branch_id: Number(deptBranchId) } : {}),
      },
      {
        onSuccess: (id) => {
          updateFormData({
            department_id: id,
            department_name: deptName.trim(),
            position_id: undefined,
            branch_id: branchesEnabled && deptBranchId ? Number(deptBranchId) : undefined,
            manager_id: undefined,
          })
          setCreateTarget(null)
          resetDepartmentForm()
        },
      },
    )
  }

  const handleCreatePosition = async (data: CreatePositionRequest) => {
    if (!departmentId) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Сначала выберите отдел',
      })
      return
    }

    try {
      const positionId = await createPositionAsync(data)
      const existingIds = allowedPositions.map((p: Positions) => p.id)
      const nextIds = existingIds.includes(positionId)
        ? existingIds
        : [...existingIds, positionId]

      try {
        await departmentsApi.updateDepartment(departmentId, {
          allowed_position_ids: nextIds,
        })
      } catch (err: unknown) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: getApiErrorMessage(err),
        })
        return
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY }),
      ])

      updateFormData({ position_id: positionId })
      setCreateTarget(null)
    } catch {
      // Global mutation toast already shows the backend error
    }
  }

  const handleCreateBranch = () => {
    if (!branchName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название филиала',
      })
      return
    }

    createBranch(
      {
        name: branchName.trim(),
        description: branchDescription.trim() || null,
        code: branchCode.trim() || null,
      },
      {
        onSuccess: (id) => {
          updateFormData({ branch_id: id })
          setCreateTarget(null)
          resetBranchForm()
        },
      },
    )
  }

  return {
    branchesEnabled,
    allDepartments,
    branchSelectOptions,
    branchOptions: branchSelectOptions,
    allowedPositions,
    positionsFetching,
    createTarget,
    closeCreate,
    openCreateDepartment,
    openCreatePosition,
    openCreateBranch,
    deptName,
    setDeptName,
    deptDescription,
    setDeptDescription,
    deptParentId,
    setDeptParentId,
    deptAllowedPositionIds,
    setDeptAllowedPositionIds,
    deptBranchId,
    setDeptBranchId,
    deptIcon,
    setDeptIcon,
    isCreatingDepartment,
    handleCreateDepartment,
    isCreatingPosition,
    handleCreatePosition,
    branchName,
    setBranchName,
    branchDescription,
    setBranchDescription,
    branchCode,
    setBranchCode,
    isCreatingBranch,
    handleCreateBranch,
  }
}
