'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { filterCityOptions, findCityOptionByQuery } from '@/lib/tajikistan-cities'
import type { BasicOption } from './types'

export function CitySelect({
    value,
    onChange,
    placeholder = 'Выберите город',
    options,
    disabled = false,
    hasError = false,
}: {
    value?: string
    onChange: (next: string) => void
    placeholder?: string
    options: BasicOption[]
    disabled?: boolean
    hasError?: boolean
}) {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)
    const safeValue = value ?? ''

    const filteredOptions = useMemo(
        () => filterCityOptions(options, searchQuery),
        [options, searchQuery],
    )

    const selectedLabel = options.find((opt) => opt.value === safeValue)?.label
    const triggerText = safeValue ? (selectedLabel ?? safeValue) : ''

    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50)
            return
        }
        setSearchQuery('')
    }, [open])

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen && searchQuery.trim()) {
            const exactMatch = findCityOptionByQuery(options, searchQuery)
            if (exactMatch) {
                onChange(exactMatch.value)
            } else if (filteredOptions.length === 1) {
                onChange(filteredOptions[0].value)
            } else {
                onChange(searchQuery.trim())
            }
        }

        setOpen(nextOpen)
    }

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return
        event.preventDefault()

        if (filteredOptions.length === 1) {
            onChange(filteredOptions[0].value)
            setOpen(false)
            return
        }

        const trimmed = searchQuery.trim()
        if (!trimmed) return

        const exactMatch = findCityOptionByQuery(options, trimmed)
        onChange(exactMatch?.value ?? trimmed)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={[
                        'w-full h-12 rounded-full px-4 bg-app-surface-1 text-app-text-muted border border-solid border-[var(--app-border-accent)] hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 flex items-center justify-between disabled:cursor-not-allowed disabled:opacity-50',
                        hasError ? 'ring-2 ring-red-500/55 bg-red-500/5' : '',
                    ].join(' ')}
                    aria-label="Выбор города"
                >
                    <span className={triggerText ? 'text-app-text' : 'text-app-text-muted'}>{triggerText || placeholder}</span>
                    <ChevronDown size={16} className="text-app-text-muted" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[360px] p-3 bg-white border border-app-border">
                <div className="space-y-3">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted mb-2">
                            Поиск города
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-app-surface-0 px-4 h-12">
                            <Search size={16} className="shrink-0 text-app-text-muted" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Например: Бохтар"
                                className="flex-1 bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
                                aria-label="Поиск города"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted mb-2">
                            Выберите из списка
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {filteredOptions.length === 0 ? (
                                <p className="px-3 py-4 text-center text-sm text-app-text-muted">Ничего не найдено</p>
                            ) : (
                                filteredOptions.map((opt) => {
                                    const isSelected = opt.value === safeValue
                                    return (
                                        <button
                                            key={`${opt.value}-${opt.label}`}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value)
                                                setOpen(false)
                                            }}
                                            className={[
                                                'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors',
                                                isSelected
                                                    ? 'bg-app-surface-4 text-app-text'
                                                    : 'bg-transparent hover:bg-app-surface-2 text-app-text',
                                            ].join(' ')}
                                            aria-label={`Выбрать город ${opt.label}`}
                                        >
                                            <span className="text-sm">{opt.label}</span>
                                            {isSelected ? <Check size={16} className="text-brand-accent" /> : null}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
