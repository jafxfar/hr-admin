'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type BasicOption = { value: string; label: string }

export function InlineSelect({
  value,
  onChange,
  options,
  placeholder,
  triggerClassName,
}: {
  value?: string
  onChange: (value: string) => void
  options: BasicOption[]
  placeholder?: string
  triggerClassName?: string
}) {
  const emptyOptionValue = '__empty__'
  const hasEmptyOption = options.some((option) => option.value === '')
  const isEmpty = value === '' || value === undefined
  const mappedValue = isEmpty
    ? hasEmptyOption
      ? emptyOptionValue
      : undefined
    : value

  return (
    <Select
      value={mappedValue}
      onValueChange={(nextValue) => onChange(nextValue === emptyOptionValue ? '' : nextValue)}
    >
      <SelectTrigger
        className={cn(
          'w-full h-12 border border-app-border-accent rounded-full px-4 bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 [&_svg]:text-app-text-muted',
          triggerClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${option.label}`}
            value={option.value === '' ? emptyOptionValue : option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
