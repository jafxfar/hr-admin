import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DashboardSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** Карточка-контейнер секции дашборда: заголовок в стиле SectionHeader + контент. */
export function DashboardSection({ title, description, children, className }: DashboardSectionProps) {
  return (
    <section
      className={cn(
        'app-card-solid rounded-2xl p-4 md:p-6',
        className,
      )}
    >
      <h2
        className={cn(
          'text-xl font-bold text-app-text',
          description ? 'mb-1' : 'mb-4',
        )}
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mb-6 text-sm leading-relaxed text-app-text-muted">{description}</p>
      ) : null}
      {children}
    </section>
  )
}
