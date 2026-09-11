'use client'

import type { PositionHistoryEntry } from '@/types/employees'
import { formatProfileDate } from '@/lib/employee-profile-format'
import { GitBranch } from 'lucide-react'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfilePositionHistory({
    items,
    branchesEnabled,
}: {
    items: PositionHistoryEntry[]
    branchesEnabled: boolean
}) {
    return (
        <EmployeeProfileSection
            title="История назначений"
            description="Все назначения на должности по user_positions."
            isEmpty={items.length === 0}
            emptyMessage="История назначений пуста."
        >
            <div className="rounded-2xl border border-app-border/40 bg-app-surface-3 p-8">
                <div className="space-y-6 border-l-2 border-brand-accent/40 pl-6">
                    {items.map((item) => (
                        <div key={item.id} className="relative">
                            <span
                                className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 ${
                                    item.is_current
                                        ? 'border-brand-accent bg-brand-accent'
                                        : 'border-app-surface-4 bg-app-surface-3'
                                }`}
                            />
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="font-semibold text-app-text">{item.title ?? '—'}</p>
                                {item.is_current ? (
                                    <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-brand-accent">
                                        Текущая
                                    </span>
                                ) : null}
                            </div>
                            {item.description ? (
                                <p className="mt-1 text-sm text-app-text-muted">{item.description}</p>
                            ) : null}
                            <p className="mt-1 text-xs text-app-text-muted/70">
                                {item.started_at ? formatProfileDate(item.started_at) ?? '—' : '—'}
                                {' — '}
                                {item.ended_at ? formatProfileDate(item.ended_at) ?? '—' : 'по настоящее время'}
                            </p>
                            {item.assigned_at ? (
                                <p className="mt-1 text-xs font-medium text-app-text-muted/80">
                                    В системе с {formatProfileDate(item.assigned_at) ?? '—'}
                                </p>
                            ) : null}
                            {branchesEnabled && item.branch?.name ? (
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-app-text-muted/80">
                                    <GitBranch className="h-3 w-3 shrink-0" aria-hidden />
                                    {item.branch.name}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </EmployeeProfileSection>
    )
}
