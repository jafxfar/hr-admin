'use client'

import { useEffect, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import type { Education, EducationDegree } from '@/types/education'
import { DarkInput, DatePickerField } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { labelCls } from './helpers'
import { ModalInlineSelect } from './modal-inline-select'

export function EducationModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (e: Education) => void | Promise<void>
    initial?: Education
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const [institution, setInstitution] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [degree, setDegree] = useState<EducationDegree>('bachelor')
    const [startedAt, setStartedAt] = useState('')
    const [endedAt, setEndedAt] = useState('')

    const reset = () => {
        setInstitution(''); setSpecialization(''); setDegree('bachelor')
        setStartedAt(''); setEndedAt('')
    }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            setInstitution(initial.institution ?? '')
            setSpecialization(initial.specialization ?? '')
            setDegree((initial.degree as EducationDegree) ?? 'bachelor')
            setStartedAt(initial.started_at ?? '')
            setEndedAt(initial.ended_at ?? '')
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?.id])

    const handleConfirm = async () => {
        if (confirmLoading) return
        if (!institution) return
        await onSubmit({ ...(initial?.id ? { id: initial.id } : {}), institution, specialization, degree, started_at: startedAt, ended_at: endedAt })
        if (mode === 'create') {
            reset()
            onClose()
        }
    }

    const handleClose = () => { reset(); onClose() }

    return (
        <BaseModal
            open={open} onClose={handleClose}
            icon={GraduationCap}
            title={mode === 'edit' ? 'Редактировать образование' : 'Добавить образование'}
            subtitle="Учебная подготовка"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Добавить'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
        >
            <div>
                <label className={labelCls}>Степень <span className="text-brand-accent">*</span></label>
                <ModalInlineSelect value={degree} onChange={val => setDegree(val as EducationDegree)} options={[
                    { value: 'bachelor', label: 'Бакалавриат' },
                    { value: 'master', label: 'Магистратура' },
                    { value: 'phd', label: 'Докторантура (PhD)' },
                    { value: 'other', label: 'Другое' },
                ]} />
            </div>
            <div>
                <label className={labelCls}>Учебное заведение <span className="text-brand-accent">*</span></label>
                <DarkInput placeholder="Название университета" value={institution} onChange={e => setInstitution(e.target.value)} />
            </div>
            <div>
                <label className={labelCls}>Специализация</label>
                <DarkInput placeholder="Например: Информатика" value={specialization} onChange={e => setSpecialization(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-[16px]">
                <div>
                    <label className={labelCls}>Год начала</label>
                    <DatePickerField value={startedAt} onChange={setStartedAt} />
                </div>
                <div>
                    <label className={labelCls}>Год окончания</label>
                    <DatePickerField value={endedAt} onChange={setEndedAt} />
                </div>
            </div>
        </BaseModal>
    )
}
