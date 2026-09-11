'use client'

import type { ReactNode } from 'react'
import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import type { Contract } from '@/types/contracts'
import type { Education } from '@/types/education'
import type { Document } from '@/types/documents'
import type { WorkExperience } from '@/types/workExperience'
import { useActiveDocumentTypesQuery } from '@/hooks/use-document-types'
import { resolveDocumentTypeTitle } from '@/lib/document-type-display'
import { Modal, ModalHeader } from '../custom-ui/modal'

type FormDocument = Document & {
    _serverId?: number
    _serverPath?: string
    _previewUrl?: string
}

const FILES_BASE = (process.env.NEXT_PUBLIC_FILES_URL ?? 'http://localhost:8000/uploads').replace(/\/$/, '')

const buildFileUrl = (serverPath: string): string => {
    const clean = serverPath.replace(/^\/+/, '').replace(/^uploads\//, '')
    return `${FILES_BASE}/${clean}`
}

const isImage = (src: string) =>
    src.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(src)

const labelCls = 'block text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted mb-[6px]'

const degreeLabel: Record<string, string> = {
    bachelor: 'Бакалавриат',
    master: 'Магистратура',
    phd: 'Докторантура',
    other: 'Другое',
}

const contractTypeLabel: Record<string, string> = {
    full_time: 'Полная занятость',
    part_time: 'Частичная занятость',
    contractor: 'Подрядчик',
}

const formatValue = (v: string | number | undefined | null) => {
    if (v === undefined || v === null || v === '') return '—'
    return String(v)
}

const ReadRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="mb-[14px] last:mb-0">
        <div className={labelCls}>{label}</div>
        <div className="text-app-text text-[14px] leading-relaxed whitespace-pre-wrap break-words">{value}</div>
    </div>
)

export type ChipViewState =
    | { kind: 'schedule'; data: Schedule }
    | { kind: 'salary'; data: Salary }
    | { kind: 'work'; data: WorkExperience }
    | { kind: 'contract'; data: Contract }
    | { kind: 'education'; data: Education }
    | { kind: 'document'; data: FormDocument }

type ChipViewModalProps = {
    view: ChipViewState | null
    onClose: () => void
}

export const ChipViewModal = ({ view, onClose }: ChipViewModalProps) => {
    const open = view !== null
    const isDocumentView = view?.kind === 'document'
    const { data: documentTypesCatalog } = useActiveDocumentTypesQuery(open && isDocumentView)

    if (!view) return null

    let title = 'Просмотр'
    let subtitle: string | undefined
    let body: ReactNode = null

    if (view.kind === 'schedule') {
        const s = view.data
        title = 'График работы'
        subtitle = 'Только просмотр'
        const note = (s.details as Record<string, unknown> | undefined)?.note
        body = (
            <>
                <ReadRow label="Дней в неделю" value={formatValue(s.days_per_week)} />
                <ReadRow label="Часов в день" value={formatValue(s.hours_per_day)} />
                <ReadRow label="Дата начала" value={formatValue(s.started_at)} />
                <ReadRow label="Дата окончания" value={formatValue(s.ended_at)} />
                <ReadRow label="Комментарий" value={note ? String(note) : '—'} />
            </>
        )
    }

    if (view.kind === 'salary') {
        const sal = view.data
        title = 'Запись о зарплате'
        subtitle = 'Только просмотр'
        body = (
            <>
                <ReadRow
                    label="Сумма"
                    value={sal.amount != null ? `${sal.amount.toLocaleString()} ${sal.currency ?? ''}`.trim() : '—'}
                />
                <ReadRow label="Валюта" value={formatValue(sal.currency)} />
                <ReadRow label="Аванс (%)" value={sal.prepaid_percent != null ? `${sal.prepaid_percent}%` : '—'} />
                <ReadRow label="Дата начала" value={formatValue(sal.started_at)} />
                <ReadRow label="Дата окончания" value={formatValue(sal.ended_at)} />
            </>
        )
    }

    if (view.kind === 'work') {
        const w = view.data
        title = 'Опыт работы'
        subtitle = 'Только просмотр'
        body = (
            <>
                <ReadRow label="Компания" value={formatValue(w.company)} />
                <ReadRow label="Должность" value={formatValue(w.position)} />
                <ReadRow label="Описание" value={formatValue(w.description)} />
                <ReadRow label="Дата начала" value={formatValue(w.started_at)} />
                <ReadRow label="Дата окончания" value={formatValue(w.ended_at)} />
            </>
        )
    }

    if (view.kind === 'contract') {
        const c = view.data
        title = 'Контракт'
        subtitle = 'Только просмотр'
        body = (
            <>
                <ReadRow label="Тип" value={contractTypeLabel[c.type] ?? formatValue(c.type)} />
                <ReadRow label="Дата начала" value={formatValue(c.started_at)} />
                <ReadRow label="Дата окончания" value={formatValue(c.ended_at)} />
            </>
        )
    }

    if (view.kind === 'education') {
        const e = view.data
        title = 'Образование'
        subtitle = 'Только просмотр'
        body = (
            <>
                <ReadRow label="Степень" value={degreeLabel[e.degree] ?? formatValue(e.degree)} />
                <ReadRow label="Учебное заведение" value={formatValue(e.institution)} />
                <ReadRow label="Специализация" value={formatValue(e.specialization)} />
                <ReadRow label="Дата начала" value={formatValue(e.started_at)} />
                <ReadRow label="Дата окончания" value={formatValue(e.ended_at)} />
            </>
        )
    }

    if (view.kind === 'document') {
        const d = view.data
        title = 'Документ'
        subtitle = 'Только просмотр'
        const typeRu = resolveDocumentTypeTitle(documentTypesCatalog?.items, d)
        const previewSrc = d._previewUrl || (d._serverPath ? buildFileUrl(d._serverPath) : '')
        const hasPreview = Boolean(previewSrc)
        const showImage = hasPreview && isImage(previewSrc)
        body = (
            <>
                <ReadRow label="Тип документа" value={typeRu} />
                {showImage ? (
                    <div className="mt-[12px] rounded-[16px] overflow-hidden border border-app-border bg-app-surface-0">
                        <img src={previewSrc} alt="" className="max-h-[220px] w-full object-contain" />
                    </div>
                ) : null}
                {!showImage && previewSrc ? (
                    <div className="mt-[12px]">
                        <a
                            href={previewSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-accent text-[14px] font-semibold underline"
                        >
                            Открыть файл
                        </a>
                    </div>
                ) : null}
            </>
        )
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalHeader title={title} subtitle={subtitle} onClose={onClose} />
            <div className="max-h-[60vh] overflow-y-auto pr-[4px]">{body}</div>
            <div className="mt-[28px]">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-[14px] px-[24px] rounded-full bg-app-surface-4 border-none text-app-text text-[14px] font-semibold cursor-pointer hover:bg-app-border transition-colors"
                >
                    Закрыть
                </button>
            </div>
        </Modal>
    )
}
