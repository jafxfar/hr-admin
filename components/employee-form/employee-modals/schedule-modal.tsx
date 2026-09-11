'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import type { Schedule } from '@/types/schedule'
import { DarkInput, DarkTextarea, DatePickerField } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { labelCls } from './helpers'
import { ModalInlineSelect } from './modal-inline-select'

export function ScheduleModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (s: Schedule) => void | Promise<void>
    initial?: Schedule
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const [days, setDays] = useState('5')
    const [hours, setHours] = useState('8')
    const [details, setDetails] = useState('')
    const [startedAt, setStartedAt] = useState('')
    const [endedAt, setEndedAt] = useState('')

    const reset = () => { setDays('5'); setHours('8'); setDetails(''); setStartedAt(''); setEndedAt('') }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            setDays(initial.days_per_week != null ? String(initial.days_per_week) : '5')
            setHours(initial.hours_per_day != null ? String(initial.hours_per_day) : '8')
            setDetails(((initial.details as any)?.note as string | undefined) ?? '')
            setStartedAt(initial.started_at ?? '')
            setEndedAt(initial.ended_at ?? '')
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?.id])

    const handleConfirm = async () => {
        if (confirmLoading) return
        if (!startedAt) return
        await onSubmit({
            ...(initial?.id ? { id: initial.id } : {}),
            days_per_week: Number(days),
            hours_per_day: Number(hours),
            started_at: startedAt,
            ended_at: endedAt || undefined,
            details: details ? { note: details } : undefined,
        })
        if (mode === 'create') {
            reset()
            onClose()
        }
    }

    const handleClose = () => { reset(); onClose() }

    return (
        <BaseModal
            open={open} onClose={handleClose}
            icon={CalendarDays} title="График работы" subtitle="Режим и рабочие часы"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Сохранить график'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
        >
            <div className="grid grid-cols-2 gap-[16px]">
                <div>
                    <label className={labelCls}>Дней в неделю</label>
                    <ModalInlineSelect value={days} onChange={setDays} options={[
                        { value: '5', label: '5 дней' },
                        { value: '6', label: '6 дней' },
                        { value: '7', label: '7 дней' },
                        { value: '4', label: '4 дня' },
                        { value: '3', label: '3 дня' },
                    ]} />
                </div>
                <div>
                    <label className={labelCls}>Часов в день</label>
                    <DarkInput type="number" placeholder="8" min={1} max={24} value={hours} onChange={e => setHours(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-[16px]">
                <div>
                    <label className={labelCls}>Дата начала <span className="text-brand-accent">*</span></label>
                    <DatePickerField value={startedAt} onChange={setStartedAt} />
                </div>
                <div>
                    <label className={labelCls}>Дата окончания</label>
                    <DatePickerField value={endedAt} onChange={setEndedAt} />
                </div>
            </div>
            <div>
                <label className={labelCls}>Комментарий к графику</label>
                <DarkTextarea placeholder="Например: смена 9–18 с обедом 1 ч…" value={details} onChange={e => setDetails(e.target.value)} />
            </div>
        </BaseModal>
    )
}
