'use client'

import { isForbiddenError } from '@/lib/query-error'

type AttendanceDataStatesProps = {
  isLoading: boolean
  isError: boolean
  error: unknown
  loadingLabel?: string
  errorLabel?: string
  children: React.ReactNode
}

export const AttendanceDataStates = ({
  isLoading,
  isError,
  error,
  loadingLabel = 'Загрузка данных…',
  errorLabel = 'Ошибка загрузки. Проверьте соединение с сервером.',
  children,
}: AttendanceDataStatesProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 rounded-2xl bg-app-surface-0 text-app-text-muted text-sm border border-app-border">
        {loadingLabel}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 rounded-2xl bg-app-surface-0 text-(--error) text-sm border border-app-border">
        {isForbiddenError(error) ? 'Нет доступа' : errorLabel}
      </div>
    )
  }

  return <>{children}</>
}
