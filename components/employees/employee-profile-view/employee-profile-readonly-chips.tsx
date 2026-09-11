'use client'

import type { ReactNode } from 'react'
import { Banknote, Clock, FileText } from 'lucide-react'
import type { Contract } from '@/types/contracts'
import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import { formatContractType, formatCurrencyAmount, formatProfileDate, formatScheduleHours, formatScheduleSummary } from '@/lib/employee-profile-format'

function ReadonlyChip({
    icon,
    title,
    subtitle,
    accentColor,
}: {
    icon: ReactNode
    title: ReactNode
    subtitle?: ReactNode
    accentColor?: string
}) {
    return (
        <div
            className="mb-2 flex items-center gap-3 rounded-[14px] px-[14px] py-[10px]"
            style={{
                background: 'var(--app-surface-2)',
                ...(accentColor ? { borderLeft: `3px solid ${accentColor}` } : {}),
            }}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-app-surface-4 text-app-text-muted">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold text-app-text">{title}</div>
                {subtitle ? (
                    <div className="mt-0.5 truncate text-xs font-medium text-app-text-muted">{subtitle}</div>
                ) : null}
            </div>
        </div>
    )
}

export function ReadonlyScheduleChip({ schedule }: { schedule: Schedule }) {
    const summary = formatScheduleSummary(schedule) ?? `${schedule.days_per_week} дн / ${schedule.hours_per_day} ч`
    const hours = formatScheduleHours(schedule)
    const period = [
        schedule.started_at ? formatProfileDate(schedule.started_at) : null,
        schedule.ended_at ? formatProfileDate(schedule.ended_at) : 'по настоящее время',
    ]
        .filter(Boolean)
        .join(' — ')

    return (
        <ReadonlyChip
            accentColor="var(--brand-accent)"
            icon={<Clock size={18} />}
            title={summary}
            subtitle={[hours, period].filter(Boolean).join(' · ')}
        />
    )
}

export function ReadonlySalaryChip({ salary }: { salary: Salary }) {
    const period = [
        salary.started_at ? formatProfileDate(salary.started_at) : null,
        salary.ended_at ? formatProfileDate(salary.ended_at) : 'по настоящее время',
    ]
        .filter(Boolean)
        .join(' — ')

    return (
        <ReadonlyChip
            icon={<Banknote size={18} />}
            title={formatCurrencyAmount(salary.amount, salary.currency)}
            subtitle={
                salary.prepaid_percent != null
                    ? `${period} · аванс ${salary.prepaid_percent}%`
                    : period
            }
        />
    )
}

export function ReadonlyContractChip({ contract }: { contract: Contract }) {
    const period = [
        contract.started_at ? formatProfileDate(contract.started_at) : null,
        contract.ended_at ? formatProfileDate(contract.ended_at) : 'по настоящее время',
    ]
        .filter(Boolean)
        .join(' — ')

    return (
        <ReadonlyChip
            icon={<FileText size={18} />}
            title={formatContractType(contract.type)}
            subtitle={period || undefined}
        />
    )
}
