export interface NotificationListItem {
  id: number
  event_id: number
  event_type: string
  title: string
  body: string | null
  deeplink: string | null
  is_seen: boolean
  seen_at: string | null
  is_read: boolean
  read_at: string | null
  created_at: string | null
}

export interface NotificationsResponse {
  items: NotificationListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface NotificationsQueryParams {
  page?: number
  pageSize?: number
  q?: string
  isRead?: boolean
  eventType?: string
}

export interface NotificationUnreadCount {
  unread: number
}

export interface NotificationMutationResult {
  updated: number
}

export interface NotificationRealtimeInitMessage {
  type: 'init'
  unread: number
}

export interface NotificationRealtimePingMessage {
  type: 'ping'
}

export interface NotificationRealtimeEventMessage {
  user_id?: number
  event_type: string
  event_id: number
  title: string
  body: string | null
  deeplink: string | null
  entity_type: string | null
  entity_id: number | null
  created_at: string | null
}

export type NotificationRealtimeMessage =
  | NotificationRealtimeInitMessage
  | NotificationRealtimePingMessage
  | NotificationRealtimeEventMessage
