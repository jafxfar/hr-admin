'use client'

import { GlassCard } from '../dashboard-glass-ui'

export interface KpiHealthWidgetProps {
  kpiPercent: number
  kpiMean: number | null
  dashRadius: number
  dashCircumference: number
  kpiDashOffset: number
  onTarget: number
  critical: number
}

export const KpiHealthWidget = ({
  kpiPercent,
  kpiMean,
  dashRadius,
  dashCircumference,
  kpiDashOffset,
  onTarget,
  critical,
}: KpiHealthWidgetProps) => (
  <GlassCard variant="glass" className="col-span-12 flex flex-col items-center justify-center text-center lg:col-span-4" data-marketing="kpi-health">
    <h3
      className="mb-1 text-xl font-bold text-app-text"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      KPI здоровье
    </h3>
    <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
      Общий показатель
    </p>

    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 192 192">
        <circle
          cx="96"
          cy="96"
          r={dashRadius}
          fill="transparent"
          stroke="var(--app-surface-4)"
          strokeWidth="12"
        />
        <circle
          cx="96"
          cy="96"
          r={dashRadius}
          fill="transparent"
          stroke="var(--brand-accent)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={dashCircumference}
          strokeDashoffset={kpiDashOffset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-black text-app-text"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {kpiMean !== null ? `${Math.round(kpiPercent)}%` : '—'}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
          Средний KPI
        </span>
      </div>
    </div>

    <div className="mt-8 flex gap-8">
      <div className="text-left">
        <div className="text-lg font-bold leading-tight text-brand-accent">{onTarget}</div>
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-app-text-muted">На цели</div>
      </div>
      <div className="border-l border-white/10 pl-8 text-left">
        <div className="text-lg font-bold leading-tight text-secondary">{critical}</div>
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-app-text-muted">В риске</div>
      </div>
    </div>
  </GlassCard>
)
