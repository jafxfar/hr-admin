'use client'

import React, { useEffect, useMemo, useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface Employee {
  id: number
  name: string
  position: string
  avatar?: string
  kpi: number
  bonus: number
  /** Значения по дням (число или строка с бэкенда) */
  dailyKpi: { [key: string]: unknown }
}

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

export type HeatLevel = 'excellent' | 'standard' | 'idle'

/** Родительный падеж для подписи «7 апреля» */
const MONTH_NAME_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
] as const

interface KPITableProps {
  employees: Employee[]
  days: Day[]
  /** Например: «Октябрь 2025» */
  monthTitle: string
  /** Индекс месяца 0–11 (для даты в тултипе) */
  monthIndex: number
  /** Сброс страницы при смене месяца / фильтра */
  listKey?: string
}

const PAGE_SIZE = 10

// ── Пороги цветов (единая логика) ─────────────────────────────────────────────
//
// Тепловая карта (каждый день), относительно максимума по этой строке за месяц (rowMax):
//   • ПРОСТОЙ — нет значения за день.
//   • ОТЛИЧНО — значение ≥ rowMax × KPI_HEATMAP_EXCELLENT_MIN_RATIO (при rowMax > 0).
//   • СТАНДАРТ — значение есть, но ниже порога «отлично» (при rowMax > 0).
//   • Если rowMax = 0, но число за день всё же есть — считаем СТАНДАРТ.
//
// Колонка «Показатель KPI» (среднее за месяц по сотруднику):
//   • «—» — нет данных или 0.
//   • Красный (#FF6B6B) — 0 < KPI < KPI_AGGREGATE_WARN_BELOW (ниже нормы).
//   • Белый — KPI ≥ KPI_AGGREGATE_WARN_BELOW.
//
export const KPI_HEATMAP_EXCELLENT_MIN_RATIO = 0.75
/** Ниже этого значения средний KPI подсвечивается красным (при KPI > 0). */
export const KPI_AGGREGATE_WARN_BELOW = 60

/** Тепловая карта: в light чуть светлее «стандарт» и «простой», чтобы читалось на белом фоне */
const HEAT = {
  excellent: 'bg-brand-accent',
  standard: 'bg-[#6d8540] dark:bg-[#5a6b35]',
  idle: 'bg-app-surface-3 dark:bg-[#2d2d2d]',
} as const

/** Бэкенд иногда отдаёт actual_value строкой */
function toFiniteNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value === 'string' && value.trim() === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function getInitials(name?: string | null): string {
  const trimmed = name?.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/[\s@._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2)
  }
  return trimmed.slice(0, 2).toUpperCase() || '?'
}

/** Уровень ячейки: относительно максимума по строке за месяц */
function heatLevelForDay(value: number | undefined, rowMax: number): HeatLevel {
  if (value === undefined || Number.isNaN(value)) return 'idle'
  if (rowMax <= 0) return 'standard'
  if (value >= rowMax * KPI_HEATMAP_EXCELLENT_MIN_RATIO) return 'excellent'
  return 'standard'
}

function rowMaxForMonth(employee: Employee, days: Day[]): number {
  let max = 0
  for (const d of days) {
    const v = toFiniteNumber(employee.dailyKpi[d.day])
    if (v != null && v > max) max = v
  }
  return max
}

