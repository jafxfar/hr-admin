'use client'

import type { ChangeEvent } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type HeaderSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  widthClassName?: string
  clearable?: boolean
  ariaLabel?: string
}

export const HeaderSearchInput = ({
  value,
  onChange,
  placeholder = 'Поиск...',
  className,
  inputClassName,
  widthClassName = 'w-64',
  clearable = false,
  ariaLabel,
}: HeaderSearchInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className={cn('group/search relative', widthClassName, className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-app-text-muted/70 transition-colors group-focus-within/search:text-brand-accent"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn(
          'h-10 w-full rounded-full border border-transparent bg-[rgb(var(--theme-primary-rgb)/0.08)] py-2.5 pl-10 text-sm text-app-text',
          'placeholder:text-app-text-muted/60',
          'transition-[background-color,box-shadow,border-color] duration-200',
          'hover:bg-[rgb(var(--theme-primary-rgb)/0.14)]',
          'focus:border-brand-accent/25 focus:bg-app-surface-0 focus:outline-none focus:ring-2 focus:ring-brand-accent/15',
          clearable ? 'pr-9' : 'pr-4',
          inputClassName,
        )}
      />
      {clearable && value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-1 hover:text-app-text"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}
