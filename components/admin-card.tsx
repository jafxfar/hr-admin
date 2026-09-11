'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AdminCardVariant = 'solid' | 'glass'

type AdminCardProps = {
  variant?: AdminCardVariant
  contrast?: boolean
  asPanel?: boolean
  className?: string
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const AdminCard = ({
  variant = 'solid',
  contrast = false,
  asPanel = false,
  className,
  children,
  ...rest
}: AdminCardProps) => (
  <div
    {...rest}
    className={cn(
      'relative overflow-hidden rounded-3xl p-6 md:p-8',
      contrast
        ? 'card-contrast'
        : variant === 'glass'
          ? asPanel
            ? 'app-panel-glass'
            : 'app-card-glass'
          : 'app-card-solid',
      className,
    )}
  >
    {children}
  </div>
)
