'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RESUME_MULTI_TRIGGER_CLASS } from './field-styles'

type SearchableMultiSelectProps = {
  value: string[]
  onChange: (next: string[]) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
}

export const SearchableMultiSelect = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите',
  disabled,
  ariaLabel,
}: SearchableMultiSelectProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(search.trim().toLowerCase())
  )

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
      return
    }
    onChange([...value, option])
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(RESUME_MULTI_TRIGGER_CLASS)}
      >
        <span className={cn('truncate', value.length === 0 && 'text-app-text-muted')}>
          {value.length > 0 ? value.join(', ') : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-app-text-muted" />
      </button>

      {open ? (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-3xl border border-app-border-accent bg-app-surface-0 shadow-lg">
          <div className="flex items-center gap-2 border-b border-app-border-accent px-3 py-2">
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск"
              className="w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
              aria-label="Поиск по списку"
            />
            <Search className="h-4 w-4 text-app-text-muted" />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox" aria-multiselectable>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-app-text-muted">Ничего не найдено</li>
            ) : (
              filtered.map((option) => {
                const selected = value.includes(option)
                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleToggle(option)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-app-text hover:bg-app-surface-2',
                        selected && 'bg-app-surface-1'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border border-app-border-accent',
                          selected && 'border-brand-accent bg-brand-accent text-brand-accent-on-alt'
                        )}
                      >
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      {option}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
