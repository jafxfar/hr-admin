'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type HeaderActionButtonVariant = 'primary' | 'ghost' | 'danger-soft'

type HeaderActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  icon?: ReactNode
  variant?: HeaderActionButtonVariant
}

export const HeaderActionButton = ({
  children,
  icon,
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: HeaderActionButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary' &&
        'bg-brand-accent text-brand-accent-on hover:scale-[1.02] active:scale-[0.98]',
      variant === 'ghost' &&
        'border border-app-border bg-app-surface-1 text-app-text-muted hover:bg-app-surface-0 hover:text-app-text',
      variant === 'danger-soft' &&
        'border border-red-500/35 bg-red-500/10 text-red-400 hover:bg-red-500/20',
      className,
    )}
    {...props}
  >
    {icon ?? <PlusCircle className="h-4 w-4" />}
    {children}
  </button>
)
