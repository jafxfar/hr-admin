import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications'
import type {
  NotificationListItem,
  NotificationUnreadCount,
  NotificationsQueryParams,
  NotificationsResponse,
} from '@/types/notifications'

export const NOTIFICATIONS_QUERY_KEY = ['notifications']
export const NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count']

export function useNotifications(params: NotificationsQueryParams = {}) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationsApi.getMine(params),
  })
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
    queryFn: notificationsApi.getUnreadCount,
  })
}

export function useMarkNotificationsSeenAllMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: notificationsApi.markSeenAll,
    onSuccess: () => {
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (current) => {
          if (!current) return current

          return {
            ...current,
            items: current.items.map((notification) => ({
              ...notification,
              is_seen: true,
              seen_at: notification.seen_at ?? new Date().toISOString(),
            })),
          }
        },
      )
    },
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: (notificationId: number) => notificationsApi.markRead([notificationId]),
    onSuccess: (_data, notificationId) => {
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (current) => {
          if (!current) return current

          return {
            ...current,
            items: current.items.map((notification) =>
              notification.id === notificationId
                ? {
                    ...notification,
                    is_seen: true,
                    is_read: true,
                    seen_at: notification.seen_at ?? new Date().toISOString(),
                    read_at: notification.read_at ?? new Date().toISOString(),
                  }
                : notification,
            ),
          }
        },
      )
      queryClient.setQueryData<NotificationUnreadCount>(
        NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
        (current) => {
          if (!current) return current
          return { unread: Math.max(current.unread - 1, 0) }
        },
      )
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY })
    },
  })
}

export function useMarkNotificationsReadAllMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: notificationsApi.markReadAll,
    onSuccess: () => {
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: NOTIFICATIONS_QUERY_KEY },
        (current) => {
          if (!current) return current

          return {
            ...current,
            items: current.items.map((notification) => ({
              ...notification,
              is_seen: true,
              is_read: true,
              seen_at: notification.seen_at ?? new Date().toISOString(),
              read_at: notification.read_at ?? new Date().toISOString(),
            })),
          }
        },
      )
      queryClient.setQueryData<NotificationUnreadCount>(
        NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
        { unread: 0 },
      )
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY })
    },
  })
}

export const getUnreadNotificationIds = (notifications: NotificationListItem[]) =>
  notifications.filter((notification) => !notification.is_read).map((notification) => notification.id)
