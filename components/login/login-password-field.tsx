'use client'

import { cn } from '@/lib/utils'
import { Eye, EyeOff, Lock } from 'lucide-react'

const loginInputClass = cn(
  'w-full rounded-full border border-white/15 bg-app-surface-inset py-4 text-sm text-app-text',
  'placeholder:text-app-text-muted transition-all',
  'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-primary-rgb)/0.35)] focus:border-white/30',
)

type LoginPasswordFieldProps = {
  showPassword: boolean
  password: string
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
}

export const LoginPasswordField = ({
  showPassword,
  password,
  onPasswordChange,
  onTogglePassword,
}: LoginPasswordFieldProps) => (
  <div className="space-y-2">
    <label htmlFor="password" className="sr-only">
      Пароль
    </label>
    <div className="relative group">
      <Lock
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted transition-colors group-focus-within:text-app-text"
      />
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Пароль"
        className={cn(loginInputClass, 'pl-12 pr-12')}
      />
      <button
        type="button"
        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        onClick={onTogglePassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted transition-colors hover:text-app-text"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
)
