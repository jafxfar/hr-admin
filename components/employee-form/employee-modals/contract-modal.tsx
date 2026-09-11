'use client'

import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import type { Contract, ContractType } from '@/types/contracts'
import { DatePickerField } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { labelCls } from './helpers'
import { ModalInlineSelect } from './modal-inline-select'

export function ContractModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (c: Contract) => void | Promise<void>
    initial?: Contract
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const [type, setType] = useState<ContractType>('full_time')
    const [startedAt, setStartedAt] = useState('')
    const [endedAt, setEndedAt] = useState('')

    const reset = () => { setType('full_time'); setStartedAt(''); setEndedAt('') }

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && initial) {
            setType((initial.type as ContractType) ?? 'full_time')
            setStartedAt(initial.started_at ?? '')
            setEndedAt(initial.ended_at ?? '')
            return
        }

        reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, initial?.id])

    const handleConfirm = async () => {
        if (confirmLoading) return
        await onSubmit({ ...(initial?.id ? { id: initial.id } : {}), type, started_at: startedAt, ended_at: endedAt, details: initial?.details ?? {} })
        if (mode === 'create') {
            reset()
            onClose()
        }
    }

    const handleClose = () => { reset(); onClose() }

    return (
        <BaseModal
            open={open} onClose={handleClose}
            icon={ClipboardList}
            title={mode === 'edit' ? 'Редактировать контракт' : 'Добавить контракт'}
            subtitle="Детали трудового договора"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Добавить'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
        >
            <div>
                <label className={labelCls}>Тип контракта <span className="text-brand-accent">*</span></label>
                <ModalInlineSelect value={type} onChange={val => setType(val as ContractType)} options={[
                    { value: 'full_time', label: 'Полная занятость' },
                    { value: 'part_time', label: 'Частичная занятость' },
                    { value: 'contractor', label: 'Подрядчик' },
                ]} />
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
