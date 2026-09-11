import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DashboardPageShellProps {
  children: ReactNode
  className?: string
}

/** Внутренний контейнер страниц раздела «Статистика»: отступы и вертикальный ритм. */
export function DashboardPageShell({ children, className }: DashboardPageShellProps) {
  return <div className={cn('space-y-6 p-4', className)}>{children}</div>
}
