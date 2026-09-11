'use client'

import { GitBranch } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildFileUrl } from '@/lib/files'
import { getInitialsFromName } from '@/lib/employee-display'
import type { EmployeeProfileViewModel } from '@/types/employees'

export function EmployeeProfileHero({
    profile,
    branchesEnabled,
}: {
    profile: EmployeeProfileViewModel
    branchesEnabled: boolean
}) {
    const fullName =
        profile.full_name ??
        [profile.last_name, profile.first_name, profile.middle_name].filter(Boolean).join(' ')
    const initials = getInitialsFromName(profile.full_name, profile.first_name, profile.last_name)
    const photoUrl = profile.profile_photo_url ? buildFileUrl(profile.profile_photo_url) : null
    const departmentName = profile.department?.name
    const positionTitle = profile.position?.title
    const branchName = branchesEnabled ? profile.branch?.name?.trim() : ''

    return (
        <section className="relative overflow-hidden rounded-3xl bg-app-surface-3 p-8 md:p-12 min-h-[420px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-linear-to-br from-brand-accent/10 via-transparent to-hr-lilac/10" />
            <div className="absolute inset-0 bg-linear-to-t from-app-surface-3 via-app-surface-3/40 to-transparent" />

            <div className="relative z-10 flex w-full flex-col items-start gap-8 md:flex-row md:items-end">
                <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full ring-8 ring-brand-accent/10 lg:h-48 lg:w-48">
                    <Avatar className="h-full w-full rounded-full">
                        {photoUrl && <AvatarImage src={photoUrl} alt={fullName} className="object-cover" />}
                        <AvatarFallback className="rounded-full bg-app-surface-4 text-4xl font-bold text-app-text">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="min-w-0 flex-1 w-full max-w-full">
                    {departmentName && (
                        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-brand-accent">
                            {departmentName}
                        </span>
                    )}
                    <h1 className="mb-3 max-w-full break-words text-[clamp(1.75rem,3.5vw+1rem,3.75rem)] font-extrabold leading-[1.1] tracking-tight text-app-text">
                        {fullName || 'Сотрудник'}
                    </h1>
                    {positionTitle && (
                        <p className="text-lg font-semibold text-app-text-muted md:text-xl">{positionTitle}</p>
                    )}
                    {profile.email && (
                        <p className="mt-2 text-sm font-medium text-app-text-muted">{profile.email}</p>
                    )}
                    {branchName ? (
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-app-text-muted">
                            <GitBranch className="h-4 w-4 shrink-0 text-hr-lilac" aria-hidden />
                            {branchName}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
