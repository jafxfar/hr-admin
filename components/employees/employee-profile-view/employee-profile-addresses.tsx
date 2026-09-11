'use client'

import type { Employee } from '@/types/employees'
import { formatCityLabel } from '@/lib/employee-profile-format'
import { EmployeeProfileInfoGrid } from './employee-profile-info-grid'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileAddresses({ employee }: { employee: Employee }) {
    const p = employee.properties
    const structured = employee.addresses ?? []

    const flatItems = [
        { label: 'Адрес регистрации', value: p?.registered_address ?? '' },
        { label: 'Место проживания', value: p?.actual_address ?? '' },
    ]

    const hasFlat = flatItems.some((item) => item.value.trim())
    const hasStructured = structured.length > 0

    return (
        <EmployeeProfileSection title="Адреса" isEmpty={!hasFlat && !hasStructured}>
            <div className="space-y-6">
                <EmployeeProfileInfoGrid items={flatItems} columns={1} />
            </div>
        </EmployeeProfileSection>
    )
}
