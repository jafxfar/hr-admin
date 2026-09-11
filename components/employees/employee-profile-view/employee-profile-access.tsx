'use client'

import type { Employee } from '@/types/employees'
import {
    formatEmploymentStatus,
    formatProfileDate,
    formatProfileDateTime,
    formatBooleanLabel,
} from '@/lib/employee-profile-format'
import { getBusinessRoleLabel, getSystemRoleName } from '@/lib/employee-profile-normalize'
import { EmployeeProfileInfoGrid } from './employee-profile-info-grid'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileAccess({ employee }: { employee: Employee }) {
    const systemRole = getSystemRoleName(employee) ?? ''
    const businessRole = getBusinessRoleLabel(employee) ?? ''
    const employmentStatus = employee.employment_status
    const statusLabel = employmentStatus
        ? formatEmploymentStatus(employmentStatus)
        : formatBooleanLabel(employee.is_active, 'Активен', 'Неактивен')

    const items = [
        { label: 'Системная роль', value: systemRole },
        { label: 'Бизнес-роль', value: businessRole },
        { label: 'Статус', value: statusLabel },
        { label: 'Доступ в админку', value: formatBooleanLabel(employee.can_access_admin_ui) },
        { label: 'Официальное трудоустройство', value: formatBooleanLabel(employee.is_official_employment) },
        { label: 'Дата регистрации в системе', value: formatProfileDateTime(employee.created_at) ?? '' },
    ]

    const terminationItems =
        employee.termination?.termination_date || employee.termination?.reason
            ? [
                  {
                      label: 'Дата увольнения',
                      value: formatProfileDate(employee.termination?.termination_date) ?? '—',
                  },
                  { label: 'Причина увольнения', value: employee.termination?.reason?.trim() || '—' },
              ]
            : []

    return (
        <>
            <EmployeeProfileSection title="Роль и статус системы">
                <EmployeeProfileInfoGrid items={items} columns={2} />
            </EmployeeProfileSection>
            {terminationItems.length > 0 ? (
                <EmployeeProfileSection title="Увольнение">
                    <EmployeeProfileInfoGrid items={terminationItems} columns={2} />
                </EmployeeProfileSection>
            ) : null}
        </>
    )
}
