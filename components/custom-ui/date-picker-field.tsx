'use client'

import React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { addYears, format, isValid, parse, startOfDay } from 'date-fns'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PrimeLikeDatepickerPanel } from '@/components/ui/prime-like-datepicker-panel'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--app-surface-1)',
  border: '1px solid var(--app-border-accent)',
  borderRadius: '24px',
  padding: '14px 16px',
  color: 'var(--app-text)',
  fontSize: '14px',
  outline: 'none',
  transition: 'box-shadow 0.2s',
}

type DatePickerFieldProps = {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  isBirthDate?: boolean
  view?: 'date' | 'month' | 'year'
  minDate?: string
  maxDate?: string
  locale?: string
  showIcon?: boolean
  readOnlyInput?: boolean
  id?: string
  name?: string
  hasError?: boolean
}

const parseIsoDate = (iso?: string) => {
  if (!iso) return undefined
  const parsed = parse(iso, 'yyyy-MM-dd', new Date())
  if (!isValid(parsed)) return undefined
  return parsed
}

const toDisplay = (iso: string | undefined, view: 'date' | 'month' | 'year') => {
  const parsed = parseIsoDate(iso)
  if (!parsed) return ''

  if (view === 'year') return format(parsed, 'yyyy')
  if (view === 'month') return format(parsed, 'MM.yyyy')
  return format(parsed, 'dd.MM.yyyy')
}

const toIsoFromDisplay = (display: string, view: 'date' | 'month' | 'year') => {
  if (view === 'year') {
    const parsed = parse(display, 'yyyy', new Date())
    if (!isValid(parsed)) return null
    return format(new Date(parsed.getFullYear(), 0, 1), 'yyyy-MM-dd')
  }

  if (view === 'month') {
    const parsed = parse(display, 'MM.yyyy', new Date())
    if (!isValid(parsed)) return null
    return format(new Date(parsed.getFullYear(), parsed.getMonth(), 1), 'yyyy-MM-dd')
  }

  const parsed = parse(display, 'dd.MM.yyyy', new Date())
  if (!isValid(parsed)) return null
  return format(parsed, 'yyyy-MM-dd')
}

const digitsToDisplay = (digits: string) => {
  const d = digits.slice(0, 8)
  const day = d.slice(0, 2)
  const month = d.slice(2, 4)
  const year = d.slice(4, 8)

  if (d.length <= 2) return day
  if (d.length <= 4) return `${day}.${month}`
  return `${day}.${month}.${year}`
}

const countDigits = (s: string) => (s.match(/\d/g) ?? []).length

const caretFromDigitsCount = (formatted: string, digitsCount: number) => {
  if (digitsCount <= 0) return 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i] ?? '')) {
      seen += 1
      if (seen === digitsCount) return i + 1
    }
  }
  return formatted.length
}

