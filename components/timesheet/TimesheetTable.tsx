'use client'

import React, { useEffect, useMemo, useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Employee {
  id: number
  name: string
  position: string
  days: number
  hours: number
  minutes: number
  avatar?: string
  dailyHours: { [key: string]: number }
}

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

interface TimesheetTableProps {
  employees: Employee[]
  days: Day[]
  monthTitle?: string
  monthIndex?: number
  listKey?: string
}

const MONTH_NAME_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
] as const

const PAGE_SIZE = 10

const HEAT = {
  worked: 'bg-brand-accent',
  weekend: 'bg-[color:var(--error)]/20',
  idle: 'bg-app-surface-3',
} as const

function getInitials(name: string | null | undefined): string {
  const trimmed = name?.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/[\s@._-]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return trimmed.slice(0, 2).toUpperCase() || '?'
}

function formatTooltipDate(dayOfMonth: number, monthIndex: number): string {
  const month = MONTH_NAME_GENITIVE[Math.max(0, Math.min(11, monthIndex))]
  return `${dayOfMonth} ${month.charAt(0).toUpperCase() + month.slice(1)}`
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({
  employees,
  days,
  monthTitle = '',
  monthIndex = new Date().getMonth(),
  listKey,
}) => {
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [listKey])

  const total = employees.length
  const totalPages = total === 0 ? 1 : Math.ceil(total / PAGE_SIZE)
  const pageClamped = Math.min(page, totalPages)
  const start = (pageClamped - 1) * PAGE_SIZE
  const slice = useMemo(() => employees.slice(start, start + PAGE_SIZE), [employees, start])

  const dayChunks = useMemo(() => {
    const chunks: Day[][] = []
    for (let i = 0; i < days.length; i += 5) chunks.push(days.slice(i, i + 5))
    return chunks
  }, [days])

  return (
    <TooltipPrimitive.Provider delayDuration={150} skipDelayDuration={300}>
      <div className="relative pb-28 min-h-[320px]">
        <div className="relative overflow-hidden rounded-[28px] border border-app-border bg-app-surface-0 px-5 py-7 shadow-xl shadow-black/5 dark:shadow-black/40 sm:px-8 sm:py-9">

          {/* Заголовок */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-app-text sm:text-2xl">
                Табель учёта времени{' '}
                {monthTitle && <span className="font-medium text-app-text-muted">— {monthTitle}</span>}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-app-text-muted">
                Тепловая карта присутствия сотрудников за месяц
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-app-text-muted">
              <span className="flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.worked}`} />
                Отработано
              </span>
              <span className="flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.weekend}`} />
                Выходной
              </span>
              <span className="flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.idle}`} />
                Нет данных
              </span>
            </div>
          </div>

          {/* Таблица */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-app-border bg-app-surface-0">
            {/* Шапка */}
            <div className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2.2fr)_minmax(130px,auto)] items-stretch border-b border-app-border bg-app-surface-2 sm:grid-cols-[minmax(220px,1.1fr)_minmax(0,2.2fr)_minmax(140px,auto)]">
              <div className="flex items-start border-r border-app-border px-4 py-5 sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted">
                  Сотрудник / роль
                </span>
              </div>
              <div className="flex items-start border-r border-app-border px-4 py-5 sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted">
                  Тепловая карта присутствия за месяц
                </span>
              </div>
              <div className="flex items-start justify-end px-4 py-5 text-right sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted">
                  Дней / Часов
                </span>
              </div>
            </div>

            {/* Строки */}
            <div className="divide-y divide-app-border">
              {slice.map((employee) => (
                <div
                  key={employee.id}
                  className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2.2fr)_minmax(130px,auto)] items-stretch sm:grid-cols-[minmax(220px,1.1fr)_minmax(0,2.2fr)_minmax(140px,auto)]"
                >
                  {/* Сотрудник */}
                  <div className="flex min-h-[72px] min-w-0 items-center gap-3 px-4 py-5 sm:px-7 sm:py-6">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-app-border-accent"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-app-surface-3 text-xs font-semibold text-app-text ring-1 ring-app-border-accent">
                        {getInitials(employee.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold text-app-text">{employee.name}</div>
                      <div className="truncate text-xs font-medium uppercase tracking-[0.08em] text-app-text-muted">
                        {employee.position || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Тепловая карта */}
                  <div className="flex min-h-[72px] items-center border-l border-app-border px-3 py-5 sm:px-5 sm:py-6">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
                      {dayChunks.map((chunk, ci) => (
                        <div key={ci} className="flex gap-1">
                          {chunk.map((day) => {
                            const h = employee.dailyHours[day.day] ?? 0
                            const isWorked = h > 0
                            const heatClass = day.isWeekend ? HEAT.weekend : isWorked ? HEAT.worked : HEAT.idle
                            return (
                              <TooltipPrimitive.Root key={day.day}>
                                <TooltipPrimitive.Trigger asChild>
                                  <button
                                    type="button"
                                    className={`h-4 w-4 shrink-0 cursor-pointer rounded-[3px] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-accent/50 ${heatClass}`}
                                    aria-label={`${day.day}, ${isWorked ? h.toFixed(1) + 'ч' : 'нет данных'}`}
                                  />
                                </TooltipPrimitive.Trigger>
                                <TooltipPrimitive.Portal>
                                  <TooltipPrimitive.Content
                                    side="top"
                                    sideOffset={10}
                                    className="z-100 min-w-[180px] max-w-[240px] rounded-2xl border border-app-border bg-app-surface-0 px-4 py-3 text-left text-app-text shadow-2xl"
                                  >
                                    <div className="text-sm font-semibold leading-snug text-app-text">
                                      {formatTooltipDate(day.day, monthIndex)}
                                      {day.isWeekend && <span className="ml-2 text-[color:var(--error)] text-xs">(выходной)</span>}
                                    </div>
                                    <div className="mt-1.5 text-base font-semibold tabular-nums leading-snug text-brand-accent">
                                      {isWorked ? `${h.toFixed(1)} ч` : '—'}
                                    </div>
                                    <TooltipPrimitive.Arrow className="fill-app-surface-0" width={14} height={7} />
                                  </TooltipPrimitive.Content>
                                </TooltipPrimitive.Portal>
                              </TooltipPrimitive.Root>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Итоги */}
                  <div className="flex min-h-[72px] flex-col items-end justify-center border-l border-app-border px-4 py-5 sm:px-7 sm:py-6">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-app-text sm:text-[28px]">
                      {employee.days} дн.
                    </span>
                    <span className="mt-0.5 text-sm font-medium tabular-nums text-app-text-muted">
                      {employee.hours} ч {employee.minutes > 0 ? `${employee.minutes} мин` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {slice.length === 0 && (
              <div className="py-16 text-center text-sm text-app-text-muted">
                Нет данных за выбранный период
              </div>
            )}
          </div>

          {/* Подвал с пагинацией */}
          <div className="mt-8 flex flex-col gap-4 border-t border-app-border pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-app-text-muted">
              {total > 0 ? (
                <>Отображение {start + 1} – {Math.min(start + PAGE_SIZE, total)} из {total} записей</>
              ) : (
                <>Нет записей</>
              )}
            </p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                disabled={pageClamped <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 text-sm font-medium text-app-text-muted disabled:pointer-events-none disabled:opacity-40 hover:text-app-text"
              >
                <ChevronLeft className="h-4 w-4" />
                Назад
              </button>
              <button
                type="button"
                disabled={pageClamped >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent disabled:pointer-events-none disabled:opacity-40 hover:brightness-110"
              >
                Следующая группа
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  )
}
