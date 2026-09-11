import type { EmployeeFormData } from '@/components/employee-form/EmployeeFormContext'

interface ProgressField {
    label: string
    filled: boolean
}

export function useEmployeeProgress(formData: EmployeeFormData, branchesEnabled = false) {
    const branchField: ProgressField = {
        label: 'Филиал',
        filled: branchesEnabled ? !!(formData.branch_id && formData.branch_id > 0) : true,
    }

    const addressFilled =
        !!formData.registered_address?.trim() &&
        (formData.residence_same_as_registered ? true : !!formData.actual_address?.trim())

    const fields: ProgressField[] = [
        { label: 'Имя',           filled: !!formData.first_name?.trim() },
        { label: 'Фамилия',       filled: !!formData.last_name?.trim() },
        { label: 'Телефон',       filled: !!formData.phone?.trim() },
        { label: 'Дата рождения', filled: !!formData.birth_date?.trim() },
        { label: 'Город',         filled: !!formData.city?.trim() },
        { label: 'Адрес',         filled: addressFilled },
        { label: 'Отдел',         filled: !!formData.department_id && formData.department_id > 0 },
        ...(branchesEnabled ? [branchField] : []),
        { label: 'Должность',     filled: !!formData.position_id && formData.position_id > 0 },
        { label: 'Зарплата',      filled: (formData.salaries?.length ?? 0) > 0 },
        { label: 'Расписание',    filled: (formData.schedules?.length ?? 0) > 0 },
        { label: 'Образование',   filled: (formData.educations?.length ?? 0) > 0 },
        { label: 'Фото',          filled: !!formData.profile_photo_base64 || !!((formData as any)._photoPreview) },
    ]

    const filled = fields.filter(f => f.filled).length
    const total = fields.length
    const percent = Math.round((filled / total) * 100)

    return { fields, filled, total, percent }
}
