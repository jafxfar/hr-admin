'use client'

import { useMemo } from 'react'
import { Briefcase, Building2, Download, FileText, UserRound } from 'lucide-react'
import type { EmployeePositionChangeHistoryEntry } from '@/types/employees'
import { formatProfileDate } from '@/lib/employee-profile-format'
import { EmployeeProfileSection } from './employee-profile-section'

const positionLabel = (
    title: string | null | undefined,
    id: number | null | undefined,
    fallback: string,
) => title || (id ? `${fallback} #${id}` : 'Не указано')

export function EmployeeProfilePositionChanges({
    history,
}: {
    history: EmployeePositionChangeHistoryEntry[]
}) {
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

    return (
        <EmployeeProfileSection
            title="История перемещений"
            description="Причины, основания и авторы смены отдела или должности."
            isEmpty={sortedHistory.length === 0}
            emptyMessage="История перемещений пуста."
        >
            <ol className="relative space-y-6">
                {sortedHistory.map((entry, idx) => {
                    const fromPosition = positionLabel(entry.from_position_title, entry.from_position_id, 'Должность')
                    const toPosition = positionLabel(entry.to_position_title, entry.to_position_id, 'Должность')
                    const fromDepartment = positionLabel(entry.from_department_name, entry.from_department_id, 'Отдел')
                    const toDepartment = positionLabel(entry.to_department_name, entry.to_department_id, 'Отдел')
                    const changedAt = entry.changed_at ? formatProfileDate(entry.changed_at) : null
                    const basisType = entry.basis_type?.trim() || 'Файл-основание'

                    return (
                        <li key={entry.id} className="relative pl-10">
                            <span
                                aria-hidden="true"
                                className={`absolute left-[15px] top-9 bottom-0 w-0.5 bg-app-surface-4 ${idx === sortedHistory.length - 1 ? 'hidden' : ''}`}
                            />
                            <span
                                aria-hidden="true"
                                className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                                    idx === 0 ? 'bg-brand-accent text-brand-accent-on-alt' : 'bg-app-surface-4 text-app-text-muted'
                                }`}
                            >
                                <Briefcase size={14} />
                            </span>
                            <div
                                className={`rounded-2xl border bg-app-surface-0 p-4 ${
                                    idx === 0 ? 'border-brand-accent/40' : 'border-transparent'
                                }`}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-[15px] font-bold text-app-text">{toPosition}</p>
                                        <p className="mt-1 text-xs text-app-text-muted">{changedAt ?? 'Дата не указана'}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                                            idx === 0
                                                ? 'bg-brand-accent text-brand-accent-on-alt'
                                                : 'bg-app-surface-4 text-app-text-muted'
                                        }`}
                                    >
                                        {idx === 0 ? 'Последняя' : 'История'}
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="rounded-2xl bg-app-surface-2 p-3 text-xs text-app-text-muted">
                                        <span className="text-xs font-bold uppercase tracking-widest">Было</span>
                                        <p className="mt-1 font-semibold text-app-text">{fromPosition}</p>
                                        <span className="mt-1 inline-flex items-center gap-1.5">
                                            <Building2 size={14} />
                                            {fromDepartment}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl bg-app-surface-2 p-3 text-xs text-app-text-muted">
                                        <span className="text-xs font-bold uppercase tracking-widest">Стало</span>
                                        <p className="mt-1 font-semibold text-app-text">{toPosition}</p>
                                        <span className="mt-1 inline-flex items-center gap-1.5">
                                            <Building2 size={14} />
                                            {toDepartment}
                                        </span>
                                    </div>
                                </div>
                                {entry.reason_text ? (
                                    <div className="mt-3 rounded-2xl bg-app-surface-2 p-3 text-xs">
                                        <span className="font-bold uppercase tracking-widest text-app-text-muted">Причина</span>
                                        <p className="mt-1 text-app-text">{entry.reason_text}</p>
                                    </div>
                                ) : null}
                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-app-text-muted">
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
        </EmployeeProfileSection>
    )
}
