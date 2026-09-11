'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { BasicOption } from './helpers'

export function ModalInlineSelect({
    value,
    onChange,
    options,
    placeholder,
    instanceKey,
}: {
    value?: string
    onChange: (value: string) => void
    options: BasicOption[]
    placeholder?: string
    instanceKey?: string
}) {
    const emptyOptionValue = '__empty__'
    const mappedValue = value === '' ? emptyOptionValue : (value ?? '')
    const allowedValues = new Set(
        options.map((o) => (o.value === '' ? emptyOptionValue : o.value)),
    )
    const radixValue = allowedValues.has(mappedValue) ? mappedValue : undefined

    return (
        <Select
            key={instanceKey}
            value={radixValue}
            onValueChange={(nextValue) => onChange(nextValue === emptyOptionValue ? '' : nextValue)}
        >
            <SelectTrigger className="w-full h-12 border border-app-border-accent rounded-full px-4 bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 [&_svg]:text-app-text-muted">
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
