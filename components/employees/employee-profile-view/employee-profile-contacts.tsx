'use client'

import type { Employee } from '@/types/employees'
import { formatCityLabel } from '@/lib/employee-profile-format'
import { EmployeeProfileInfoGrid } from './employee-profile-info-grid'
import { EmployeeProfileSection } from './employee-profile-section'

const resolvePhone = (employee: Employee): string => {
    const fromProps = employee.properties?.phone?.trim()
    if (fromProps) return fromProps
    const single = employee.contact?.phone?.trim()
    if (single) return single
    const row = employee.contacts?.find((c) => c.phone?.trim())
    return row?.phone?.trim() ?? ''
}

export function EmployeeProfileContacts({ employee }: { employee: Employee }) {
    const p = employee.properties
    const emergencyContacts = employee.contacts ?? []

    const items = [
        { label: 'Email', value: employee.email ?? '' },
        { label: 'Телефон', value: resolvePhone(employee) },
        { label: 'Telegram', value: p?.telegram ?? '' },
        { label: 'Город', value: formatCityLabel(p?.city) ?? '' },
    ]

    const hasMain = items.some((item) => item.value.trim())
    const hasEmergency = emergencyContacts.length > 0

    return (
        <EmployeeProfileSection
            title="Контакты"
            description="Контактные данные и экстренные связи."
            isEmpty={!hasMain && !hasEmergency}
        >
            <div className="space-y-6">
                <EmployeeProfileInfoGrid items={items} columns={2} />
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        Экстренные контакты
                    </h3>
                    {hasEmergency ? (
                        <div className="overflow-hidden rounded-2xl border border-app-border/40">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-app-surface-2 text-xs font-bold uppercase tracking-widest text-app-text-muted">
                                    <tr>
                                        <th className="px-4 py-3">Имя</th>
                                        <th className="px-4 py-3">Телефон</th>
                                        <th className="px-4 py-3">Родство</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emergencyContacts.map((contact, index) => (
                                        <tr key={contact.id ?? index} className="border-t border-app-border/30">
                                            <td className="px-4 py-3 font-medium text-app-text">{contact.name || '—'}</td>
                                            <td className="px-4 py-3 text-app-text-muted">{contact.phone || '—'}</td>
                                            <td className="px-4 py-3 text-app-text-muted">{contact.relative || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-app-text-muted">Экстренные контакты не указаны.</p>
                    )}
                </div>
            </div>
        </EmployeeProfileSection>
    )
}
