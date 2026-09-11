'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePutMyUiSettingsMutation } from '@/hooks/use-system-settings'
import { mutationOpts } from '@/lib/mutation-options'

const hasToken = () => typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'))

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const putUiSettingsMutation = usePutMyUiSettingsMutation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)

    if (!hasToken()) return

    putUiSettingsMutation.mutate(
      { theme: nextTheme },
      mutationOpts({ meta: { skipSuccessToast: true } }),
    )
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-full bg-app-surface-1 text-app-text-muted"
        disabled
        aria-label="Переключатель темы"
      >
        <Sun className="size-4" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className="flex size-9 items-center justify-center rounded-full bg-app-surface-1 text-app-text-muted transition-colors hover:text-brand-accent"
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
