'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
  addMonths,
  addYears,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  startOfMonth,
  startOfYear,
} from 'date-fns'
import { ru } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

export type PrimeLikePanelView = 'date' | 'month' | 'year' | 'decade'
export type PrimeLikePickerView = 'date' | 'month' | 'year'

type Props = {
  pickerView: PrimeLikePickerView
  value?: Date
  onCommit: (next: Date) => void
  minDate?: Date
  maxDate?: Date
  locale?: string
  className?: string
}

const clampToDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

const isOutside = (d: Date, minDate?: Date, maxDate?: Date) => {
  const day = clampToDay(d)
  if (minDate && isBefore(day, clampToDay(minDate))) return true
  if (maxDate && isAfter(day, clampToDay(maxDate))) return true
  return false
}

const isMonthOutside = (monthDate: Date, minDate?: Date, maxDate?: Date) => {
  const start = startOfMonth(monthDate)
  const end = endOfMonth(monthDate)
  if (minDate && isBefore(end, clampToDay(minDate))) return true
  if (maxDate && isAfter(start, clampToDay(maxDate))) return true
  return false
}

const isYearOutside = (year: number, minDate?: Date, maxDate?: Date) => {
  const start = startOfYear(new Date(year, 0, 1))
  const end = endOfYear(new Date(year, 0, 1))
  if (minDate && isBefore(end, clampToDay(minDate))) return true
  if (maxDate && isAfter(start, clampToDay(maxDate))) return true
  return false
}

const isDecadeOutside = (startYear: number, minDate?: Date, maxDate?: Date) => {
  const start = startOfYear(new Date(startYear, 0, 1))
  const end = endOfYear(new Date(startYear + 9, 0, 1))
  if (minDate && isBefore(end, clampToDay(minDate))) return true
  if (maxDate && isAfter(start, clampToDay(maxDate))) return true
  return false
}

const formatMonthLabel = (d: Date, locale: string) =>
  d.toLocaleString(locale, { month: 'long' })

const formatMonthShortLabel = (d: Date, locale: string) =>
  d.toLocaleString(locale, { month: 'short' })

