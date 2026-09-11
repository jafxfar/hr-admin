'use client'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { SectionHeader } from '@/components/custom-ui'
import { DarkTextarea, DatePickerField } from '@/components/custom-ui'
import { labelStyle, sectionCardStyle } from '../styles'

export function TerminationSection() {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()
    const isTerminated = Boolean(formData.is_terminated)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader
                    title="Увольнение"
                    description="При указании даты увольнения сотрудник будет переведён в статус «Уволен» и перенесён в архив."
                />
            </div>
            <div className="lg:col-span-2" style={sectionCardStyle}>
                {isTerminated ? (
                    <div className="mb-6">
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                            Уволен
                        </span>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label style={labelStyle}>Дата увольнения</label>
                        <DatePickerField
                            value={formData.termination_date ?? ''}
                            onChange={(next) => {
                                clearFieldErrorFor('termination_date')
                                updateFormData({ termination_date: next })
                            }}
                            hasError={hasFieldError('termination_date')}
                            disabled={isTerminated}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label style={labelStyle}>
                            Причина
                            {(formData.termination_date?.trim() || isTerminated) ? (
                                <span style={{ color: 'var(--brand-accent)' }}> *</span>
                            ) : null}
                        </label>
                        <DarkTextarea
                            placeholder="Например: увольнение по собственному желанию"
                            rows={3}
                            value={formData.termination_reason ?? ''}
                            hasError={hasFieldError('termination_reason')}
                            onChange={(e) => {
                                clearFieldErrorFor('termination_reason')
                                updateFormData({ termination_reason: e.target.value })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
