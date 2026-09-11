'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const PLATFORM_NAME = 'Artemis HR'

type BrandLogoProps = {
  href?: string
  className?: string
  nameClassName?: string
  inverted?: boolean
  showName?: boolean
}

const LogoMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M22.605 9.042a49.176 49.176 0 0 1-1.865 4.54c2.881 1.616 6.265 1.802 8.527 1.183-3.428 1.852-6.065 1.852-15.557.529l.02-.014c-1.01-.132-2.09-.273-3.254-.42-6.328-1.057-13.71 4.233-8.964 10.582h16.157c4.69 0 9.025-2.499 11.388-6.562l7.258-12.483c-3.164-3.704-11.6-3.704-13.71 2.645Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M39.785 33.127a49.075 49.075 0 0 1-2.987-3.89c-2.836 1.694-4.688 4.541-5.284 6.816.115-3.904 1.433-6.195 7.32-13.78l.003.023c.619-.81 1.281-1.678 1.989-2.617 4.077-4.968 3.202-14.028-4.651-13.079l-8.08 14.039a13.263 13.263 0 0 0-.029 13.174l7.147 12.548c4.779-.897 8.997-8.228 4.572-13.234Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.57 35.979c1.8-.325 3.405-.537 4.85-.65-.044-3.311-1.576-6.344-3.24-8 3.311 2.053 4.63 4.343 8.234 13.252l-.021-.01c.39.942.808 1.952 1.264 3.036 2.25 6.027 10.509 9.796 13.616 2.498l-8.079-14.038a13.176 13.176 0 0 0-11.358-6.613L1.431 25.39c-1.615 4.6 2.604 11.93 9.139 10.589Z"
      clipRule="evenodd"
    />
  </svg>
)

export const BrandLogo = ({
  href,
  className,
  nameClassName,
  inverted = false,
  showName = true,
}: BrandLogoProps) => {
  const accentClass = inverted ? 'text-white' : 'text-brand-accent'
  const tileClass = inverted ? 'bg-white/10' : 'bg-brand-accent/10'

  const content = (
    <>
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          tileClass,
          accentClass,
        )}
      >
        <LogoMark className="h-7 w-7 ml-[4px]" />
      </div>
      {showName ? (
        <span
          className={cn(
            'text-xl font-bold leading-none tracking-tight',
            accentClass,
            nameClassName,
          )}
        >
          {PLATFORM_NAME}
        </span>
      ) : null}
    </>
  )

  if (!href) {
    return (
      <div className={cn('inline-flex items-center gap-3', className)}>{content}</div>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-3 transition-opacity hover:opacity-90',
        className,
      )}
      aria-label={PLATFORM_NAME}
    >
      {content}
    </Link>
  )
}
