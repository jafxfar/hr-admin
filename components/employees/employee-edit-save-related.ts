import type { EmployeeFormData } from '@/components/employee-form/EmployeeFormContext'
import { getEmployeeEditChangeFlags } from './employee-edit-validation'
import { buildEmployeeUpdatePayload } from './employee-edit-build-payload'
import type { EmployeeEditMutations } from './employee-edit-mutations'
import {
  saveEmployeeEducationAndSchedules,
  saveEmployeeSalaryWorkContractsDocs,
} from './employee-edit-save-collections'

export const saveEmployeeEditRelated = async (
  employeeId: number,
  formData: EmployeeFormData,
  initialFormData: EmployeeFormData,
  branchesEnabled: boolean,
  mutations: EmployeeEditMutations,
) => {
  const { hasPositionOrDepartmentChange, hasAssignmentChange } = getEmployeeEditChangeFlags(
    formData,
    initialFormData,
  )

  await mutations.updateEmployee(
    buildEmployeeUpdatePayload(
      formData,
      branchesEnabled,
      hasAssignmentChange,
      hasPositionOrDepartmentChange,
    ),
  )

  await saveEmployeeEducationAndSchedules(employeeId, formData, initialFormData, mutations)
  await saveEmployeeSalaryWorkContractsDocs(employeeId, formData, initialFormData, mutations)
}
