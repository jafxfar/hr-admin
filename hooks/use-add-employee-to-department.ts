'use client'

import { useState, useEffect, useRef } from 'react'
import { useDepartmentEmployees } from '@/hooks/use-departments'
import { useEmployeesSearch } from '@/hooks/use-employees'
import { usePositionsByDepartment } from '@/hooks/use-positions'
import { useToast } from '@/hooks/use-toast'
import type { Department } from '@/types/departments'
import { readPositionChangeBasisFile } from '@/components/departments/department-assign-utils'
import { useAssignEmployeeToDepartmentMutation } from '@/hooks/use-assign-employee-to-department-mutation'

const MANAGER_LIST_PAGE_SIZE = 20

export const useAddEmployeeToDepartment = (
  departmentId: number,
  currentDepartment: Department | undefined,
  branchesEnabled: boolean,
) => {
  const { toast } = useToast()
  const [addOpen, setAddOpen] = useState(false)
  const [addUserSearch, setAddUserSearch] = useState('')
  const [debouncedAddUserSearch, setDebouncedAddUserSearch] = useState('')
  const [addUserId, setAddUserId] = useState('')
  const [addPositionId, setAddPositionId] = useState('')
  const [addManagerId, setAddManagerId] = useState('')
  const [addPositionChangeReason, setAddPositionChangeReason] = useState('')
  const [addPositionChangeBasisFileBase64, setAddPositionChangeBasisFileBase64] = useState('')
  const [addPositionChangeBasisFilename, setAddPositionChangeBasisFilename] = useState('')
  const [addPositionChangeBasisType, setAddPositionChangeBasisType] = useState('')
  const [addPositionChangeFileError, setAddPositionChangeFileError] = useState<string | null>(null)
  const addPositionChangeFileInputRef = useRef<HTMLInputElement>(null)

  const resetAddEmployeeForm = () => {
    setAddUserSearch('')
    setDebouncedAddUserSearch('')
    setAddUserId('')
    setAddPositionId('')
    setAddManagerId('')
    setAddPositionChangeReason('')
    setAddPositionChangeBasisFileBase64('')
    setAddPositionChangeBasisFilename('')
    setAddPositionChangeBasisType('')
    setAddPositionChangeFileError(null)
    if (addPositionChangeFileInputRef.current) addPositionChangeFileInputRef.current.value = ''
  }

  const assignToDepartment = useAssignEmployeeToDepartmentMutation(
    departmentId,
    currentDepartment,
    branchesEnabled,
    () => {
      setAddOpen(false)
      resetAddEmployeeForm()
    },
  )

  const closeAddModal = () => {
    if (assignToDepartment.isPending) return
    setAddOpen(false)
    resetAddEmployeeForm()
  }

  const handleAddPositionChangeFile = (file: File) => {
    readPositionChangeBasisFile(file, ({ base64, filename, error }) => {
      setAddPositionChangeBasisFileBase64(base64)
      setAddPositionChangeBasisFilename(filename)
      setAddPositionChangeFileError(error)
    })
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAddUserSearch(addUserSearch.trim()), 400)
    return () => clearTimeout(t)
  }, [addUserSearch])

  useEffect(() => {
    setAddManagerId('')
  }, [addUserId])

  const canSearchUsers = debouncedAddUserSearch.length >= 2
  const { data: addUserSearchData, isFetching: isAddUserSearchLoading } = useEmployeesSearch(
    { q: debouncedAddUserSearch, include_inactive: true, page: 1, page_size: 30 },
    addOpen && canSearchUsers,
  )
  const addUserSearchItems = addUserSearchData?.items ?? []

  const { data: deptPositions = [], isLoading: deptPositionsLoading } = usePositionsByDepartment(
    addOpen ? departmentId : undefined,
  )

  const { data: managerListData } = useDepartmentEmployees(
    departmentId,
    1,
    MANAGER_LIST_PAGE_SIZE,
    false,
    addOpen,
  )
  const managerCandidates = (managerListData?.items ?? []).filter((e) => String(e.id) !== addUserId)

  const handleAddToDepartment = () => {
    const uid = Number(addUserId)
    const pid = Number(addPositionId)
    const reasonText = addPositionChangeReason.trim()
    const basisFileBase64 = addPositionChangeBasisFileBase64.trim()
    const basisFilename = addPositionChangeBasisFilename.trim()
    const basisType = addPositionChangeBasisType.trim()

    if (!uid || !pid) {
      toast({
        variant: 'destructive',
        title: 'Заполните поля',
        description: 'Выберите сотрудника и должность',
      })
      return
    }
    assignToDepartment.mutate({
      userId: uid,
      positionId: pid,
      managerId: addManagerId ? Number(addManagerId) : undefined,
      reasonText: reasonText || undefined,
      basisFileBase64: basisFileBase64 || undefined,
      basisFilename: basisFilename || undefined,
      basisType: basisType || undefined,
    })
  }

  const openAddModal = () => {
    setAddOpen(true)
    resetAddEmployeeForm()
  }

  return {
    addOpen,
    openAddModal,
    closeAddModal,
    addUserSearch,
    setAddUserSearch,
    addUserId,
    setAddUserId,
    addPositionId,
    setAddPositionId,
    addManagerId,
    setAddManagerId,
    addPositionChangeReason,
    setAddPositionChangeReason,
    addPositionChangeBasisFilename,
    addPositionChangeBasisType,
    setAddPositionChangeBasisType,
    addPositionChangeFileError,
    addPositionChangeFileInputRef,
    handleAddPositionChangeFile,
    isAddUserSearchLoading,
    addUserSearchItems,
    deptPositions,
    deptPositionsLoading,
    managerCandidates,
    assignToDepartment,
    handleAddToDepartment,
  }
}
