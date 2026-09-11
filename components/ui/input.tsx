import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-full border border-app-border-accent bg-app-surface-inset px-3 py-1 text-sm font-medium text-app-text placeholder:text-app-text-muted shadow-none transition-all outline-none',
        'focus:border-(--theme-primary) focus:ring-2 focus:ring-[rgb(var(--theme-primary-rgb)/0.3)] focus:bg-app-surface-0',
        'disabled:pointer-events-none disabled:opacity-50',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'aria-invalid:border-red-400 aria-invalid:ring-red-100',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
