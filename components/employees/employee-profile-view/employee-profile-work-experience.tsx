'use client'

import {
  formatWorkExperienceCompanyLine,
  formatWorkExperiencePeriod,
} from '@/lib/employee-profile-format'
import type { PublicProfileWorkExperience } from '@/types/employees'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileWorkExperience({ items }: { items: PublicProfileWorkExperience[] }) {
  return (
    <EmployeeProfileSection title="Опыт работы" isEmpty={items.length === 0} emptyMessage="Опыт работы не указан.">
      <div className="rounded-3xl border border-app-border/40 bg-app-surface-0 p-6">
        <div className="space-y-8 border-l-2 border-brand-accent/50 pl-6">
          {items.map((item, index) => {
            const period = formatWorkExperiencePeriod(item.started_at, item.ended_at)
            const companyLine = formatWorkExperienceCompanyLine(item.company, item.description)

            return (
              <div key={item.id ?? `${item.company}-${index}`} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-brand-accent"
                />
                {period ? (
                  <p className="text-sm font-semibold text-brand-accent">{period}</p>
                ) : null}
                <h3 className="mt-1 text-base font-bold text-app-text">
                  {item.position?.trim() || 'Должность не указана'}
                </h3>
                {companyLine ? (
                  <p className="mt-1 text-sm text-app-text">{companyLine}</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </EmployeeProfileSection>
  )
}
