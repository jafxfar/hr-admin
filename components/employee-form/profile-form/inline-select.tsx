'use client'

import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { BasicOption } from './types'

const CREATE_OPTION_VALUE = '__create__'

export function InlineSelect({
    value,
    onChange,
    options,
    placeholder,
    onCreate,
    createLabel = 'Создать',
    hasError = false,
}: {
    value?: string
    onChange: (value: string) => void
    options: BasicOption[]
    placeholder?: string
    onCreate?: () => void
    createLabel?: string
    hasError?: boolean
}) {
    const emptyOptionValue = '__empty__'
    const mappedValue = value === '' ? emptyOptionValue : (value ?? '')

    const handleValueChange = (nextValue: string) => {
        if (nextValue === CREATE_OPTION_VALUE) {
            onCreate?.()
            return
        }
        onChange(nextValue === emptyOptionValue ? '' : nextValue)
    }

    return (
        <Select value={mappedValue} onValueChange={handleValueChange}>
            <SelectTrigger
                className={cn(
                    'w-full h-12 rounded-full px-4 bg-app-surface-1 text-app-text-muted border border-solid border-[var(--app-border-accent)] hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 [&_svg]:text-app-text-muted',
                    hasError && 'ring-2 ring-red-500/50',
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
                {onCreate ? (
                    <SelectItem value={CREATE_OPTION_VALUE} className="text-brand-accent font-bold">
                        <span className="inline-flex items-center gap-2">
                            <Plus className="w-3.5 h-3.5" />
                            {createLabel}
                        </span>
                    </SelectItem>
                ) : null}
            </SelectContent>
        </Select>
    )
}
