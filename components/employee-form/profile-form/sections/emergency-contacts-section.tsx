'use client'

import { Plus, X } from 'lucide-react'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { DarkInput, SectionHeader } from '@/components/custom-ui'
import { labelStyle, sectionCardStyle } from '../styles'

export function EmergencyContactsSection() {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader title="Ближние" description="Экстренные контакты и ближайшие родственники сотрудника." />
            </div>
            <div className="lg:col-span-2" style={sectionCardStyle}>
                {(formData.contacts ?? []).map((contact, idx) => {
                    const row = idx + 1
                    return (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4"
                        style={{
                            borderBottom:
                                idx < (formData.contacts?.length ?? 0) - 1 ? '1px solid var(--app-surface-4)' : 'none',
                        }}
                    >
                        <div>
                            <label style={labelStyle}>Имя</label>
                            <DarkInput
                                placeholder="Имя"
                                value={contact.name}
                                hasError={hasFieldError('name', row, 'contacts')}
                                onChange={(e) => {
                                    clearFieldErrorFor('name', row, 'contacts')
                                    const updated = [...(formData.contacts ?? [])]
                                    updated[idx] = { ...updated[idx], name: e.target.value }
                                    updateFormData({ contacts: updated })
                                }}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Телефон</label>
                            <DarkInput
                                placeholder="+992 ..."
                                value={contact.phone}
                                hasError={hasFieldError('phone', row, 'contacts')}
                                onChange={(e) => {
                                    clearFieldErrorFor('phone', row, 'contacts')
                                    const updated = [...(formData.contacts ?? [])]
                                    updated[idx] = { ...updated[idx], phone: e.target.value }
                                    updateFormData({ contacts: updated })
                                }}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Родство</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <DarkInput
                                    placeholder="брат, мать..."
                                    value={contact.relative}
                                    onChange={(e) => {
                                        const updated = [...(formData.contacts ?? [])]
                                        updated[idx] = { ...updated[idx], relative: e.target.value }
                                        updateFormData({ contacts: updated })
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (formData.contacts ?? []).filter((_, i) => i !== idx)
                                        updateFormData({ contacts: updated })
                                    }}
                                    style={{
                                        flexShrink: 0,
                                        width: 44,
                                        height: 44,
                                        borderRadius: '0.75rem',
                                        background: 'rgba(255,75,75,0.1)',
                                        border: '1px solid rgba(255,75,75,0.2)',
                                        color: '#ff4b4b',
                                        fontSize: 16,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                    )
                })}

                <button
                    type="button"
                    onClick={() =>
                        updateFormData({
                            contacts: [...(formData.contacts ?? []), { name: '', phone: '', relative: '' }],
                        })
                    }
                    style={{
                        marginTop: (formData.contacts?.length ?? 0) > 0 ? 8 : 0,
                        padding: '10px 20px',
                        borderRadius: '0.75rem',
                        background: 'transparent',
                        border: '1px solid var(--app-border-accent)',
                        color: 'var(--app-text-muted)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        const btn = e.currentTarget as HTMLButtonElement
                        btn.style.borderColor = 'var(--brand-accent)'
                        btn.style.color = 'var(--brand-accent)'
                    }}
                    onMouseLeave={(e) => {
                        const btn = e.currentTarget as HTMLButtonElement
                        btn.style.borderColor = 'var(--app-border-accent)'
                        btn.style.color = 'var(--app-text-muted)'
                    }}
                >
                    <span className="inline-flex items-center gap-2">
                        <Plus size={14} />
                        Добавить контакт
                    </span>
                </button>
            </div>
        </div>
    )
}
