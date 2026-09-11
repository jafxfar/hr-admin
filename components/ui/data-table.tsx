'use client'

import React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type DataTableVariant = 'glass' | 'solid'

interface DataTableProps {
  children: React.ReactNode
  className?: string
  toolbar?: React.ReactNode
  variant?: DataTableVariant
}

export function DataTable({ children, className, toolbar, variant = 'glass' }: DataTableProps) {
  return (
    <div className={cn(className)}>
      {toolbar ? (
        <div className="mb-4 flex flex-wrap items-center gap-2.5">{toolbar}</div>
      ) : null}
      <div
        className={cn(
          'admin-scrollbar overflow-x-auto rounded-2xl border',
          variant === 'glass'
            ? 'border-app-border-accent app-chrome-glass'
            : 'app-card-solid border-app-border',
        )}
      >
        <table className="w-full border-collapse text-left">
          {children}
        </table>
      </div>
    </div>
  )
}

interface DataTableHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DataTableHeader({ children, className }: DataTableHeaderProps) {
  return (
    <thead className={cn(className)}>
      {children}
    </thead>
  )
}

interface DataTableBodyProps {
  children: React.ReactNode
  className?: string
}

export function DataTableBody({ children, className }: DataTableBodyProps) {
  return (
    <tbody className={cn(className)}>
      {children}
    </tbody>
  )
}

interface DataTableHeaderRowProps {
  children: React.ReactNode
  className?: string
}

export function DataTableHeaderRow({ children, className }: DataTableHeaderRowProps) {
  return (
    <tr className={cn(className)}>
      {children}
    </tr>
  )
}

interface DataTableHeadProps {
  children?: React.ReactNode
  className?: string
  sortable?: boolean
}

export function DataTableHead({ children, className, sortable = false }: DataTableHeadProps) {
  return (
    <th
      className={cn(
        'border-b border-dashed border-app-border px-4 py-3 text-left text-sm font-semibold text-app-text first:pl-5 last:pr-5',
        className,
      )}
    >
      {children == null ? null : (
        <span className="inline-flex items-center gap-1.5">
          {children}
          {sortable ? (
            <ChevronsUpDown
              className="h-3.5 w-3.5 shrink-0 text-app-text-muted/50"
              aria-hidden
            />
          ) : null}
        </span>
      )}
    </th>
  )
}

interface DataTableBodyRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  active?: boolean
}

export function DataTableBodyRow({ children, className, onClick, active = false }: DataTableBodyRowProps) {
  return (
    <tr
      className={cn(
        'group transition-colors',
        '[&>td]:bg-transparent [&>td]:transition-colors',
        'hover:[&>td]:bg-black/4 dark:hover:[&>td]:bg-white/6',
        active && '[&>td]:bg-black/4 dark:[&>td]:bg-white/6',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface DataTableCellProps {
  children?: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void
  colSpan?: number
}

export function DataTableCell({ children, className, onClick, colSpan }: DataTableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-4 align-middle text-sm text-app-text first:pl-5 last:pr-5',
        className,
      )}
      onClick={onClick}
      colSpan={colSpan}
    >
      {children}
    </td>
  )
}

interface DataTableStatusProps {
  children: React.ReactNode
  className?: string
  dotClassName?: string
}

export function DataTableStatus({ children, className, dotClassName }: DataTableStatusProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium',
        className,
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full bg-current', dotClassName)}
        aria-hidden
      />
      {children}
    </span>
  )
}

export { DataTableBodyRow as DataTableRow }
