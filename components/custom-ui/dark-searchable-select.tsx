'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Loader2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SearchableSelectOption = { value: string; label: string }

const triggerStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--app-surface-1)',
  border: '1px solid var(--app-border-accent)',
  borderRadius: 24,
  padding: '10px 16px',
  color: 'var(--app-text)',
  fontSize: 14,
  outline: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'box-shadow 0.2s',
  minHeight: 52,
}

type DarkSearchableSelectProps = {
  value: string
  onChange: (next: string) => void
  options: SearchableSelectOption[]
  searchValue: string
  onSearchChange: (next: string) => void
  isLoading?: boolean
  minSearchLength?: number
  placeholder?: string
  searchPlaceholder?: string
  hintMinLength?: string
  emptyHint?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
}

export function DarkSearchableSelect({
  value,
  onChange,
  options,
  searchValue,
  onSearchChange,
  isLoading = false,
  minSearchLength = 2,
  placeholder = 'Выберите значение',
  searchPlaceholder = 'Поиск...',
  hintMinLength = `Введите не менее ${minSearchLength} символов`,
  emptyHint = 'Ничего не найдено',
  disabled,
  clearable = true,
  className,
}: DarkSearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [labelCache, setLabelCache] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!value) {
      setLabelCache('')
      return
    }
    const hit = options.find((o) => o.value === value)
    if (hit) setLabelCache(hit.label)
  }, [value, options])

  const canQuery = searchValue.trim().length >= minSearchLength
  const boxShadow = focused || open ? '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)' : 'none'

  const handleClear = () => {
    onChange('')
    setLabelCache('')
    onSearchChange('')
  }

  const handlePick = (opt: SearchableSelectOption) => {
    onChange(opt.value)
    setLabelCache(opt.label)
    setOpen(false)
    setFocused(false)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        style={{
          ...triggerStyle,
          boxShadow,
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: disabled ? 'not-allowed' : 'default',
        }}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            setOpen((v) => !v)
            setFocused(true)
          }}
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: 'inherit',
            fontSize: 14,
            fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: value ? 'var(--app-text)' : 'var(--app-text-muted)',
            }}
          >
            {value ? labelCache || placeholder : placeholder}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: 'var(--app-text-muted)',
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              flexShrink: 0,
              padding: 4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--app-text-muted)',
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Сбросить выбор"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'var(--app-surface-2)',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderBottom: '1px solid var(--app-surface-3)',
            }}
          >
            {isLoading ? (
              <Loader2 size={13} className="animate-spin text-app-text-muted shrink-0" />
            ) : (
              <Search size={13} style={{ color: 'var(--app-text-muted)', flexShrink: 0 }} />
            )}
            <input
              ref={searchRef}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--app-text)',
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ maxHeight: 220, overflowY: 'auto', padding: '4px 0' }}>
            {!canQuery ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--app-text-muted)',
                  fontSize: 12,
                }}
              >
                {hintMinLength}
              </div>
            ) : isLoading ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--app-text-muted)',
                  fontSize: 12,
                }}
              >
                Загрузка...
              </div>
            ) : options.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--app-text-muted)',
                  fontSize: 12,
                }}
              >
                {emptyHint}
              </div>
            ) : (
              options.map((opt) => {
                const selected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePick(opt)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      background: selected ? 'rgb(var(--theme-primary-rgb) / 0.08)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: selected ? 'var(--app-text)' : 'var(--app-text-muted)',
                      fontSize: 13,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--app-surface-3)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.background = selected
                        ? 'rgb(var(--theme-primary-rgb) / 0.08)'
                        : 'transparent'
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selected ? 'var(--brand-accent)' : 'transparent',
                        border: selected
                          ? '1.5px solid var(--brand-accent)'
                          : '1.5px solid var(--app-border-accent)',
                      }}
                    >
                      {selected && <Check size={10} color="var(--brand-accent-on)" strokeWidth={3} />}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: selected ? 700 : 400,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
