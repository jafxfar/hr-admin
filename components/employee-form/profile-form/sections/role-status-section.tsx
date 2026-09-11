'use client'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { SectionHeader } from '@/components/custom-ui'
import { useRbacRoles } from '@/hooks/use-permissions'
import { InlineSelect } from '../inline-select'
import type { BasicOption } from '../types'
import { labelStyle, sectionCardStyle } from '../styles'

export function RoleStatusSection() {
    const { formData, updateFormData } = useEmployeeForm()
    const { data: rolesData, isLoading: rolesLoading } = useRbacRoles(false)
    const roleOptions: BasicOption[] = (rolesData ?? []).map((role) => ({
        value: role.name,
        label: role.description?.trim() ? `${role.name} (${role.description.trim()})` : role.name,
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader title="Роль и статус" description="Уровень доступа и текущий статус сотрудника в системе." />
            </div>
            <div className="lg:col-span-2" style={sectionCardStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label style={labelStyle}>
                            Роль <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <InlineSelect
                            value={formData.role_name ?? ''}
                            onChange={(val) => updateFormData({ role_name: val })}
                            options={roleOptions}
                            placeholder={rolesLoading ? 'Загрузка ролей…' : 'Выберите роль'}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Семейное положение</label>
                        <InlineSelect
                            value={formData.marital_status ?? 'false'}
                            onChange={(val) => updateFormData({ marital_status: val })}
                            options={[
                                { value: 'false', label: 'Холост / не замужем' },
                                { value: 'true', label: 'Женат / замужем' },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
