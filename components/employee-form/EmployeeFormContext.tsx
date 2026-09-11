'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { CreateEmployeeRequest, Employee, Contacts } from '@/types/employees'
import type { WorkExperience } from '@/types/workExperience'
import type { Education } from '@/types/education'
import type { Contract } from '@/types/contracts'
import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import type { Document } from '@/types/documents'
import { buildFileUrl } from '@/lib/files'
import { getPositionDepartmentIds, getSystemRoleName } from '@/lib/employee-profile-normalize'
import {
  clearFieldError,
  matchesFieldError,
  type FormFieldError,
} from '@/lib/form-field-errors'

export type EmployeeFormData = Omit<
    CreateEmployeeRequest,
    'education' | 'work_experience' | 'salary' | 'contracts' | 'documents' | 'schedules' | 'contacts'
> & {
    educations: Education[]
    work_experiences: WorkExperience[]
    salaries: Salary[]
    contracts: Contract[]
    documents: Document[]
    schedules: Schedule[]
    contacts: Contacts[]
    position_change_reason_text?: string
    position_change_basis_file_base64?: string
    position_change_basis_filename?: string
    position_change_basis_type?: string
    termination_date?: string
    termination_reason?: string
    is_terminated?: boolean
    residence_same_as_registered: boolean
    /** UI-only label for DepartmentSelect (not sent in update payload) */
    department_name?: string
}

interface EmployeeFormContextType {
    formData: EmployeeFormData
    initialFormData: EmployeeFormData
    updateFormData: (data: Partial<EmployeeFormData>) => void
    fieldErrors: FormFieldError[]
    setFieldErrors: (errors: FormFieldError[]) => void
    clearFieldErrors: () => void
    hasFieldError: (field: string, row?: number, section?: string) => boolean
    hasRowError: (section: string, row: number) => boolean
    clearFieldErrorFor: (field: string, row?: number, section?: string) => void
}

const EmployeeFormContext = createContext<EmployeeFormContextType | null>(null)

export function employeeToFormData(employee: Employee): EmployeeFormData {
    const photoUrl = employee.properties?.profile_photo_url

    const currentPos = employee.position_history?.find(p => p.is_current)
        ?? employee.position_history?.[0]
        ?? null
    const positionDepartmentIds = getPositionDepartmentIds(employee)
    const businessRoleId =
        typeof employee.business_role === 'number'
            ? employee.business_role
            : employee.business_role && typeof employee.business_role === 'object' && 'id' in employee.business_role
                ? Number((employee.business_role as { id?: number }).id)
                : undefined
    const businessRoleName =
        typeof employee.business_role === 'object' && employee.business_role && 'name' in employee.business_role
            ? String((employee.business_role as { name?: string }).name ?? '')
            : undefined
    const systemRoleName = getSystemRoleName(employee)
    const resolvedRoleName = (systemRoleName?.trim() || businessRoleName?.trim()) || undefined

    const regTrim = (employee.properties?.registered_address ?? '').trim()
    const actTrim = (employee.properties?.actual_address ?? '').trim()
    const residence_same_as_registered = regTrim === actTrim

    return {
        email: employee.email,
        password: '',
        last_name: employee.properties?.last_name ?? '',
        first_name: employee.properties?.first_name ?? '',
        middle_name: employee.properties?.middle_name,
        gender: employee.properties?.gender,
        birth_date: employee.properties?.birth_date,
        phone: employee.properties?.phone,
        telegram: employee.properties?.telegram,
        inn: employee.properties?.inn ?? '',
        hikvision_id: employee.properties?.hikvision_id ?? '',
        city: employee.properties?.city,
        actual_address: employee.properties?.actual_address,
        registered_address: employee.properties?.registered_address,
        marital_status: employee.properties?.marital_status,
        ...(photoUrl ? { _photoPreview: buildFileUrl(photoUrl) } as any : {}),
        department_id: currentPos?.department_id ?? positionDepartmentIds.department_id,
        ...(positionDepartmentIds.department_name
            ? { department_name: positionDepartmentIds.department_name }
            : {}),
        position_id: currentPos?.position_id ?? positionDepartmentIds.position_id,
        branch_id: currentPos?.branch_id != null ? Number(currentPos.branch_id) : undefined,
        manager_id: currentPos?.manager_id ?? undefined,
        business_role_id: businessRoleId,
        ...(resolvedRoleName ? { role_name: resolvedRoleName } : {}),
        work_experiences: employee.work_experiences ?? employee.work_experience ?? [],
        educations: employee.educations ?? employee.education ?? [],
        salaries: employee.salaries ?? employee.salary ?? [],
        contracts: employee.contracts ?? [],
        schedules: employee.schedules ?? [],
        contacts: (employee.contacts ?? []).map(c => ({
            name: c.name,
            phone: c.phone,
            relative: c.relative,
        })),
        documents: (employee.documents ?? []).map(d => ({
            title: d.title,
            type: d.type,
            document_type_id: d.document_type_id ?? undefined,
            file_base64: '',
            filename: d.title,
            _serverId: d.id,
            _serverPath: d.path,
            _previewUrl: d.file_url
                ? buildFileUrl(d.file_url)
                : d.path
                  ? buildFileUrl(d.path)
                  : undefined,
        })) as any[],
        residence_same_as_registered,
        termination_date: employee.termination?.termination_date ?? undefined,
        termination_reason: employee.termination?.reason ?? undefined,
        is_terminated: employee.employment_status === 'terminated',
    }
}

