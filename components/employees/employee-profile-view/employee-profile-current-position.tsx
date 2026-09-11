'use client'

import Link from 'next/link'
import type { Employee, EmployeeProfileViewModel } from '@/types/employees'
import { EmployeeProfileInfoGrid } from './employee-profile-info-grid'
import { EmployeeProfileSection } from './employee-profile-section'

const resolveManager = (employee: Employee) => {
    const pd = employee.position_department?.position
    if (pd && typeof pd === 'object' && pd !== null && 'manager' in pd) {
        return pd.manager ?? null
    }
    return null
}

export function EmployeeProfileCurrentPosition({
    employee,
    profile,
    branchesEnabled,
}: {
    employee: Employee
    profile: EmployeeProfileViewModel
    branchesEnabled: boolean
}) {
    const department = profile.department
    const position = profile.position
    const manager = resolveManager(employee)
    const branchName = branchesEnabled ? profile.branch?.name?.trim() ?? '' : ''

    const deptObj = employee.position_department?.department
    const departmentDescription =
        typeof deptObj === 'object' && deptObj && 'description' in deptObj
            ? String(deptObj.description ?? '').trim()
            : employee.department?.description?.trim() ?? ''

    const items = [
        { label: 'Отдел', value: department?.name ?? '' },
        { label: 'Описание отдела', value: departmentDescription },
        { label: 'Должность', value: position?.title ?? '' },
        { label: 'Описание должности', value: position?.description ?? '' },
        ...(branchesEnabled ? [{ label: 'Филиал', value: branchName }] : []),
        {
            label: 'Непосредственный руководитель',
            value: manager?.full_name?.trim() ?? '',
        },
    ]

    return (
        <EmployeeProfileSection title="Текущая позиция">
            <div className="space-y-4">
                <EmployeeProfileInfoGrid items={items} columns={2} />
                {manager?.id ? (
                    <Link
                        href={`/employees/${manager.id}/view`}
                        className="inline-flex text-sm font-semibold text-brand-accent hover:underline"
                    >
                        Открыть профиль руководителя
                    </Link>
                ) : null}
            </div>
        </EmployeeProfileSection>
    )
}
