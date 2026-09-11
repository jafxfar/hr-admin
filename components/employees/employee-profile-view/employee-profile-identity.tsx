'use client'

import type { Employee } from '@/types/employees'
import { formatGender, formatMaritalStatus, formatProfileDate } from '@/lib/employee-profile-format'
import { EmployeeProfileInfoGrid } from './employee-profile-info-grid'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileIdentity({ employee }: { employee: Employee }) {
    const p = employee.properties

    const items = [
        { label: 'Фамилия', value: p?.last_name ?? '' },
        { label: 'Имя', value: p?.first_name ?? '' },
        { label: 'Отчество', value: p?.middle_name ?? '' },
        { label: 'Пол', value: formatGender(p?.gender) ?? '' },
        { label: 'Дата рождения', value: p?.birth_date ? formatProfileDate(p.birth_date) ?? '' : '' },
        { label: 'ИНН', value: p?.inn ?? '' },
        { label: 'Hikvision ID', value: p?.hikvision_id ?? '' },
        { label: 'Семейное положение', value: formatMaritalStatus(p?.marital_status) ?? '' },
        { label: 'Табельный номер', value: employee.personnel_number ?? '' },
    ]

    const hasAny = items.some((item) => item.value.trim())

    return (
        <EmployeeProfileSection title="Личные данные" isEmpty={!hasAny}>
            <EmployeeProfileInfoGrid items={items} columns={2} />
        </EmployeeProfileSection>
    )
}
