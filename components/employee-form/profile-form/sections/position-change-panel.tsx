'use client'

import { FileText } from 'lucide-react'
import type { RefObject } from 'react'

import { useEmployeeForm } from '../../EmployeeFormContext'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import { labelStyle } from '../styles'

export function PositionChangePanel({
    positionChangeBasisInputRef,
    positionChangeFileError,
    onBasisFile,
}: {
    positionChangeBasisInputRef: RefObject<HTMLInputElement | null>
    positionChangeFileError: string | null
    onBasisFile: (file: File) => void
}) {
    const { formData, updateFormData, hasFieldError, clearFieldErrorFor } = useEmployeeForm()

    return (
        <div
            className="md:col-span-2 rounded-[28px] p-5 border"
            style={{
                background: 'var(--app-surface-1)',
                borderColor: 'rgb(var(--theme-primary-rgb) / 0.35)',
            }}
        >
            <div className="mb-5">
                <p className="text-sm font-black uppercase tracking-[0.08em]" style={{ color: 'var(--app-text)' }}>
                    Основание смены должности
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--app-text-muted)' }}>
                    При изменении отдела или должности можно указать причину и приложить файл-основание.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label style={labelStyle}>
                        Причина смены
                    </label>
                    <DarkTextarea
                        placeholder="Например: перевод сотрудника на основании приказа"
                        rows={3}
                        value={formData.position_change_reason_text ?? ''}
                        hasError={hasFieldError('position_change_reason_text')}
                        onChange={(e) => {
                            clearFieldErrorFor('position_change_reason_text')
                            updateFormData({ position_change_reason_text: e.target.value })
                        }}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Тип основания</label>
                    <DarkInput
                        placeholder="Например: order"
                        value={formData.position_change_basis_type ?? ''}
                        onChange={(e) => updateFormData({ position_change_basis_type: e.target.value })}
                    />
                </div>

                <div>
                    <label style={labelStyle}>
                        Файл-основание
                    </label>
                    <input
                        ref={positionChangeBasisInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            e.target.value = ''
                            if (file) {
                                clearFieldErrorFor('position_change_basis_file_base64')
                                onBasisFile(file)
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => positionChangeBasisInputRef.current?.click()}
                        className="w-full h-12 px-4 rounded-full flex items-center gap-2 text-left transition-all"
                        style={{
                            background: 'var(--app-surface-2)',
                            color: formData.position_change_basis_filename ? 'var(--app-text)' : 'var(--app-text-muted)',
                            boxShadow: hasFieldError('position_change_basis_file_base64')
                                ? '0 0 0 2px rgb(var(--error) / 0.5)'
                                : undefined,
                        }}
                        aria-label="Выбрать файл-основание смены должности"
                    >
                        <FileText size={16} className="shrink-0" />
                        <span className="truncate text-sm">
                            {formData.position_change_basis_filename || 'Выбрать файл'}
                        </span>
                    </button>
                    <p className="text-xs font-medium mt-2" style={{ color: 'var(--app-text-muted)' }}>
                        PDF, JPG, PNG, DOC, DOCX, до 10MB
                    </p>
                    {positionChangeFileError ? (
                        <p className="text-xs mt-2 text-red-400">{positionChangeFileError}</p>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