export const DatePickerField = ({
  value,
  onChange,
  placeholder = 'ДД.ММ.ГГГГ',
  disabled,
  isBirthDate,
  view = 'date',
  minDate,
  maxDate,
  locale = 'ru',
  showIcon = true,
  readOnlyInput,
  id,
  name,
  hasError = false,
}: DatePickerFieldProps) => {
  const errorShadow = '0 0 0 2px rgb(239 68 68 / 0.55)'
  const focusShadow = hasError
    ? errorShadow
    : '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)'
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState(() => toDisplay(value, view))
  const [hasFocus, setHasFocus] = React.useState(false)
  const instanceId = React.useId()

  const maxBirthDate = React.useMemo(() => addYears(new Date(), -18), [])
  const minDateObj = React.useMemo(() => parseIsoDate(minDate), [minDate])
  const maxDateObj = React.useMemo(() => parseIsoDate(maxDate), [maxDate])

  const effectiveMin = minDateObj
  const effectiveMax = isBirthDate ? maxBirthDate : maxDateObj

  React.useEffect(() => {
    if (hasFocus) return
    setDraft(toDisplay(value, view))
  }, [value, hasFocus, view])

  React.useEffect(() => {
    if (!open) return
    setDraft(toDisplay(value, view))
  }, [open, value, view])

  const isInputReadOnly = readOnlyInput ?? view !== 'date'

  const selectedDate = React.useMemo(() => {
    const isoCandidate = (() => {
      if (view === 'date' && draft.length === 10) {
        const iso = toIsoFromDisplay(draft, 'date')
        return iso ?? (value || null)
      }
      return value || null
    })()

    if (!isoCandidate) return undefined

    const parsed = parseIsoDate(isoCandidate)
    if (!parsed) return undefined

    if (effectiveMin && parsed < effectiveMin) return undefined
    if (effectiveMax && parsed > effectiveMax) return undefined

    return parsed
  }, [value, draft, view, effectiveMin, effectiveMax])

  const handleCommitIfValid = (nextDisplay: string) => {
    if (view !== 'date') return
    if (nextDisplay.length !== 10) return

    const iso = toIsoFromDisplay(nextDisplay, 'date')
    if (!iso) return

    const parsed = parseIsoDate(iso)
    if (!parsed) return

    if (effectiveMin && parsed < effectiveMin) return
    if (effectiveMax && parsed > effectiveMax) return

    onChange(iso)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInputReadOnly) return
    const el = e.currentTarget
    const raw = el.value
    const caret = el.selectionStart ?? raw.length
    const digitsBeforeCaret = countDigits(raw.slice(0, caret))

    const digits = raw.replace(/\D/g, '').slice(0, 8)
    const formatted = digitsToDisplay(digits)
    setDraft(formatted)

    requestAnimationFrame(() => {
      const nextCaret = caretFromDigitsCount(formatted, digitsBeforeCaret)
      el.setSelectionRange(nextCaret, nextCaret)
    })

    if (formatted === '') {
      onChange('')
      return
    }

    handleCommitIfValid(formatted)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInputReadOnly) return
    if (e.ctrlKey || e.metaKey) return

    const allowed = new Set([
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ])
    if (allowed.has(e.key)) return
    if (/^\d$/.test(e.key)) return

    e.preventDefault()
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setHasFocus(false)
    const popoverEl = document.querySelector<HTMLElement>(`[data-date-picker-popover="${instanceId}"]`)
    const next = e.relatedTarget
    if (next && popoverEl?.contains(next)) return

    if (isInputReadOnly) {
      setDraft(toDisplay(value, view))
      return
    }

    if (draft.length === 0) return
    if (draft.length !== 10) return

    const iso = toIsoFromDisplay(draft, 'date')
    if (!iso) {
      setDraft(toDisplay(value, view))
      return
    }

    const parsed = parseIsoDate(iso)
    if (!parsed) {
      setDraft(toDisplay(value, view))
      return
    }

    if (effectiveMin && parsed < effectiveMin) {
      setDraft(toDisplay(value, view))
      return
    }

    if (effectiveMax && parsed > effectiveMax) {
      setDraft(toDisplay(value, view))
      return
    }

    onChange(iso)
  }

  const handleCommitFromPanel = (date: Date) => {
    const d = startOfDay(date)
    if (effectiveMin && d < effectiveMin) return
    if (effectiveMax && d > effectiveMax) return

    const iso = format(d, 'yyyy-MM-dd')
    onChange(iso)
    setDraft(toDisplay(iso, view))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={draft}
          disabled={disabled}
          readOnly={isInputReadOnly}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setHasFocus(true)
            e.currentTarget.style.boxShadow = focusShadow
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = hasError ? errorShadow : 'none'
            handleBlur(e)
          }}
          style={{
            ...fieldStyle,
            paddingRight: 44,
            cursor: disabled ? 'not-allowed' : 'text',
            boxShadow: hasError ? errorShadow : undefined,
          }}
        />
        {showIcon && (
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Открыть календарь"
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-app-surface-2 border border-app-border-accent/40 hover:bg-app-surface-3 transition-colors"
              style={{ border: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
              <CalendarIcon size={16} style={{ color: 'var(--app-text-muted)' }} />
            </button>
          </PopoverTrigger>
        )}
      </div>

      <PopoverContent
        className="w-auto p-0"
        align="start"
        data-date-picker-popover={instanceId}
      >
        <PrimeLikeDatepickerPanel
          pickerView={view}
          value={selectedDate}
          onCommit={handleCommitFromPanel}
          minDate={effectiveMin}
          maxDate={effectiveMax}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}

