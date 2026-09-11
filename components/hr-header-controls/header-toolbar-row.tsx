'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HeaderToolbarRowProps = {
  children: ReactNode
  className?: string
}

export const HeaderToolbarRow = ({ children, className }: HeaderToolbarRowProps) => (
  <div className={cn('flex w-full flex-wrap items-center gap-3', className)}>
    {children}
  </div>
)
