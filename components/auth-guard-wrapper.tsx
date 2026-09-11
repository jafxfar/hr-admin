'use client'

import { usePathname } from 'next/navigation'
import { AdminGuard } from './admin-guard'

/** Страницы, доступные без проверки роли */
const PUBLIC_PATHS = ['/login', '/unauthorized']

interface AuthGuardWrapperProps {
  children: React.ReactNode
}

/**
 * Оборачивает защищённые страницы в AdminGuard.
 * Публичные страницы (/login, /unauthorized) рендерятся напрямую.
 */
export function AuthGuardWrapper({ children }: AuthGuardWrapperProps) {
  const pathname = usePathname()

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )

  if (isPublic) {
    return <>{children}</>
  }

  return <AdminGuard>{children}</AdminGuard>
}
