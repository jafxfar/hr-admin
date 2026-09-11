'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DEPARTMENTS_QUERY_KEY } from '@/hooks/use-departments'
import { EMPLOYEES_QUERY_KEY } from '@/hooks/use-employees'
import { employeesApi } from '@/api/employee'
import type { Department } from '@/types/departments'

type AssignEmployeeParams = {
  userId: number
  positionId: number
  managerId?: number
  reasonText?: string
  basisFileBase64?: string
  basisFilename?: string
  basisType?: string
}

export const useAssignEmployeeToDepartmentMutation = (
  departmentId: number,
  currentDepartment: Department | undefined,
  branchesEnabled: boolean,
  onSuccess: () => void,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      mutationAction: 'update' as const,
      successTitle: 'Сотрудник добавлен в отдел',
    },
    mutationFn: async ({
      userId,
      positionId,
      managerId,
      reasonText,
      basisFileBase64,
      basisFilename,
      basisType,
    }: AssignEmployeeParams) => {
      const deptBranchId = currentDepartment?.branch_id
      const trimmedReason = reasonText?.trim()
      const trimmedBasisFile = basisFileBase64?.trim()
      const trimmedBasisFilename = basisFilename?.trim()
      await employeesApi.updateEmployee(userId, {
        department_id: departmentId,
        position_id: positionId,
        ...(managerId ? { manager_id: managerId } : {}),
        ...(branchesEnabled && deptBranchId ? { branch_id: deptBranchId } : {}),
        ...(trimmedReason ? { position_change_reason_text: trimmedReason } : {}),
        ...(trimmedBasisFile && trimmedBasisFilename
          ? {
              position_change_basis_file_base64: trimmedBasisFile,
              position_change_basis_filename: trimmedBasisFilename,
            }
          : {}),
        ...(basisType ? { position_change_basis_type: basisType } : {}),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY })
      onSuccess()
    },
  })
}
