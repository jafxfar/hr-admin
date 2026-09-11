import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-(--theme-primary) text-(--on-primary)',
        primary:
          'bg-(--theme-primary) text-(--on-primary)',
        secondary:
          'bg-(--theme-secondary) text-(--on-secondary)',
        soft:
          'bg-[rgb(var(--theme-primary-rgb)/0.12)] text-(--theme-primary)',
        dark:
          'bg-app-surface-contrast text-app-surface-contrast-foreground',
        destructive:
          'bg-red-100 text-red-600',
        success:
          'bg-green-100 text-green-700',
        warning:
          'bg-amber-100 text-amber-700',
        outline:
          'border border-app-border-accent text-app-text bg-app-surface-0',
        muted:
          'bg-[rgb(var(--theme-secondary-rgb)/0.12)] text-app-text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
