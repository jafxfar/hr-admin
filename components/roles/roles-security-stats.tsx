'use client'

import { Activity, CalendarClock, ShieldCheck } from 'lucide-react'

export const RolesSecurityStats = () => (
  <section className="admin-card-grid grid grid-cols-1 md:grid-cols-3">
    <div className="app-card-glass p-5">
      <StatHeader label="Соответствие политике" icon={ShieldCheck} />
      <p className="mt-4 text-4xl font-black">98.2%</p>
      <p className="text-xs text-app-text-muted mt-2">
        Стандартные учётные записи соответствуют требованиям MFA
      </p>
    </div>
    <div className="app-card-glass p-5">
      <StatHeader label="Периодичность аудита" icon={CalendarClock} />
      <p className="mt-4 text-4xl font-black">Ежедневно</p>
      <p className="text-xs text-brand-accent mt-2">ПОСЛЕДНЕЕ СКАНИРОВАНИЕ: 4 МИН НАЗАД</p>
    </div>
    <div className="app-card-glass flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-2xl font-black text-app-text">Аналитика безопасности</p>
        <p className="mt-2 max-w-xs text-xs text-app-text-muted">
          У роли менеджера отдела есть избыточные права, не использовавшиеся 30 дней
        </p>
        <button
          type="button"
          className="mt-3 rounded-full bg-brand-accent/12 px-4 py-2 text-xs font-bold text-brand-accent transition-colors hover:bg-brand-accent/20"
        >
          Рекомендации
        </button>
      </div>
      <Activity className="h-12 w-12 text-brand-accent/45" />
    </div>
  </section>
)
const StatHeader = ({
  label,
  icon: Icon,
}: {
  label: string
  icon: typeof ShieldCheck
}) => (
  <div className="flex items-center gap-2 text-app-text-muted">
    <Icon className="h-4 w-4 text-brand-accent" />
    <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
  </div>
)

