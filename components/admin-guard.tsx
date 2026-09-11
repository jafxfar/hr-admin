'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMe } from '@/hooks/use-employees'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { isPathAllowedByFeatures } from '@/lib/feature-access'
import { isNetworkError, isUnauthorizedError } from '@/lib/query-error'
import { SessionTimeoutProvider } from '@/components/session-timeout-provider'

const SUPERADMIN_ONLY_PREFIXES: string[] = []

const isSuperadminOnlyPath = (pathname: string) =>
  SUPERADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const pathname = usePathname()

  // null = ещё не проверили (SSR / первый рендер)
  // true/false = результат проверки localStorage на клиенте
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem('accessToken')))
  }, [])

  // Запрос к /employees/employee/me только если токен точно есть
  const { data: me, isLoading, isError, error, refetch } = useMe(hasToken === true)
  const {
    data: settingsFeatures,
    isLoading: isFeaturesLoading,
    isError: isFeaturesError,
  } = useSettingsFeatures(hasToken === true)

  useEffect(() => {
    if (hasToken === null) return // ещё ждём hydration

    if (!hasToken) {
      router.replace('/login')
      return
    }

    if (isError && isUnauthorizedError(error)) {
      router.replace('/login')
      return
    }

    if (!isLoading && me) {
      const role = getSystemRoleName(me)?.toLowerCase() ?? ''
      const canAccessAdminUi = role === 'superadmin' || me.can_access_admin_ui === true
      if (!canAccessAdminUi && pathname !== '/dashboard') {
        router.replace('/dashboard')
        return
      }
      if (isSuperadminOnlyPath(pathname) && role !== 'superadmin') {
        router.replace('/dashboard')
        return
      }
    }

    if (!isFeaturesLoading && !isFeaturesError) {
      const isAllowedPath = isPathAllowedByFeatures(pathname, settingsFeatures?.features)
      if (!isAllowedPath) {
        router.replace('/dashboard')
      }
    }
  }, [
    hasToken,
    isLoading,
    isError,
    error,
    me,
    isFeaturesLoading,
    isFeaturesError,
    settingsFeatures?.features,
    pathname,
    router,
  ])

  // Пока идёт загрузка или hydration — показываем спиннер
  if (hasToken === null || isLoading || isFeaturesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="w-8 h-8 border-2 border-(--theme-primary) border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError && isNetworkError(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-lg font-semibold text-app-text">Сервер недоступен</p>
          <p className="text-sm text-app-text-muted">
            Не удалось подключиться к API. Проверьте, что backend запущен, и попробуйте снова.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-accent-on transition-opacity hover:opacity-90"
            aria-label="Повторить подключение к серверу"
          >
            Повторить
          </button>
        </div>
      </div>
    )
  }

  const roleLower = getSystemRoleName(me)?.toLowerCase() ?? ''
  const canAccessAdminUi = roleLower === 'superadmin' || me?.can_access_admin_ui === true
  const isSuperadminPathOk = !isSuperadminOnlyPath(pathname) || roleLower === 'superadmin'
  const isAllowedPath = isPathAllowedByFeatures(pathname, settingsFeatures?.features)

  // Нет токена, ошибка авторизации, нет доступа в админ UI, superadmin-only путь, feature flags
  if (
    !hasToken ||
    (isError && isUnauthorizedError(error)) ||
    (!canAccessAdminUi && pathname !== '/dashboard') ||
    !isSuperadminPathOk ||
    (!isFeaturesError && !isAllowedPath)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="w-8 h-8 border-2 border-(--theme-primary) border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <SessionTimeoutProvider>
      {children}
    </SessionTimeoutProvider>
  )
}
