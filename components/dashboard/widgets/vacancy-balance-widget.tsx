'use client'

import { Briefcase, TrendingUp, Users2 } from 'lucide-react'
import type { VacanciesDashboardResponse } from '@/types/dashboard'
import { BalanceRow, GlassCard } from '../dashboard-glass-ui'

export interface VacancyBalanceWidgetProps {
  vacancySummary: VacanciesDashboardResponse | null
  openPct: number
  closedPct: number
}

export const VacancyBalanceWidget = ({
  vacancySummary,
  openPct,
  closedPct,
}: VacancyBalanceWidgetProps) => (
  <GlassCard variant="glass" className="col-span-12 flex flex-col lg:col-span-4">
    <h3
      className="mb-1 text-xl font-bold text-app-text"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      Баланс вакансий
    </h3>
    <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
      Глобальное распределение
    </p>

    <div className="flex flex-1 flex-col justify-center gap-8">
      <BalanceRow
        icon={<Briefcase className="h-5 w-5" />}
        iconWrapperClass="bg-brand-accent/10 text-brand-accent"
        value={String(vacancySummary?.open_vacancies ?? 0)}
        label={`${openPct}% · открытые`}
        barColor="bg-brand-accent"
        barPct={openPct}
      />
      <BalanceRow
        icon={<Users2 className="h-5 w-5" />}
        iconWrapperClass="bg-secondary/10 text-secondary"
        value={String(vacancySummary?.closed_vacancies ?? 0)}
        label={`${closedPct}% · закрытые`}
        barColor="bg-secondary"
        barPct={closedPct}
      />
    </div>

    <div className="mt-8 rounded-2xl border border-app-border bg-app-surface-1 p-4 text-xs font-medium leading-relaxed text-app-text-muted">
      <span className="flex items-center gap-1.5 text-app-text-muted">
        <TrendingUp className="h-3.5 w-3.5 text-brand-accent" />
        В этом месяце закрыто{' '}
        <span className="font-bold text-brand-accent">{vacancySummary?.closed_in_month ?? 0}</span>{' '}
        вакансий, за год —{' '}
        <span className="font-bold text-app-text">{vacancySummary?.closed_this_year ?? 0}</span>.
      </span>
    </div>
  </GlassCard>
)
