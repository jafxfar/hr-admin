'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react'
import { useEmployees, useEmployeesSearch } from '@/hooks/use-employees'
import { employeeSelectLabel } from '@/components/departments/department-assign-utils'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types/employees'

interface EmployeesMultiSelectProps {
  value: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
  disabled?: boolean
}

export const EmployeesMultiSelect = ({
  value,
  onChange,
  placeholder = 'Выберите исполнителей',
  disabled = false,
}: EmployeesMultiSelectProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const trimmedSearch = search.trim()
  const { data: searchData, isFetching: isSearchFetching } = useEmployeesSearch(
    { q: trimmedSearch, page: 1, page_size: 20 },
    open && trimmedSearch.length > 0
  )
  const { data: listData, isFetching: isListFetching } = useEmployees(1, 20)
  const employees = (open && trimmedSearch.length > 0 ? searchData : listData)?.items ?? []
  const isFetching = open && trimmedSearch.length > 0 ? isSearchFetching : isListFetching

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const remove = (id: number) => {
    onChange(value.filter((v) => v !== id))
  }

  const selectedEmployees = employees.filter((emp) => value.includes(emp.id))

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex min-h-[52px] w-full flex-wrap items-center gap-2 rounded-3xl bg-app-surface-1 px-4 py-2.5 text-left text-sm text-app-text transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 disabled:opacity-50',
          open && 'ring-2 ring-brand-accent/30'
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {value.length === 0 ? (
          <span className="text-app-text-muted">{placeholder}</span>
        ) : (
          selectedEmployees.map((emp) => (
            <span
              key={emp.id}
              className="inline-flex items-center gap-1 rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs font-semibold text-brand-accent"
            >
              {employeeSelectLabel(emp).split(' (')[0]}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Убрать ${employeeSelectLabel(emp)}`}
                onClick={(event) => {
                  event.stopPropagation()
                  remove(emp.id)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    event.stopPropagation()
                    remove(emp.id)
                  }
                }}
                className="rounded-full p-0.5 hover:bg-brand-accent/20"
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))
        )}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-app-text-muted" aria-hidden />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-app-border-accent bg-app-surface-0 shadow-xl">
          <div className="flex items-center gap-2 border-b border-app-border-accent px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-app-text-muted" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск сотрудника..."
              className="w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
              aria-label="Поиск сотрудника"
            />
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin text-app-text-muted" /> : null}
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {employees.length === 0 ? (
              <li className="px-4 py-3 text-sm text-app-text-muted">Сотрудники не найдены</li>
            ) : (
              employees.map((emp: Employee) => {
                const selected = value.includes(emp.id)
                return (
                  <li key={emp.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => toggle(emp.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-app-surface-1"
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                          selected
                            ? 'border-brand-accent bg-brand-accent text-brand-accent-on-alt'
                            : 'border-app-border-accent'
                        )}
                      >
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="min-w-0 truncate text-app-text">{employeeSelectLabel(emp)}</span>
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
