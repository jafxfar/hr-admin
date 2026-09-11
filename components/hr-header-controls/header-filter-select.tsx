'use client'

import type { ReactNode } from 'react'
import { SelectTrigger } from '@/components/ui/select'
import { cn } from '@/lib/utils'

type HeaderFilterSelectProps = {
  children: ReactNode
  active?: boolean
  className?: string
}

export const HeaderFilterSelect = ({
  children,
  active = false,
  className,
}: HeaderFilterSelectProps) => (
  <SelectTrigger
    className={cn(
      'h-10 rounded-full border px-4 text-sm transition-all duration-200',
      'focus:ring-1 focus:ring-brand-accent/30',
      active
        ? 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent font-medium [&_svg]:text-brand-accent'
        : 'border-transparent bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.14)] hover:text-app-text [&_svg]:text-app-text-muted',
      className,
    )}
  >
    {children}
  </SelectTrigger>
)
