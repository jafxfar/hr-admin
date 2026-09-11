'use client'

import { useMemo } from 'react'
import { Briefcase, Building2, Download, FileText, History, UserRound } from 'lucide-react'
import type { EmployeePositionChangeHistoryEntry } from '@/types/employees'
import { SectionHeader } from '../custom-ui'
import { sectionCardStyle } from './profile-form/styles'

const formatDate = (raw: string | null | undefined): string => {
    if (!raw) return ''
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return raw
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type PositionHistorySectionProps = {
    history: EmployeePositionChangeHistoryEntry[]
}

const positionLabel = (
    title: string | null | undefined,
    id: number | null | undefined,
    fallback: string,
) => title || (id ? `${fallback} #${id}` : 'Не указано')

export const PositionHistorySection = ({ history }: PositionHistorySectionProps) => {
    const sortedHistory = useMemo(
        () =>
            [...history].sort((a, b) => {
                const aTime = new Date(a.changed_at ?? '').getTime()
                const bTime = new Date(b.changed_at ?? '').getTime()
                if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0
                return bTime - aTime
            }),
        [history],
    )

    if (sortedHistory.length === 0) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
                <SectionHeader
                    title="История перемещений"
                    description="Причины, основания и авторы фактической смены отдела или должности."
                />
                <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-3xl"
                    style={{ background: 'var(--app-surface-2)' }}
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-app-text-muted"
                        style={{ background: 'var(--app-surface-4)' }}
                    >
                        <History size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.08em]"
                            style={{ color: 'var(--app-text-muted)' }}
                        >
                            Записей
                        </p>
                        <p className="text-base font-bold" style={{ color: 'var(--app-text)' }}>
                            {sortedHistory.length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2" style={sectionCardStyle}>
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
                <ol className="relative">
                    {sortedHistory.map((entry, idx) => {
                        const isLast = idx === sortedHistory.length - 1
                        const fromPosition = positionLabel(entry.from_position_title, entry.from_position_id, 'Должность')
                        const toPosition = positionLabel(entry.to_position_title, entry.to_position_id, 'Должность')
                        const fromDepartment = positionLabel(entry.from_department_name, entry.from_department_id, 'Отдел')
                        const toDepartment = positionLabel(entry.to_department_name, entry.to_department_id, 'Отдел')
                        const changedAt = formatDate(entry.changed_at)
                        const basisType = entry.basis_type?.trim() || 'Файл-основание'

                        return (
                            <li
                                key={entry.id}
                                className="relative pl-10"
                                style={{ paddingBottom: isLast ? 0 : 24 }}
                            >
                                {!isLast ? (
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-[15px] top-9 bottom-0"
                                        style={{ width: 2, background: 'var(--app-surface-4)' }}
                                    />
                                ) : null}

                                <span
                                    aria-hidden="true"
                                    className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{
                                        background: idx === 0 ? 'var(--brand-accent)' : 'var(--app-surface-4)',
                                        color: idx === 0 ? 'var(--brand-accent-on-alt)' : 'var(--app-text-muted)',
                                    }}
                                >
                                    <Briefcase size={14} />
                                </span>

                                <div
                                    className="rounded-2xl p-4"
                                    style={{
                                        background: 'var(--app-surface-1)',
                                        border: idx === 0
                                            ? '1px solid rgb(var(--theme-primary-rgb) / 0.4)'
                                            : '1px solid transparent',
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-bold truncate"
                                                style={{ color: 'var(--app-text)' }}
                                            >
                                                {toPosition}
                                            </p>
                                            <p className="text-[12px] mt-1"
                                                style={{ color: 'var(--app-text-muted)' }}
                                            >
                                                {changedAt || 'Дата не указана'}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
                                            style={{
                                                background: idx === 0 ? 'var(--brand-accent)' : 'var(--app-surface-4)',
                                                color: idx === 0 ? 'var(--brand-accent-on-alt)' : 'var(--app-text-muted)',
                                            }}
                                        >
                                            {idx === 0 ? 'Последняя' : 'История'}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]"
                                        style={{ color: 'var(--app-text-muted)' }}
                                    >
                                        <div className="rounded-2xl p-3" style={{ background: 'var(--app-surface-2)' }}>
                                            <span className="text-xs font-bold uppercase tracking-[0.08em]">
                                                Было
                                            </span>
                                            <p className="mt-1 font-semibold" style={{ color: 'var(--app-text)' }}>
                                                {fromPosition}
                                            </p>
                                            <span className="mt-1 inline-flex items-center gap-1.5">
                                                <Building2 size={14} />
                                                {fromDepartment}
                                            </span>
                                        </div>
                                        <div className="rounded-2xl p-3" style={{ background: 'var(--app-surface-2)' }}>
                                            <span className="text-xs font-bold uppercase tracking-[0.08em]">
                                                Стало
                                            </span>
                                            <p className="mt-1 font-semibold" style={{ color: 'var(--app-text)' }}>
                                                {toPosition}
                                            </p>
                                            <span className="mt-1 inline-flex items-center gap-1.5">
                                                <Building2 size={14} />
                                                {toDepartment}
                                            </span>
                                        </div>
                                    </div>

                                    {entry.reason_text ? (
                                        <div className="mt-3 rounded-2xl p-3 text-[12px]" style={{ background: 'var(--app-surface-2)' }}>
                                            <span className="font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--app-text-muted)' }}>
                                                Причина
                                            </span>
                                            <p className="mt-1" style={{ color: 'var(--app-text)' }}>
                                                {entry.reason_text}
                                            </p>
                                        </div>
                                    ) : null}

                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px]"
                                        style={{ color: 'var(--app-text-muted)' }}
                                    >
                                        {entry.changed_by_user_email ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <UserRound size={14} />
                                                {entry.changed_by_user_email}
                                            </span>
                                        ) : null}
                                        {entry.basis_file_url ? (
                                            <a
                                                href={entry.basis_file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-brand-accent hover:underline"
                                                aria-label="Открыть файл-основание"
                                            >
                                                <Download size={14} />
                                                {basisType}
                                            </a>
                                        ) : entry.basis_file_path ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <FileText size={14} />
                                                {basisType}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}
