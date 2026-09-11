'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export type SegmentedSwitchOption<T extends string = string> = {
  value: T
  label: string
}

export type SegmentedSwitchProps<T extends string = string> = {
  value: T
  onValueChange: (value: T) => void
  options: SegmentedSwitchOption<T>[]
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
  size?: 'default' | 'sm'
}

function SegmentedSwitch<T extends string = string>({
  value,
  onValueChange,
  options,
  disabled = false,
  id,
  'aria-label': ariaLabel,
  className,
  size = 'default',
}: SegmentedSwitchProps<T>) {
  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex rounded-full border border-app-border-accent bg-app-surface-inset p-1',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'rounded-full font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--theme-primary-rgb)/0.3)] focus-visible:ring-offset-1',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
              isActive
                ? 'bg-(--theme-primary) text-white shadow-[0_8px_24px_rgb(var(--theme-primary-rgb)/0.3)]'
                : 'text-app-text-muted hover:bg-app-surface-1 hover:text-app-text',
              disabled && 'cursor-not-allowed',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export { SegmentedSwitch }
