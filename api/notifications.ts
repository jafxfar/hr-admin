import { apiClient } from '@/api/client'
import type {
  NotificationMutationResult,
  NotificationUnreadCount,
  NotificationsQueryParams,
  NotificationsResponse,
} from '@/types/notifications'

const toRequestParams = (params: NotificationsQueryParams = {}) => {
  const requestParams: Record<string, string | number> = {
    page: params.page ?? 1,
    page_size: params.pageSize ?? 20,
  }

  if (params.q?.trim()) {
    requestParams.q = params.q.trim()
  }

  if (typeof params.isRead === 'boolean') {
    requestParams.is_read = params.isRead ? 1 : 0
  }

  if (params.eventType?.trim()) {
    requestParams.event_type = params.eventType.trim()
  }

  return requestParams
}

export const notificationsApi = {
  getMine: (params?: NotificationsQueryParams): Promise<NotificationsResponse> =>
    apiClient.get<NotificationsResponse>('/notifications/my', toRequestParams(params)),

  getUnreadCount: (): Promise<NotificationUnreadCount> =>
    apiClient.get<NotificationUnreadCount>('/notifications/my/unread-count'),

  markRead: (ids: number[]): Promise<NotificationMutationResult> =>
    apiClient.patch<NotificationMutationResult>('/notifications/my/read', { ids }),

  markReadAll: (): Promise<NotificationMutationResult> =>
    apiClient.patch<NotificationMutationResult>('/notifications/my/read-all'),

  markSeen: (ids: number[]): Promise<NotificationMutationResult> =>
    apiClient.patch<NotificationMutationResult>('/notifications/my/seen', { ids }),

  markSeenAll: (): Promise<NotificationMutationResult> =>
    apiClient.patch<NotificationMutationResult>('/notifications/my/seen-all'),

  hide: (notificationId: number): Promise<void> =>
    apiClient.delete<void>(`/notifications/my/${notificationId}`),
}