function formatTooltipDate(dayOfMonth: number, monthIndex: number): string {
  const m = Math.max(0, Math.min(11, monthIndex))
  const month = MONTH_NAME_GENITIVE[m]
  const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${dayOfMonth} ${capitalMonth}`
}

export const KPITable: React.FC<KPITableProps> = ({
  employees,
  days,
  monthTitle,
  monthIndex,
  listKey,
}) => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [listKey])

  const total = employees.length
  const totalPages = total === 0 ? 1 : Math.ceil(total / PAGE_SIZE)

  const pageClamped = Math.min(page, totalPages)
  const start = (pageClamped - 1) * PAGE_SIZE
  const slice = useMemo(
    () => employees.slice(start, start + PAGE_SIZE),
    [employees, start],
  )

  const dayChunks = useMemo(() => {
    const chunkSize = 5
    const chunks: Day[][] = []
    for (let i = 0; i < days.length; i += chunkSize) {
      chunks.push(days.slice(i, i + chunkSize))
    }
    return chunks
  }, [days])

  const handleExport = () => {
    // Заглушка: при необходимости подключить выгрузку CSV
  }

  return (
    <TooltipPrimitive.Provider delayDuration={150} skipDelayDuration={300}>
      <div className="relative pb-28  min-h-[320px]">
        {/* Карточка как в макете: крупный border-radius */}
        <div className="relative overflow-hidden rounded-[28px] border border-app-border bg-app-surface-0 px-5 py-7 shadow-xl shadow-black/5 dark:shadow-black/40 sm:px-8 sm:py-9" data-marketing="kpi-table">
          {/* Верх: заголовок слева, легенда + экспорт справа */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-app-text sm:text-2xl">
                Реестр производительности{' '}
                <span className="font-medium text-app-text-muted">— {monthTitle}</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-app-text-muted">
                Комплексная тепловая карта за 30 дней и распределение метрик
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-app-text-muted">
                <span className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.excellent}`} />
                  ОТЛИЧНО
                </span>
                <span className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.standard}`} />
                  СТАНДАРТ
                </span>
                <span className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-3 rounded-[3px] ${HEAT.idle}`} />
                  ПРОСТОЙ
                </span>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-app-text-on-accent shadow-md transition hover:brightness-95"
              >
                <Download className="h-4 w-4" strokeWidth={2.5} />
                Экспорт данных
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-4xl text-xs font-medium leading-relaxed text-app-text-muted">
            <span className="font-medium text-app-text-muted">Логика цветов: </span>
            тепловая карта — «отлично» (лайм), если значение дня ≥{' '}
            {Math.round(KPI_HEATMAP_EXCELLENT_MIN_RATIO * 100)}% от максимума по этой строке за месяц;
            «стандарт» — день есть, но ниже порога; «простой» — нет данных за день. Колонка KPI: красный
            при 0 &lt; среднее &lt; {KPI_AGGREGATE_WARN_BELOW}; при среднем ≥ {KPI_AGGREGATE_WARN_BELOW} — обычный цвет текста.
          </p>

          {/* Панель таблицы: внутреннее скругление */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-app-border bg-app-surface-0">
            {/* Шапка: одна линия по верху — items-start, общий фон ряда */}
            <div className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2.2fr)_minmax(112px,auto)] items-stretch border-b border-app-border bg-app-surface-2 sm:grid-cols-[minmax(220px,1.1fr)_minmax(0,2.2fr)_minmax(120px,auto)]">
              <div className="flex items-start border-r border-app-border bg-app-surface-2/80 px-4 py-5 sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted sm:text-xs sm:tracking-[0.16em]">
                  Сотрудник / роль
                </span>
              </div>
              <div className="flex items-start border-r border-app-border px-4 py-5 sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted sm:text-xs sm:tracking-[0.16em]">
                  Тепловая карта скорости за 30 дней
                </span>
              </div>
              <div className="flex items-start justify-end px-4 py-5 text-right sm:px-7 sm:py-6">
                <span className="text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-app-text-muted sm:text-xs sm:tracking-[0.16em]">
                  Показатель KPI
                </span>
              </div>
            </div>

            {/* Строки */}
            <div className="divide-y divide-app-border">
              {slice.map((employee) => {
                const rowMax = rowMaxForMonth(employee, days)
                const kpiAvg = toFiniteNumber(employee.kpi)
                const kpiLow =
                  kpiAvg != null && kpiAvg > 0 && kpiAvg < KPI_AGGREGATE_WARN_BELOW

                return (
                  <div
                    key={employee.id}
                    className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2.2fr)_minmax(112px,auto)] items-stretch gap-0 sm:grid-cols-[minmax(220px,1.1fr)_minmax(0,2.2fr)_minmax(120px,auto)]"
                  >
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
                        <div className="truncate text-[15px] font-semibold text-app-text">
                          {employee.name?.trim() || '—'}
                        </div>
                        <div className="truncate text-xs font-medium uppercase tracking-[0.08em] text-app-text-muted">
                          {employee.position || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="flex min-h-[72px] items-center border-l border-app-border px-3 py-5 sm:px-5 sm:py-6">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto pb-0.5">
                        {dayChunks.map((chunk, ci) => (
                          <div key={ci} className="flex gap-1">
                            {chunk.map((day) => {
                              const value = toFiniteNumber(employee.dailyKpi[day.day])
                              const level = heatLevelForDay(value, rowMax)
                              return (
                                <TooltipPrimitive.Root key={day.day}>
                                  <TooltipPrimitive.Trigger asChild>
                                    <button
                                      type="button"
                                      className={`h-4 w-4 shrink-0 cursor-pointer rounded-[3px] outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-accent/50 ${HEAT[level]}`}
                                      aria-label={`День ${day.day}, KPI ${value != null ? value.toFixed(1) : 'нет данных'}`}
                                    />
                                  </TooltipPrimitive.Trigger>
                                  <TooltipPrimitive.Portal>
                                    <TooltipPrimitive.Content
                                      side="top"
                                      sideOffset={10}
                                      className="z-100 min-w-[180px] max-w-[260px] rounded-2xl border border-app-border bg-app-surface-0 px-4 py-3 text-left text-app-text shadow-2xl"
                                    >
                                      <div className="text-sm font-semibold leading-snug text-app-text">
                                        {formatTooltipDate(day.day, monthIndex)}
                                      </div>
                                      <div className="mt-1.5 text-base font-semibold tabular-nums leading-snug text-brand-accent">
                                        Значение KPI:{' '}
                                        {value != null ? value.toFixed(1) : '—'}
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

                    <div className="flex min-h-[72px] items-center justify-end border-l border-app-border px-4 py-5 sm:px-7 sm:py-6">
                      <span
                        className={`text-3xl font-bold tabular-nums tracking-tight sm:text-[32px] ${
                          kpiLow ? 'text-[color:var(--error)]' : 'text-app-text'
                        }`}
                      >
                        {kpiAvg != null && kpiAvg > 0 ? kpiAvg.toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {slice.length === 0 && (
              <div className="py-16 text-center text-sm text-app-text-muted">
                Нет данных за выбранный период
              </div>
            )}
          </div>

          {/* Подвал */}
          <div className="mt-8 flex flex-col gap-4 border-t border-app-border pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-app-text-muted">
              {total > 0 ? (
                <>
                  Отображение {start + 1} – {Math.min(start + PAGE_SIZE, total)} из {total} записей
                </>
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

        {/* FAB — с тем же акцентом */}
        <button
          type="button"
          className="absolute bottom-6 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-app-text-on-accent shadow-lg shadow-black/15 transition hover:brightness-95 dark:shadow-black/50 sm:right-6"
          aria-label="Добавить"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>
      </div>
    </TooltipPrimitive.Provider>
  )
}
