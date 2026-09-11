'use client'

import { GraduationCap } from 'lucide-react'
import {
  formatEducationDegreeLabel,
  formatEducationPeriodShort,
} from '@/lib/employee-profile-format'
import type { PublicProfileEducation } from '@/types/employees'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileEducation({ items }: { items: PublicProfileEducation[] }) {
  return (
    <EmployeeProfileSection title="Образование" isEmpty={items.length === 0} emptyMessage="Образование не указано.">
      <div className="overflow-hidden rounded-3xl border border-app-border/40 bg-app-surface-0 divide-y divide-app-border/30">
        {items.map((item, index) => {
          const degreeLabel = formatEducationDegreeLabel(item.degree)
          const period = formatEducationPeriodShort(item.started_at, item.ended_at)

          return (
            <div
              key={item.id ?? `${item.institution}-${index}`}
              className="flex gap-4 px-5 py-4"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10"
                aria-hidden
              >
                <GraduationCap className="h-5 w-5 text-brand-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-app-text">
                  {item.institution?.trim() || 'Учебное заведение не указано'}
                </p>
                {degreeLabel ? (
                  <p className="mt-0.5 text-sm font-semibold text-brand-accent">{degreeLabel}</p>
                ) : null}
                {item.specialization?.trim() ? (
                  <p className="mt-0.5 text-sm text-app-text-muted">{item.specialization}</p>
                ) : null}
                {period ? (
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-app-text-muted">
                    {period}
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </EmployeeProfileSection>
  )
}
