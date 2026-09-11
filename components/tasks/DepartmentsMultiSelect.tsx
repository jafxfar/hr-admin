'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react'
import { useSearchDepartments } from '@/hooks/use-departments'
import {
  getDepartmentHeadId,
  getDepartmentLabel,
} from '@/lib/tasks/assignee-mapping'
import { cn } from '@/lib/utils'
import type { Department } from '@/types/departments'

type DepartmentsMultiSelectProps = {
  value: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
  disabled?: boolean
}

const LIST_PAGE_SIZE = 100

export const DepartmentsMultiSelect = ({
  value,
  onChange,
  placeholder = 'Выберите отделы',
  disabled = false,
}: DepartmentsMultiSelectProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const trimmedSearch = search.trim()
  const { data: catalogData, isFetching: isCatalogFetching } = useSearchDepartments(
    '',
    1,
    LIST_PAGE_SIZE
  )
  const { data: searchData, isFetching: isSearchFetching } = useSearchDepartments(
    trimmedSearch,
    1,
    20
  )

  const catalogDepartments = catalogData?.items ?? []
  const departments =
    open && trimmedSearch.length > 0 ? searchData?.items ?? [] : catalogDepartments
  const isFetching =
    open && trimmedSearch.length > 0 ? isSearchFetching : isCatalogFetching

  const departmentById = useMemo(() => {
    const map = new Map<number, Department>()
    for (const dept of catalogDepartments) map.set(dept.id, dept)
    for (const dept of searchData?.items ?? []) map.set(dept.id, dept)
    return map
  }, [catalogDepartments, searchData?.items])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (dept: Department) => {
    if (getDepartmentHeadId(dept) == null) return
    const id = dept.id
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id])
  }

  const remove = (id: number) => {
    onChange(value.filter((item) => item !== id))
  }

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
          value.map((deptId) => {
            const dept = departmentById.get(deptId)
            const label = dept ? getDepartmentLabel(dept) : `Отдел #${deptId}`
            return (
              <span
                key={deptId}
                className="inline-flex items-center gap-1 rounded-full bg-brand-accent/15 px-2.5 py-1 text-xs font-semibold text-brand-accent"
              >
                {label}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Убрать ${label}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    remove(deptId)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      event.stopPropagation()
                      remove(deptId)
                    }
                  }}
                  className="rounded-full p-0.5 hover:bg-brand-accent/20"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            )
          })
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
              placeholder="Поиск отдела..."
              className="w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
              aria-label="Поиск отдела"
            />
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin text-app-text-muted" /> : null}
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {departments.length === 0 ? (
              <li className="px-4 py-3 text-sm text-app-text-muted">Отделы не найдены</li>
            ) : (
              departments.map((dept) => {
                const selected = value.includes(dept.id)
                const headId = getDepartmentHeadId(dept)
                const isDisabled = headId == null

                return (
                  <li key={dept.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-disabled={isDisabled}
                      disabled={isDisabled}
                      onClick={() => toggle(dept)}
                      className={cn(
                        'flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left text-sm',
                        isDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-app-surface-1'
                      )}
                    >
                      <span className="flex w-full items-center gap-3">
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
                        <span className="min-w-0 truncate text-app-text">
                          {getDepartmentLabel(dept)}
                        </span>
                      </span>
                      {isDisabled ? (
                        <span className="pl-8 text-xs text-app-text-muted">Нет руководителя</span>
                      ) : null}
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