export const resolveRegisteredAndActualAddresses = (formData: EmployeeFormData) => {
    const registered_address = (formData.registered_address ?? '').trim()
    const actual_address = formData.residence_same_as_registered
        ? registered_address
        : (formData.actual_address ?? '').trim()
    return { registered_address, actual_address }
}

const defaultFormData: EmployeeFormData = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    inn: '',
    hikvision_id: '',
    gender: '1',
    marital_status: 'false',
    role_name: 'employee',
    work_experiences: [],
    educations: [],
    contracts: [],
    salaries: [],
    schedules: [],
    documents: [],
    contacts: [],
    position_change_reason_text: '',
    position_change_basis_file_base64: '',
    position_change_basis_filename: '',
    position_change_basis_type: '',
    termination_date: '',
    termination_reason: '',
    is_terminated: false,
    residence_same_as_registered: true,
}

interface EmployeeFormProviderProps {
    children: React.ReactNode
    initialEmployee?: Employee
}

export function EmployeeFormProvider({ children, initialEmployee }: EmployeeFormProviderProps) {
    const initialFormData = initialEmployee ? employeeToFormData(initialEmployee) : defaultFormData
    const [formData, setFormData] = useState<EmployeeFormData>(initialFormData)
    const [fieldErrors, setFieldErrorsState] = useState<FormFieldError[]>([])

    const updateFormData = (data: Partial<EmployeeFormData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const setFieldErrors = useCallback((errors: FormFieldError[]) => {
        setFieldErrorsState(errors)
    }, [])

    const clearFieldErrors = useCallback(() => {
        setFieldErrorsState([])
    }, [])

    const hasFieldError = useCallback(
        (field: string, row?: number, section?: string) =>
            matchesFieldError(fieldErrors, field, row, section),
        [fieldErrors],
    )

    const hasRowError = useCallback(
        (section: string, row: number) =>
            fieldErrors.some((err) => err.section === section && err.row === row),
        [fieldErrors],
    )

    const clearFieldErrorFor = useCallback((field: string, row?: number, section?: string) => {
        setFieldErrorsState((prev) => clearFieldError(prev, field, row, section))
    }, [])

    return (
        <EmployeeFormContext.Provider
            value={{
                formData,
                initialFormData,
                updateFormData,
                fieldErrors,
                setFieldErrors,
                clearFieldErrors,
                hasFieldError,
                hasRowError,
                clearFieldErrorFor,
            }}
        >
            {children}
        </EmployeeFormContext.Provider>
    )
}

export function useEmployeeForm() {
    const ctx = useContext(EmployeeFormContext)
    if (!ctx) throw new Error('useEmployeeForm must be used within EmployeeFormProvider')
    return ctx
}
