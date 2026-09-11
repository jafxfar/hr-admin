'use client'

import { cn } from '@/lib/utils'
import { manrope } from '@/lib/fonts'
import { AdminShellBackground } from '@/components/admin-shell-background'
import { LoginHeader } from './login-header'

type LoginSplitLayoutProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export const LoginSplitLayout = ({
  title = 'Вход',
  subtitle = 'Защищённый вход для управления платформой Artemis HR.',
  children,
}: LoginSplitLayoutProps) => (
  <div className={cn('relative min-h-screen', manrope.className)}>
    <AdminShellBackground />
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section
        className="app-card-glass w-full max-w-md space-y-8 p-6 sm:p-8"
        aria-label="Вход в портал администратора"
      >
        <LoginHeader />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-app-text">{title}</h1>
          {subtitle ? (
            <p className="text-sm leading-relaxed text-app-text-muted">{subtitle}</p>
          ) : null}
        </div>
        {children}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--divider-subtle)] pt-5 text-xs text-app-text-muted">
          <span>© Artemis HR</span>
          <button
            type="button"
            className="transition-colors hover:text-app-text"
            aria-label="Связаться с поддержкой"
          >
            Связаться
          </button>
        </footer>
      </section>
    </div>
  </div>
)
