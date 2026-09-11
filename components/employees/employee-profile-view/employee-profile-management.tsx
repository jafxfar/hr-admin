'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildFileUrl } from '@/lib/files'
import { getInitialsFromName } from '@/lib/employee-display'
import type { PublicProfileDepartmentHead } from '@/types/employees'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileManagement({ head }: { head?: PublicProfileDepartmentHead | null }) {
    const hasHead = Boolean(head?.full_name?.trim())

    return (
        <EmployeeProfileSection title="Руководство" isEmpty={!hasHead} emptyMessage="Руководитель не указан.">
            {head ? (
                <div className="rounded-2xl border border-app-border/40 bg-app-surface-0 p-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
                        Подчиняется
                    </p>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-brand-accent/30">
                            {head.profile_photo_url ? (
                                <AvatarImage
                                    src={buildFileUrl(head.profile_photo_url)}
                                    alt={head.full_name ?? ''}
                                    className="object-cover"
                                />
                            ) : null}
                            <AvatarFallback className="bg-app-surface-4 text-sm font-bold text-app-text">
                                {getInitialsFromName(head.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            {head.id ? (
                                <Link
                                    href={`/employees/${head.id}/view`}
                                    className="block truncate text-lg font-bold text-app-text transition-colors hover:text-brand-accent"
                                >
                                    {head.full_name ?? '—'}
                                </Link>
                            ) : (
                                <p className="truncate text-lg font-bold text-app-text">{head.full_name ?? '—'}</p>
                            )}
                            <p className="text-sm text-app-text-muted">Руководитель отдела</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </EmployeeProfileSection>
    )
}
