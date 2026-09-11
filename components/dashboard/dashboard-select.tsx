'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type DashboardSelectOption = { value: string; label: string }

export interface DashboardSelectProps {
  value?: string
  onChange: (value: string) => void
  options: DashboardSelectOption[]
  placeholder?: string
}

export const DashboardSelect = ({ value, onChange, options, placeholder }: DashboardSelectProps) => {
  const emptyOptionValue = '__empty__'
  const mappedValue = value === '' ? emptyOptionValue : (value ?? '')

  return (
    <Select
      value={mappedValue}
      onValueChange={(nextValue) => onChange(nextValue === emptyOptionValue ? '' : nextValue)}
    >
      <SelectTrigger className="w-full h-10 border border-app-border-accent rounded-full px-4 bg-app-surface-0 text-app-text-muted hover:text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] transition-all duration-200 focus:ring-1 focus:ring-[rgb(var(--theme-primary-rgb)/0.3)] [&_svg]:text-app-text-muted">
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
