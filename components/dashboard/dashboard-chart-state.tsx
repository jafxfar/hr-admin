import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const box = 'flex items-center justify-center rounded-xl border border-dashed border-app-border-accent text-sm'

export function DashboardChartLoading({ className }: { className?: string }) {
  return (
    <div className={cn(box, 'h-[360px] gap-2 text-app-text-muted', className)}>
      <Loader2 className="h-6 w-6 shrink-0 animate-spin" aria-hidden />
      <span>Загрузка…</span>
    </div>
  )
}

export function DashboardChartError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn(box, 'min-h-[200px] px-4 text-center text-red-400', className)} role="alert">
      {message}
    </div>
  )
}

export function DashboardChartEmpty({ message = 'Нет данных за выбранный период', className }: { message?: string; className?: string }) {
  return (
    <div className={cn(box, 'min-h-[200px] px-4 text-app-text-muted', className)}>{message}</div>
  )
}
