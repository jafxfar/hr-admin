'use client'

import { cn } from '@/lib/utils'
import { ArrowRight, LogIn, User } from 'lucide-react'
import { LoginPasswordField } from './login-password-field'

const loginInputClass = cn(
  'w-full rounded-full border border-white/15 bg-app-surface-inset py-4 text-sm text-app-text',
  'placeholder:text-app-text-muted transition-all',
  'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-primary-rgb)/0.35)] focus:border-white/30',
)

type LoginCredentialsFormProps = {
  showPassword: boolean
  loginValue: string
  password: string
  error: string | null
  isPending: boolean
  onLoginChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const LoginCredentialsForm = ({
  showPassword,
  loginValue,
  password,
  error,
  isPending,
  onLoginChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginCredentialsFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <label htmlFor="login" className="sr-only">
        Логин администратора
      </label>
      <div className="relative group">
        <User
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted transition-colors group-focus-within:text-app-text"
        />
        <input
          id="login"
          type="text"
          autoComplete="username"
          required
          value={loginValue}
          onChange={(e) => onLoginChange(e.target.value)}
          placeholder="Email или номер телефона"
          className={cn(loginInputClass, 'pl-12 pr-4')}
        />
      </div>
    </div>
    <LoginPasswordField
      showPassword={showPassword}
      password={password}
      onPasswordChange={onPasswordChange}
      onTogglePassword={onTogglePassword}
    />
    <div className="flex items-center justify-between gap-3 px-1">
      <label className="flex cursor-pointer select-none items-center gap-3 group">
        <input
          type="checkbox"
          className="size-5 cursor-pointer rounded"
          style={{ accentColor: 'var(--theme-primary)' }}
        />
        <span className="text-sm font-medium text-app-text-muted transition-colors group-hover:text-app-text">
          Доверять этому устройству
        </span>
      </label>
      <a
        href="#"
        className="shrink-0 text-sm font-semibold text-app-text underline-offset-4 transition-all hover:underline"
      >
        Сбросить доступ?
      </a>
    </div>
    {error ? (
      <p
        role="alert"
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          color: 'var(--on-error-container)',
          backgroundColor: 'var(--error-container)',
        }}
      >
        {error}
      </p>
    ) : null}
    <button
      type="submit"
      disabled={isPending}
      className={cn(
        'flex w-full items-center justify-center gap-3 py-4 font-bold transition-all duration-300',
        'rounded-full text-app-text-on-accent',
        'hover:scale-[0.98] hover:shadow-[0_0_40px_rgb(var(--theme-primary-rgb)/0.25)]',
        'disabled:cursor-not-allowed disabled:opacity-60',
      )}
      style={{
        background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
      }}
    >
      <LogIn size={18} />
      <span>{isPending ? 'Вход…' : 'Войти'}</span>
      {!isPending ? (
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      ) : null}
    </button>
  </form>
)
