'use client'

import { useEffect, useState } from 'react'
import { Briefcase } from 'lucide-react'
import type { WorkExperience } from '@/types/workExperience'
import { DarkInput, DarkTextarea, DatePickerField } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { labelCls } from './helpers'

export function WorkExpModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (w: WorkExperience) => void | Promise<void>
    initial?: WorkExperience
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [description, setDescription] = useState('')
    const [startedAt, setStartedAt] = useState('')
    const [endedAt, setEndedAt] = useState('')

    const reset = () => { setCompany(''); setPosition(''); setDescription(''); setStartedAt(''); setEndedAt('') }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            setCompany(initial.company ?? '')
            setPosition(initial.position ?? '')
            setDescription(initial.description ?? '')
            setStartedAt(initial.started_at ?? '')
            setEndedAt(initial.ended_at ?? '')
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?.id])

    const handleConfirm = async () => {
        if (confirmLoading) return
        if (!company || !startedAt) return
        await onSubmit({ ...(initial?.id ? { id: initial.id } : {}), company, position, description, started_at: startedAt, ended_at: endedAt })
        if (mode === 'create') {
            reset()
            onClose()
        }
    }

    const handleClose = () => { reset(); onClose() }

    return (
        <BaseModal
            open={open} onClose={handleClose}
            icon={Briefcase}
            title={mode === 'edit' ? 'Редактировать опыт' : 'Опыт работы'}
            subtitle="Профессиональная история"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Добавить'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
        >
            <div>
                <label className={labelCls}>Компания <span className="text-brand-accent">*</span></label>
                <DarkInput placeholder="Например: ООО «Техно»" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div>
                <label className={labelCls}>Должность <span className="text-brand-accent">*</span></label>
                <DarkInput placeholder="Например: ведущий разработчик" value={position} onChange={e => setPosition(e.target.value)} />
            </div>
            <div>
                <label className={labelCls}>Описание</label>
                <DarkTextarea placeholder="Обязанности и достижения…" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-[16px]">
                <div>
                    <label className={labelCls}>Дата начала <span className="text-brand-accent">*</span></label>
                    <DatePickerField value={startedAt} onChange={setStartedAt} />
                </div>
                <div>
                    <label className={labelCls}>Дата окончания <span className="text-brand-accent">*</span></label>
                    <DatePickerField value={endedAt} onChange={setEndedAt} />
                </div>
            </div>
        </BaseModal>
    )
}
