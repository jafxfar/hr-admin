import type { EmployeeFormData } from '@/components/employee-form/EmployeeFormContext'
import { resolveRegisteredAndActualAddresses } from '@/components/employee-form'
import type { UpdateEmployeeRequest } from '@/types/employees'

export const buildEmployeeUpdatePayload = (
  formData: EmployeeFormData,
  branchesEnabled: boolean,
  hasAssignmentChange: boolean,
  hasPositionOrDepartmentChange: boolean,
): UpdateEmployeeRequest => {
  const innDigits = (formData.inn ?? '').replace(/\D/g, '')
  const hikvisionId = (formData.hikvision_id ?? '').trim()
  const { registered_address, actual_address } = resolveRegisteredAndActualAddresses(formData)

  const payload: UpdateEmployeeRequest = {
    email: formData.email,
    first_name: formData.first_name,
    last_name: formData.last_name,
    middle_name: formData.middle_name,
    phone: formData.phone,
    telegram: formData.telegram,
    inn: innDigits || undefined,
    hikvision_id: hikvisionId || undefined,
    birth_date: formData.birth_date,
    gender: formData.gender,
    city: formData.city,
    actual_address,
    registered_address,
    marital_status: formData.marital_status,
    role_name: formData.role_name,
    profile_photo_base64: formData.profile_photo_base64,
    profile_photo_filename: formData.profile_photo_filename,
    contacts: formData.contacts ?? [],
  }

  if (hasAssignmentChange) {
    payload.position_id = formData.position_id
    payload.department_id = formData.department_id
    payload.manager_id = formData.manager_id
    if (branchesEnabled && formData.branch_id) {
      payload.branch_id = formData.branch_id
    }
  }

  if (hasPositionOrDepartmentChange) {
    const reasonText = (formData.position_change_reason_text ?? '').trim()
    const basisFileBase64 = (formData.position_change_basis_file_base64 ?? '').trim()
    const basisFilename = (formData.position_change_basis_filename ?? '').trim()
    const basisType = (formData.position_change_basis_type ?? '').trim()

    if (reasonText) {
      payload.position_change_reason_text = reasonText
    }
    if (basisFileBase64 && basisFilename) {
      payload.position_change_basis_file_base64 = basisFileBase64
      payload.position_change_basis_filename = basisFilename
    }
    if (basisType) {
      payload.position_change_basis_type = basisType
    }
  }

  return payload
}
