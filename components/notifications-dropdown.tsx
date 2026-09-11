'use client'

import { useRouter } from 'next/navigation'
import { CheckCheck } from 'lucide-react'
import {
  useMarkNotificationReadMutation,
  useMarkNotificationsReadAllMutation,
  useNotifications,
} from '@/hooks/use-notifications'
import type { NotificationListItem } from '@/types/notifications'

interface NotificationsDropdownProps {
  onClose?: () => void
}

const formatNotificationDate = (value: string | null) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getSafeInternalDeeplink = (deeplink: string | null) => {
  if (!deeplink) return null
  if (!deeplink.startsWith('/') || deeplink.startsWith('//')) return null
  return deeplink
}

const NotificationItem = ({
  notification,
  onOpen,
}: {
  notification: NotificationListItem
  onOpen: (notification: NotificationListItem) => void
}) => {
  const date = formatNotificationDate(notification.created_at)
  const hasDeeplink = Boolean(getSafeInternalDeeplink(notification.deeplink))

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-app-surface-2 focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
      aria-label={`Открыть уведомление: ${notification.title}`}
    >
      <span className="flex w-3 shrink-0 justify-center pt-2">
        {!notification.is_read && <span className="h-2 w-2 rounded-full bg-brand-accent" />}
      </span>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-surface-2 text-sm font-bold text-brand-accent">
        {notification.title.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 text-sm font-semibold text-app-text">
            {notification.title}
          </p>
          {date && (
            <span className="shrink-0 whitespace-nowrap text-xs font-medium text-app-text-muted">
              {date}
            </span>
          )}
        </div>
        {notification.body && (
          <p className="mt-1 line-clamp-2 text-sm text-app-text-muted">
            {notification.body}
          </p>
        )}
        {hasDeeplink && (
          <span className="mt-2 inline-flex text-xs font-semibold text-brand-accent">
            Открыть
          </span>
        )}
      </div>
    </button>
  )
}

export function NotificationsDropdown({ onClose }: NotificationsDropdownProps) {
  const router = useRouter()
  const { data, isError, isLoading } = useNotifications({ page: 1, pageSize: 10 })
  const markReadMutation = useMarkNotificationReadMutation()
  const markReadAllMutation = useMarkNotificationsReadAllMutation()

  const notifications = data?.items ?? []
  const hasUnread = notifications.some((notification) => !notification.is_read)

  const handleReadAll = () => {
    markReadAllMutation.mutate()
  }

  const handleOpenNotification = async (notification: NotificationListItem) => {
    try {
      if (!notification.is_read) {
        await markReadMutation.mutateAsync(notification.id)
      }
    } catch {
      return
    }

    const deeplink = getSafeInternalDeeplink(notification.deeplink)
    if (deeplink) {
      router.push(deeplink)
      onClose?.()
    }
  }

  return (
    <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-3xl border border-app-border bg-app-bg shadow-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-app-border px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-app-text">Уведомления</h2>
          <p className="text-xs text-app-text-muted">Последние события</p>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={handleReadAll}
            disabled={markReadAllMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-full bg-app-surface-1 px-3 py-1.5 text-xs font-semibold text-brand-accent transition-colors hover:bg-app-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Прочитать все
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {isLoading && (
          <div className="px-4 py-8 text-center text-sm text-app-text-muted">
            Загружаем уведомления...
          </div>
        )}

        {isError && (
          <div className="px-4 py-8 text-center text-sm text-red-400">
            Не удалось загрузить уведомления
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-app-text-muted">
            Новых уведомлений пока нет
          </div>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <div className="divide-y divide-app-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpenNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
