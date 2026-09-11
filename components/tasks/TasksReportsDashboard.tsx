'use client'

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Timer,
  UserRoundX,
} from 'lucide-react'
import Loading from '@/components/ui/loading'
import { EMPTY_TASK_DASHBOARD } from '@/api/tasks'
import type { TaskDashboardResponse } from '@/types/tasks'

type TasksReportsDashboardProps = {
  dashboard: TaskDashboardResponse | undefined
  isLoading: boolean
}

type KpiCard = {
  label: string
  value: number
  icon: typeof ListTodo
  accent?: boolean
}

export const TasksReportsDashboard = ({
  dashboard,
  isLoading,
}: TasksReportsDashboardProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loading />
      </div>
    )
  }

  const stats = dashboard ?? EMPTY_TASK_DASHBOARD

  const kpiCards: KpiCard[] = [
    { label: 'Всего', value: stats.total, icon: ListTodo },
    { label: 'Открыто', value: stats.open, icon: ListTodo },
    { label: 'Выполнено', value: stats.completed, icon: CheckCircle2 },
    { label: 'Просрочено', value: stats.overdue, icon: Timer, accent: stats.overdue > 0 },
    { label: 'Без исполнителя', value: stats.unassigned, icon: UserRoundX },
    { label: 'Без проекта', value: stats.without_project, icon: FolderKanban },
    { label: 'Сегодня', value: stats.due_today, icon: CalendarDays },
    { label: 'На этой неделе', value: stats.due_this_week, icon: CalendarDays },
  ]

  return (
    <div className="admin-card-grid grid grid-cols-12 gap-3 pb-6">
      <section className="app-panel-glass col-span-12 p-6">
        <h2 className="text-xl font-bold text-app-text">Сводка по задачам</h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-app-text-muted">
          Метрики с учётом текущих фильтров · {Math.round(stats.completion_percent)}% выполнено
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpiCards.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="rounded-2xl border border-black/10 bg-app-surface-1 p-4 dark:border-white/15"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-app-text-muted">
                  {label}
                </span>
                <Icon
                  className={`h-4 w-4 ${accent ? 'text-red-600 dark:text-red-400' : 'text-app-text-muted'}`}
                  aria-hidden
                />
              </div>
              <p
                className={`text-3xl font-extrabold tabular-nums ${
                  accent ? 'text-red-600 dark:text-red-400' : 'text-app-text'
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-panel-glass col-span-12 p-6 lg:col-span-7">
        <h3 className="text-lg font-bold text-app-text">Распределение по статусам</h3>
        <p className="mt-1 text-xs text-app-text-muted">Доля задач в каждом статусе</p>

        {stats.by_status.length === 0 ? (
          <p className="mt-8 text-center text-sm text-app-text-muted">Нет данных для отображения</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {stats.by_status.map((row) => {
              const widthPct = Math.round(row.percent)
              return (
                <li key={row.code}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-app-text">{row.title}</span>
                    <span className="tabular-nums text-app-text-muted">
                      {row.count} · {widthPct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-app-surface-1">
                    <div
                      className="h-full rounded-full bg-brand-accent transition-all"
                      style={{ width: `${widthPct}%` }}
                      role="presentation"
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="app-panel-glass col-span-12 p-6 lg:col-span-5">
        <h3 className="text-lg font-bold text-app-text">По проектам</h3>
        {stats.by_project.length === 0 ? (
          <p className="mt-8 text-center text-sm text-app-text-muted">Нет проектных данных</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {stats.by_project.map((row) => (
              <li
                key={row.id ?? row.name}
                className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-3"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-app-text">{row.name}</span>
                  <span className="tabular-nums text-app-text-muted">
                    {Math.round(row.completion_percent)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-app-text-muted">
                  {row.completed}/{row.total} выполнено
                  {row.overdue > 0 ? ` · ${row.overdue} просрочено` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-4 space-y-3 text-sm text-app-text-muted">
          {stats.overdue > 0 ? (
            <li className="flex gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                {stats.overdue} {stats.overdue === 1 ? 'задача просрочена' : 'задач просрочено'}
              </span>
            </li>
          ) : (
            <li className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-3">
              Просроченных задач нет
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
