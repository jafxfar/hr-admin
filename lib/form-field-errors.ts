import { ApiError, getApiErrorMessage } from '@/lib/api-error'
import { getEmployeeFieldLabel } from '@/lib/employee-field-labels'

export type FormFieldError = {
  field: string
  fieldLabel: string
  row?: number
  section?: string
}

export class RowSaveError extends Error {
  fieldError: FormFieldError

  constructor(fieldError: FormFieldError, message?: string) {
    super(message ?? formatFieldError(fieldError))
    this.name = 'RowSaveError'
    this.fieldError = fieldError
  }
}

export const formatFieldError = (err: FormFieldError): string =>
  err.row != null
    ? `Ошибка в строке ${err.row}: ${err.fieldLabel}`
    : `Ошибка: ${err.fieldLabel}`

const extractFieldFromLoc = (loc: unknown): string | undefined => {
  if (!Array.isArray(loc) || loc.length === 0) return undefined
  const field = loc.filter((part) => part !== 'body' && part !== 'query' && part !== 'path').pop()
  return typeof field === 'string' || typeof field === 'number' ? String(field) : undefined
}

export const parseApiFieldFromError = (error: unknown): string | undefined => {
  if (!(error instanceof ApiError) || error.detail == null) {
    return undefined
  }

  if (Array.isArray(error.detail) && error.detail.length > 0) {
    const first = error.detail[0]
    if (first && typeof first === 'object' && 'loc' in first) {
      return extractFieldFromLoc((first as { loc?: unknown }).loc)
    }
  }

  return undefined
}

export const buildApiFieldError = (
  error: unknown,
  options?: { row?: number; section?: string; fallbackField?: string },
): FormFieldError => {
  const apiField = parseApiFieldFromError(error) ?? options?.fallbackField ?? 'field'
  return {
    field: apiField,
    fieldLabel: getEmployeeFieldLabel(apiField),
    row: options?.row,
    section: options?.section,
  }
}

export const isRowSaveError = (error: unknown): error is RowSaveError =>
  error instanceof RowSaveError

export const getFieldErrorMessage = (error: unknown, fallback = 'Произошла ошибка'): string => {
  if (isRowSaveError(error)) {
    return formatFieldError(error.fieldError)
  }
  return getApiErrorMessage(error, fallback)
}

export const matchesFieldError = (
  errors: FormFieldError[],
  field: string,
  row?: number,
  section?: string,
): boolean =>
  errors.some(
    (err) =>
      err.field === field &&
      (row == null || err.row === row) &&
      (section == null || err.section === section),
  )

export const clearFieldError = (
  errors: FormFieldError[],
  field: string,
  row?: number,
  section?: string,
): FormFieldError[] =>
  errors.filter(
    (err) =>
      !(
        err.field === field &&
        (row == null || err.row === row) &&
        (section == null || err.section === section)
      ),
  )
