'use client'

import { Award } from 'lucide-react'
import { buildFileUrl } from '@/lib/files'
import { formatProfileYear } from '@/lib/employee-profile-format'
import type { PublicProfileReward } from '@/types/employees'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileAwards({ items }: { items: PublicProfileReward[] }) {
    return (
        <EmployeeProfileSection title="Награды" isEmpty={items.length === 0} emptyMessage="Награды отсутствуют.">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((item, index) => {
                    const imageUrl = item.reward.image_url ? buildFileUrl(item.reward.image_url) : null
                    const year = formatProfileYear(item.assigned_at)
                    return (
                        <div
                            key={item.assignment_id ?? `${item.reward.id}-${index}`}
                            className="rounded-2xl border border-app-border/40 bg-app-surface-3 p-4 text-center"
                        >
                            <div
                                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${
                                    index % 2 === 0 ? 'bg-brand-accent/10' : 'bg-hr-lilac/10'
                                }`}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt={item.reward.title} className="h-full w-full object-cover" />
                                ) : (
                                    <Award
                                        className={`h-6 w-6 ${index % 2 === 0 ? 'text-brand-accent' : 'text-hr-lilac'}`}
                                    />
                                )}
                            </div>
                            <p className="text-xs font-bold text-app-text" title={item.reward.title}>
                                {item.reward.title}
                            </p>
                            {year ? (
                                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-app-text-muted">{year}</p>
                            ) : null}
                        </div>
                    )
                })}
            </div>
        </EmployeeProfileSection>
    )
}
