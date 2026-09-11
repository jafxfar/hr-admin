'use client'

import { Camera, X } from 'lucide-react'
import type { KeyboardEvent, MouseEvent, RefObject } from 'react'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { DarkInput, SectionHeader, DatePickerField } from '@/components/custom-ui'
import { labelStyle, sectionCardStyle } from '../styles'

export function PersonalIdentitySection({
    photoInputRef,
    photoSrc,
    onPhotoSelect,
    onPhotoRemove,
    isRemovingPhoto = false,
}: {
    photoInputRef: RefObject<HTMLInputElement | null>
    photoSrc?: string
    onPhotoSelect: (file: File) => void
    onPhotoRemove: () => void
    isRemovingPhoto?: boolean
}) {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()

    const handleFieldChange = (field: string, value: string) => {
        clearFieldErrorFor(field)
        updateFormData({ [field]: value } as Partial<typeof formData>)
    }

    const handleRemoveClick = (e: MouseEvent | KeyboardEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isRemovingPhoto) return
        onPhotoRemove()
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader title="Личные данные" description="Основные идентификационные данные сотрудника согласно документам." />
                <div className="mt-8">
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        ref={photoInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) onPhotoSelect(file)
                        }}
                    />
                    <div className="relative inline-block group" style={{ width: 96, height: 96 }}>
                        <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            aria-label="Загрузить фото"
                            style={{
                                width: 96,
                                height: 96,
                                borderRadius: '50%',
                                background: photoSrc ? 'transparent' : 'var(--app-surface-0)',
                                border: '2px dashed var(--app-border-accent)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-accent)')}
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--app-border-accent)')
                            }
                        >
                            {photoSrc ? (
                                <img src={photoSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <Camera size={24} className="text-app-text-muted" />
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: 'var(--app-text-muted)',
                                            marginTop: 6,
                                        }}
                                    >
                                        Фото
                                    </span>
                                </>
                            )}
                        </button>
                        {photoSrc ? (
                            <button
                                type="button"
                                tabIndex={0}
                                aria-label="Удалить фото"
                                disabled={isRemovingPhoto}
                                onClick={handleRemoveClick}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') handleRemoveClick(e)
                                }}
                                className="absolute -top-1 -right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-60"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.72)',
                                    border: '2px solid var(--app-surface-0)',
                                    cursor: isRemovingPhoto ? 'wait' : 'pointer',
                                    color: '#fff',
                                }}
                            >
                                <X size={14} strokeWidth={2.5} aria-hidden />
                            </button>
                        ) : null}
                    </div>
                    <p className="text-xs italic mt-3" style={{ color: 'var(--app-text-muted)' }}>
                        JPG, PNG или WebP
                    </p>
                </div>
            </div>

            <div className="lg:col-span-2" style={{ ...sectionCardStyle }}>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 128,
                        height: 128,
                        background: 'rgb(var(--theme-primary-rgb) / 0.04)',
                        filter: 'blur(40px)',
                        borderRadius: '50%',
                        marginTop: -32,
                        marginRight: -32,
                    }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label style={labelStyle}>
                            Имя <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <DarkInput
                            placeholder="Иван"
                            value={formData.first_name ?? ''}
                            hasError={hasFieldError('first_name')}
                            onChange={(e) => handleFieldChange('first_name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Отчество</label>
                        <DarkInput
                            placeholder="Иванович"
                            value={formData.middle_name ?? ''}
                            onChange={(e) => updateFormData({ middle_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            Фамилия <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <DarkInput
                            placeholder="Иванов"
                            value={formData.last_name ?? ''}
                            hasError={hasFieldError('last_name')}
                            onChange={(e) => handleFieldChange('last_name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            Дата рождения <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <DatePickerField
                            isBirthDate={true}
                            value={formData.birth_date ?? ''}
                            hasError={hasFieldError('birth_date')}
                            onChange={(next) => {
                                clearFieldErrorFor('birth_date')
                                updateFormData({ birth_date: next })
                            }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>ИНН</label>
                        <DarkInput
                            inputMode="numeric"
                            placeholder="5–20 цифр"
                            value={formData.inn ?? ''}
                            hasError={hasFieldError('inn')}
                            onChange={(e) => {
                                clearFieldErrorFor('inn')
                                updateFormData({ inn: e.target.value.replace(/\D/g, '').slice(0, 20) })
                            }}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Hikvision ID</label>
                        <DarkInput
                            placeholder="ID в системе Hikvision"
                            value={formData.hikvision_id ?? ''}
                            hasError={hasFieldError('hikvision_id')}
                            onChange={(e) => {
                                clearFieldErrorFor('hikvision_id')
                                updateFormData({ hikvision_id: e.target.value })
                            }}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label style={labelStyle}>
                            Пол <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <div className="flex gap-1 p-1" style={{ background: 'var(--app-surface-1)', borderRadius: '24px', height: 52 }}>
                            {[
                                { value: '1', label: 'Мужской' },
                                { value: '0', label: 'Женский' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => updateFormData({ gender: opt.value })}
                                    style={{
                                        flex: 1,
                                        borderRadius: '24px',
                                        background: (formData.gender ?? '1') === opt.value ? 'var(--brand-accent)' : 'transparent',
                                        color:
                                            (formData.gender ?? '1') === opt.value
                                                ? 'var(--brand-accent-on-alt)'
                                                : 'var(--app-text-muted)',
                                        fontWeight: 700,
                                        fontSize: 12,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
