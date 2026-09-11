import type { EmployeeFormData } from '@/components/employee-form/EmployeeFormContext'
import { isValidEmail } from '@/lib/email'
import type { FormFieldError } from '@/lib/form-field-errors'
import { normalizeOptionalId } from './employee-edit-utils'

type ValidateParams = {
  formData: EmployeeFormData
  initialFormData: EmployeeFormData
  branchesEnabled: boolean
}

type ValidateCreateParams = {
  formData: EmployeeFormData
  branchesEnabled: boolean
  isNew?: boolean
}

const pushError = (
  errors: FormFieldError[],
  field: string,
  fieldLabel: string,
  row?: number,
  section?: string,
) => {
  errors.push({ field, fieldLabel, row, section })
}

export const validateEmployeeCreate = ({
  formData,
  branchesEnabled,
  isNew = true,
}: ValidateCreateParams): FormFieldError[] => {
  const errors: FormFieldError[] = []
  const innDigits = (formData.inn ?? '').replace(/\D/g, '')

  if (!formData.last_name?.trim()) pushError(errors, 'last_name', 'Фамилия')
  if (!formData.first_name?.trim()) pushError(errors, 'first_name', 'Имя')
  if (isNew && !formData.password?.trim()) pushError(errors, 'password', 'Пароль')
  if (formData.email?.trim() && !isValidEmail(formData.email)) {
    pushError(errors, 'email', 'E-mail')
  }
  if (formData.inn?.trim() && (innDigits.length < 5 || innDigits.length > 20)) {
    pushError(errors, 'inn', 'ИНН')
  }
  if (
    branchesEnabled &&
    formData.department_id &&
    formData.position_id &&
    !(formData.branch_id && formData.branch_id > 0)
  ) {
    pushError(errors, 'branch_id', 'Филиал')
  }

  ;(formData.contacts ?? []).forEach((contact, index) => {
    const row = index + 1
    const hasAny = Boolean(contact.name?.trim() || contact.phone?.trim() || contact.relative?.trim())
    if (hasAny && !contact.phone?.trim()) {
      pushError(errors, 'phone', 'Телефон', row, 'contacts')
    }
    if (hasAny && !contact.name?.trim()) {
      pushError(errors, 'name', 'Имя', row, 'contacts')
    }
  })

  return errors
}

export const validateEmployeeEdit = ({
  formData,
  initialFormData,
  branchesEnabled,
}: ValidateParams): FormFieldError[] => {
  const errors = validateEmployeeCreate({ formData, branchesEnabled, isNew: false })
  const hasPositionOrDepartmentChange =
    normalizeOptionalId(formData.position_id) !== normalizeOptionalId(initialFormData.position_id) ||
    normalizeOptionalId(formData.department_id) !== normalizeOptionalId(initialFormData.department_id)
  const hasAssignmentChange =
    hasPositionOrDepartmentChange ||
    normalizeOptionalId(formData.branch_id) !== normalizeOptionalId(initialFormData.branch_id) ||
    normalizeOptionalId(formData.manager_id) !== normalizeOptionalId(initialFormData.manager_id)
  const innDigits = (formData.inn ?? '').replace(/\D/g, '')

  if (formData.inn?.trim() && (innDigits.length < 5 || innDigits.length > 20)) {
    if (!errors.some((err) => err.field === 'inn')) {
      pushError(errors, 'inn', 'ИНН')
    }
  }

  if (hasAssignmentChange && (!formData.department_id || !formData.position_id)) {
    if (!formData.department_id) pushError(errors, 'department_id', 'Отдел')
    if (!formData.position_id) pushError(errors, 'position_id', 'Должность')
  }

  const terminationDate = (formData.termination_date ?? '').trim()
  const terminationReason = (formData.termination_reason ?? '').trim()
  const initialTerminationDate = (initialFormData.termination_date ?? '').trim()
  const initialTerminationReason = (initialFormData.termination_reason ?? '').trim()
  const terminationChanged =
    terminationDate !== initialTerminationDate || terminationReason !== initialTerminationReason

  if (terminationDate && terminationChanged && terminationReason.length < 3) {
    pushError(errors, 'termination_reason', 'Причина увольнения')
  }

  return errors
}

export const getEmployeeEditChangeFlags = (
  formData: EmployeeFormData,
  initialFormData: EmployeeFormData,
) => {
  const hasPositionOrDepartmentChange =
    normalizeOptionalId(formData.position_id) !== normalizeOptionalId(initialFormData.position_id) ||
    normalizeOptionalId(formData.department_id) !== normalizeOptionalId(initialFormData.department_id)
  const hasAssignmentChange =
    hasPositionOrDepartmentChange ||
    normalizeOptionalId(formData.branch_id) !== normalizeOptionalId(initialFormData.branch_id) ||
    normalizeOptionalId(formData.manager_id) !== normalizeOptionalId(initialFormData.manager_id)

  return { hasPositionOrDepartmentChange, hasAssignmentChange }
}
