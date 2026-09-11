import type { ReactNode } from 'react'

export interface DashboardToolbarFieldProps {
  label: string
  children: ReactNode
  className?: string
}

/** Подпись + контрол в тулбаре дашборда (единые отступы с HRHeader toolbar). */
export function DashboardToolbarField({ label, children, className }: DashboardToolbarFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-app-text-muted">{label}</label>
      {children}
    </div>
  )
}
