'use client'

import { Briefcase, Clock } from 'lucide-react'
import type { PublicProfileSchedule } from '@/types/employees'
import { formatProfileDate, formatScheduleHours, formatScheduleSummary } from '@/lib/employee-profile-format'

export function EmployeeProfileSchedule({ schedule }: { schedule: PublicProfileSchedule }) {
    const summary = formatScheduleSummary(schedule)
    const hours = formatScheduleHours(schedule)
    const since = formatProfileDate(schedule.started_at)

    return (
        <div className="rounded-2xl bg-app-surface-0 p-8">
            <h3 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-app-text">
                Информация
            </h3>
            <div className="space-y-5">
                {summary && (
                    <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                                Расписание работы
                            </p>
                            <p className="mt-1 font-semibold text-app-text">{summary}</p>
                            {hours && <p className="mt-0.5 text-sm text-app-text-muted">{hours}</p>}
                        </div>
                    </div>
                )}
                {since && (
                    <div className="flex items-start gap-3">
                        <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-hr-lilac" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                                Действует с
                            </p>
                            <p className="mt-1 font-semibold text-app-text">{since}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