export const PrimeLikeDatepickerPanel = ({
  pickerView,
  value,
  onCommit,
  minDate,
  maxDate,
  locale = 'ru',
  className,
}: Props) => {
  const dayPickerLocale = locale === 'ru' ? ru : undefined

  const initialPanelView: PrimeLikePanelView =
    pickerView === 'year' ? 'year' : pickerView === 'month' ? 'month' : 'date'

  const [panelView, setPanelView] = React.useState<PrimeLikePanelView>(initialPanelView)
  const [activeDate, setActiveDate] = React.useState<Date>(() => value ?? new Date())

  React.useEffect(() => {
    setPanelView(initialPanelView)
  }, [initialPanelView])

  React.useEffect(() => {
    if (!value) return
    setActiveDate(value)
  }, [value])

  const handleTitleClick = () => {
    setPanelView((prev) => {
      if (prev === 'date') return 'month'
      if (prev === 'month') return 'year'
      if (prev === 'year') return 'decade'
      return 'decade'
    })
  }

  const navStep = panelView === 'date'
    ? { prev: () => addMonths(activeDate, -1), next: () => addMonths(activeDate, 1) }
    : panelView === 'month'
      ? { prev: () => addYears(activeDate, -1), next: () => addYears(activeDate, 1) }
      : panelView === 'year'
        ? { prev: () => addYears(activeDate, -10), next: () => addYears(activeDate, 10) }
        : { prev: () => addYears(activeDate, -100), next: () => addYears(activeDate, 100) }

  const titleLabel = (() => {
    if (panelView === 'date') {
      const month = formatMonthLabel(activeDate, locale)
      return `${month} ${activeDate.getFullYear()}`
    }

    if (panelView === 'month') return String(activeDate.getFullYear())

    if (panelView === 'year') {
      const start = Math.floor(activeDate.getFullYear() / 10) * 10 - 1
      const end = start + 11
      return `${start} - ${end}`
    }

    const start = Math.floor(activeDate.getFullYear() / 100) * 100 - 10
    const end = start + 110
    return `${start} - ${end}`
  })()

  const handleSelectMonth = (monthIndex: number) => {
    const next = new Date(activeDate.getFullYear(), monthIndex, 1)
    if (isMonthOutside(next, minDate, maxDate)) return

    setActiveDate(next)
    if (pickerView === 'month') {
      onCommit(next)
      return
    }
    setPanelView('date')
  }

  const handleSelectYear = (year: number) => {
    if (isYearOutside(year, minDate, maxDate)) return

    const next = new Date(year, activeDate.getMonth(), 1)
    setActiveDate(next)
    if (pickerView === 'year') {
      onCommit(new Date(year, 0, 1))
      return
    }
    setPanelView('month')
  }

  const handleSelectDecade = (startYear: number) => {
    if (isDecadeOutside(startYear, minDate, maxDate)) return
    setActiveDate(new Date(startYear, 0, 1))
    setPanelView('year')
  }

  const decadeStartYear = Math.floor(activeDate.getFullYear() / 100) * 100 - 10
  const yearGridStart = Math.floor(activeDate.getFullYear() / 10) * 10 - 1

  return (
    <div className={cn('p-2', className)}>
      <div className="flex items-center justify-between px-1 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Назад"
          onClick={() => setActiveDate(navStep.prev())}
          className="h-9 w-9"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <button
          type="button"
          onClick={handleTitleClick}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            handleTitleClick()
          }}
          tabIndex={0}
          aria-label="Переключить вид календаря"
          className="px-3 py-1 rounded-md text-sm font-medium text-app-text hover:bg-app-surface-2 transition-colors"
        >
          {titleLabel}
        </button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Вперёд"
          onClick={() => setActiveDate(navStep.next())}
          className="h-9 w-9"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {panelView === 'date' && (
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            if (!d) return
            if (isOutside(d, minDate, maxDate)) return
            onCommit(d)
          }}
          initialFocus
          month={activeDate}
          onMonthChange={setActiveDate}
          captionLayout="label"
          locale={dayPickerLocale}
          classNames={{
            nav: 'hidden',
            month_caption: 'hidden',
          }}
          fromYear={1900}
          toYear={2100}
          disabled={(d) => isOutside(d, minDate, maxDate)}
        />
      )}

      {panelView === 'month' && (
        <div className="w-56 grid grid-cols-4 gap-2 p-1">
          {Array.from({ length: 12 }).map((_, idx) => {
            const monthDate = new Date(activeDate.getFullYear(), idx, 1)
            const isDisabled = isMonthOutside(monthDate, minDate, maxDate)
            const isSelected =
              value?.getFullYear() === monthDate.getFullYear() &&
              value?.getMonth() === monthDate.getMonth()

            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectMonth(idx)}
                className={cn(
                  'h-11 rounded-md text-sm capitalize transition-colors',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-app-surface-0 text-app-text hover:bg-app-surface-2',
                )}
              >
                {formatMonthShortLabel(monthDate, locale)}
              </button>
            )
          })}
        </div>
      )}

      {panelView === 'year' && (
        <div className="grid grid-cols-3 gap-2 p-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const year = yearGridStart + i
            const isDisabled = isYearOutside(year, minDate, maxDate)
            const isSelected = value?.getFullYear() === year

            return (
              <button
                key={year}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectYear(year)}
                className={cn(
                  'h-10 rounded-md text-sm transition-colors',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-app-surface-0 text-app-text hover:bg-app-surface-2',
                )}
              >
                {year}
              </button>
            )
          })}
        </div>
      )}

      {panelView === 'decade' && (
        <div className="grid grid-cols-3 gap-2 p-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const startYear = decadeStartYear + i * 10
            const isDisabled = isDecadeOutside(startYear, minDate, maxDate)
            const isSelected =
              value &&
              value.getFullYear() >= startYear &&
              value.getFullYear() <= startYear + 9

            return (
              <button
                key={startYear}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectDecade(startYear)}
                className={cn(
                  'h-10 rounded-md text-sm transition-colors',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-app-surface-0 text-app-text hover:bg-app-surface-2',
                )}
              >
                {startYear}-{startYear + 9}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

