'use client'

import { useEffect, useState } from 'react'
import { Banknote } from 'lucide-react'
import type { Salary } from '@/types/salary'
import { DarkInput, DatePickerField } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { labelCls } from './helpers'
import { ModalInlineSelect } from './modal-inline-select'

export function SalaryModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (s: Salary) => void | Promise<void>
    initial?: Salary
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('TJS')
    const [prepaid, setPrepaid] = useState('')
    const [startedAt, setStartedAt] = useState('')
    const [endedAt, setEndedAt] = useState('')

    const reset = () => { setAmount(''); setCurrency('TJS'); setPrepaid(''); setStartedAt(''); setEndedAt('') }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            setAmount(initial.amount != null ? String(initial.amount) : '')
            setCurrency(initial.currency ?? 'TJS')
            setPrepaid(initial.prepaid_percent != null ? String(initial.prepaid_percent) : '')
            setStartedAt(initial.started_at ?? '')
            setEndedAt(initial.ended_at ?? '')
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?.id])

    const handleConfirm = async () => {
        if (confirmLoading) return
        if (!amount || !startedAt) return
        await onSubmit({
            ...(initial?.id ? { id: initial.id } : {}),
            amount: Number(amount),
            currency,
            prepaid_percent: prepaid ? Number(prepaid) : undefined,
            started_at: startedAt,
            ended_at: endedAt || undefined,
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
            icon={Banknote}
            title="Заработная плата"
            subtitle="Данные о вознаграждении"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Добавить запись'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
        >
            <div>
                <label className={labelCls}>Сумма <span className="text-brand-accent">*</span></label>
                <DarkInput type="number" placeholder="например, 5000" value={amount} onChange={e => setAmount(e.target.value)} suffix="INTEGER" />
            </div>
            <div>
                <label className={labelCls}>Валюта <span className="text-brand-accent">*</span></label>
                <ModalInlineSelect value={currency} onChange={setCurrency} options={[
                    { value: 'TJS', label: 'TJS - Таджикский Сомони' },
                    { value: 'USD', label: 'USD — доллар США' },
                    { value: 'RUB', label: 'RUB — российский рубль' },
                ]} />
            </div>
            <div>
                <label className={labelCls}>Аванс (%) <span className="text-brand-accent">*</span></label>
                <DarkInput
                    type="number"
                    placeholder="30"
                    min={0}
                    max={100}
                    value={prepaid}
                    onChange={e => {
                        const raw = e.target.value
                        if (raw === '') {
                            setPrepaid('')
                            return
                        }
                        const num = Number(raw)
                        if (Number.isNaN(num)) return
                        const clamped = Math.min(100, Math.max(0, num))
                        setPrepaid(String(clamped))
                    }}
                    suffix="%"
                />
                <p className="text-app-text-muted text-xs font-medium mt-[6px] italic">Доля зарплаты, выплачиваемая авансом (0–100%).</p>
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
        </BaseModal>
    )
}
