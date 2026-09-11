'use client'

import { Mail, Phone } from 'lucide-react'
import { useId } from 'react'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { DarkInput, SectionHeader } from '@/components/custom-ui'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { CitySelect } from '../city-select'
import { TAJIKISTAN_CITY_OPTIONS } from '@/lib/tajikistan-cities'
import { labelStyle, sectionCardStyle } from '../styles'

export function ContactsSection({ isNew = false }: { isNew?: boolean }) {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()
    const residenceSameCheckboxId = useId()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader title="Контакты" description="Цифровые и физические данные для связи. Обязательны для расчёта зарплаты." />
                <div className="mt-8 grid grid-cols-2 gap-3">
                    {[{ icon: Phone, label: 'Телефон' }, { icon: Mail, label: 'Email' }].map((item) => (
                        <div
                            key={item.label}
                            className="p-4 text-center rounded-[24px]"
                            style={{ background: 'var(--app-surface-2)', border: '1px solid rgba(67,73,51,0.3)' }}
                        >
                            <item.icon size={22} className="mx-auto mb-[6px] text-app-text-muted" />
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--app-text-muted)' }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2" style={sectionCardStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label style={labelStyle}>E-mail</label>
                        <DarkInput
                            type="email"
                            placeholder="ivan@company.com"
                            value={formData.email ?? ''}
                            hasError={hasFieldError('email')}
                            onChange={(e) => {
                                clearFieldErrorFor('email')
                                updateFormData({ email: e.target.value })
                            }}
                        />
                        <p style={{ fontSize: 11, color: 'var(--app-text-muted)', marginTop: 6 }}>Используется как логин для входа</p>
                    </div>
                    <div>
                        <label style={labelStyle}>
                            Телефон <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <DarkInput
                            placeholder="+992 XX XXX XXXX"
                            value={formData.phone ?? ''}
                            hasError={hasFieldError('phone')}
                            onChange={(e) => {
                                clearFieldErrorFor('phone')
                                updateFormData({ phone: e.target.value })
                            }}
                        />
                        <p style={{ fontSize: 11, color: 'var(--app-text-muted)', marginTop: 6 }}>Используется как логин для входа</p>
                    </div>

                    {isNew ? (
                        <div>
                            <label style={labelStyle}>
                                Пароль <span style={{ color: 'var(--brand-accent)' }}>*</span>
                            </label>
                            <DarkInput
                                type="password"
                                placeholder="••••••••"
                                value={formData.password ?? ''}
                                hasError={hasFieldError('password')}
                                onChange={(e) => {
                                    clearFieldErrorFor('password')
                                    updateFormData({ password: e.target.value })
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <label style={labelStyle}>Новый пароль</label>
                            <DarkInput type="password" placeholder="••••••••" value={formData.password ?? ''} onChange={(e) => updateFormData({ password: e.target.value })} />
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Telegram</label>
                        <DarkInput placeholder="@username" value={formData.telegram ?? ''} onChange={(e) => updateFormData({ telegram: e.target.value })} />
                    </div>

                    <div>
                        <label style={labelStyle}>
                            Город <span style={{ color: 'var(--brand-accent)' }}>*</span>
                        </label>
                        <CitySelect
                            value={formData.city ?? ''}
                            onChange={(val) => {
                                clearFieldErrorFor('city')
                                updateFormData({ city: val })
                            }}
                            placeholder="Выберите город"
                            options={TAJIKISTAN_CITY_OPTIONS}
                            hasError={hasFieldError('city')}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <div>
                            <label style={labelStyle} htmlFor="employee-registered-address">
                                Адрес регистрации <span style={{ color: 'var(--brand-accent)' }}>*</span>
                            </label>
                            <DarkInput
                                id="employee-registered-address"
                                placeholder="ул. Ленина, д. 1"
                                value={formData.registered_address ?? ''}
                                hasError={hasFieldError('registered_address')}
                                onChange={(e) => {
                                    clearFieldErrorFor('registered_address')
                                    const v = e.target.value
                                    if (formData.residence_same_as_registered) {
                                        updateFormData({ registered_address: v, actual_address: v })
                                    } else {
                                        updateFormData({ registered_address: v })
                                    }
                                }}
                            />
                        </div>
                        <div
                            className={cn(
                                'rounded-2xl border px-4 py-3.5 transition-colors',
                                'border-app-border-accent/50 bg-app-surface-2/35',
                                'hover:border-app-border-accent/80 hover:bg-app-surface-2/55',
                                formData.residence_same_as_registered && 'border-brand-accent/35 bg-brand-accent/6',
                            )}
                        >
                            <div className="flex items-start gap-3.5">
                                <Checkbox
                                    id={residenceSameCheckboxId}
                                    checked={formData.residence_same_as_registered}
                                    onCheckedChange={(checked) => {
                                        const isChecked = checked === true
                                        if (isChecked) {
                                            updateFormData({
                                                residence_same_as_registered: true,
                                                actual_address: formData.registered_address ?? '',
                                            })
                                        } else {
                                            updateFormData({ residence_same_as_registered: false })
                                        }
                                    }}
                                    className={cn(
                                        'mt-0.5 size-5 shrink-0 rounded-md border-2 shadow-none',
                                        'border-app-border-accent bg-app-surface-2',
                                        'data-[state=checked]:border-brand-accent data-[state=checked]:bg-brand-accent/25',
                                        'data-[state=checked]:text-brand-accent',
                                        'focus-visible:ring-2 focus-visible:ring-brand-accent/45 focus-visible:ring-offset-0',
                                        'focus-visible:border-brand-accent/80',
                                    )}
                                    aria-describedby={`${residenceSameCheckboxId}-hint`}
                                />
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <label
                                        htmlFor={residenceSameCheckboxId}
                                        className="block cursor-pointer select-none text-sm font-semibold leading-snug text-app-text"
                                    >
                                        Место проживания совпадает с адресом регистрации
                                    </label>
                                    <p
                                        id={`${residenceSameCheckboxId}-hint`}
                                        className="mt-1.5 text-xs leading-relaxed text-app-text-muted"
                                    >
                                        Одно поле адреса сохранится и как регистрация, и как проживание. Снимите
                                        отметку, если адреса разные.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {!formData.residence_same_as_registered ? (
                            <div>
                                <label style={labelStyle} htmlFor="employee-actual-address">
                                    Место проживания <span style={{ color: 'var(--brand-accent)' }}>*</span>
                                </label>
                                <DarkInput
                                    id="employee-actual-address"
                                    placeholder="ул. Хубчам, д. 48"
                                    value={formData.actual_address ?? ''}
                                    hasError={hasFieldError('actual_address')}
                                    onChange={(e) => {
                                        clearFieldErrorFor('actual_address')
                                        updateFormData({ actual_address: e.target.value })
                                    }}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
