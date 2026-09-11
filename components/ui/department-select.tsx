'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2, Plus, Search } from 'lucide-react'
import { useDepartment, useSearchDepartments } from '@/hooks/use-departments'
import { cn } from '@/lib/utils'

const idsMatch = (a: unknown, b: unknown) => Number(a) === Number(b)

interface DepartmentSelectProps {
    value: number | null | undefined
    onChange: (id: number, name: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    onCreate?: () => void
    createLabel?: string
    hasError?: boolean
    initialLabel?: string
}

export function DepartmentSelect({
    value,
    onChange,
    placeholder = 'Выберите отдел',
    className,
    disabled,
    onCreate,
    createLabel = 'Создать отдел',
    hasError = false,
    initialLabel,
}: DepartmentSelectProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedLabel, setSelectedLabel] = useState<string>(initialLabel ?? '')
    const containerRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const numericValue = value != null && Number(value) > 0 ? Number(value) : 0
    const { data, isFetching } = useSearchDepartments(search)
    const departments = data?.items ?? []
    const foundInList = departments.find((d) => idsMatch(d.id, numericValue))
    const foundName = foundInList?.name
    const { data: selectedDepartment } = useDepartment(foundInList ? 0 : numericValue)

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])

    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50)
        } else {
            setSearch('')
        }
    }, [open])

    useEffect(() => {
        if (!numericValue) {
            setSelectedLabel('')
            return
        }
        if (foundName) {
            setSelectedLabel(foundName)
            return
        }
        const fetchedName = selectedDepartment?.name || selectedDepartment?.department_name
        if (fetchedName) {
            setSelectedLabel(fetchedName)
            return
        }
        if (initialLabel) {
            setSelectedLabel(initialLabel)
        }
    }, [foundName, numericValue, selectedDepartment, initialLabel])

    const handleSelect = (id: number, name: string) => {
        onChange(id, name)
        setSelectedLabel(name)
        setOpen(false)
    }

    const handleCreate = () => {
        setOpen(false)
        onCreate?.()
    }

    const displayLabel = numericValue && selectedLabel ? selectedLabel : ''
    const listHasSelected = departments.some((d) => idsMatch(d.id, numericValue))
    const dropdownDepartments =
        numericValue && displayLabel && !listHasSelected
            ? [{ id: numericValue, name: displayLabel }, ...departments]
            : departments

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                aria-label={placeholder}
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-full px-4 text-sm transition-all duration-200',
                    'focus:outline-none focus:ring-1 focus:ring-brand-accent/30',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    hasError && 'ring-2 ring-red-500/50',
                    displayLabel
                        ? 'border border-transparent bg-brand-accent text-brand-accent-on font-bold shadow-[0_0_15px_rgb(var(--theme-primary-rgb) / 0.2)] [&_svg]:text-brand-accent-on'
                        : 'border border-solid border-[var(--app-border-accent)] bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 [&_svg]:text-app-text-muted',
                )}
            >
                <span className="truncate">{displayLabel || placeholder}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
            </button>

            {open && (
                <div className="absolute z-100 mt-2 w-full rounded-2xl border border-app-border bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center border-b border-app-border px-3 py-2 gap-2">
                        <Search className="h-4 w-4 shrink-0 text-app-text-muted" />
                        <input
                            ref={searchRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск отдела..."
                            className="flex-1 bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
                        />
                        {isFetching && (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-app-text-muted" />
                        )}
                    </div>

                    <div className="max-h-40 overflow-y-auto p-1">
                        {dropdownDepartments.length === 0 && !isFetching && (
                            <p className="px-3 py-4 text-center text-sm text-app-text-muted">
                                Ничего не найдено
                            </p>
                        )}
                        {dropdownDepartments.map((dept) => (
                            <button
                                key={dept.id}
                                type="button"
                                onClick={() => handleSelect(dept.id, dept.name)}
                                className={cn(
                                    'flex w-full items-center gap-2 px-3 py-2 text-sm text-app-text-muted rounded-2xl text-left transition-colors',
                                    'hover:bg-app-border hover:text-app-text',
                                    idsMatch(numericValue, dept.id) && 'text-brand-accent font-bold bg-app-border',
                                )}
                            >
                                <Check
                                    className={cn(
                                        'h-4 w-4 shrink-0 text-brand-accent',
                                        idsMatch(numericValue, dept.id) ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                <span>{dept.name}</span>
                            </button>
                        ))}
                    </div>

                    {onCreate ? (
                        <div className="border-t border-app-border p-1">
                            <button
                                type="button"
                                onClick={handleCreate}
                                aria-label={createLabel}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-bold text-brand-accent rounded-2xl text-left transition-colors hover:bg-app-border"
                            >
                                <Plus className="h-4 w-4 shrink-0" />
                                <span>{createLabel}</span>
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
