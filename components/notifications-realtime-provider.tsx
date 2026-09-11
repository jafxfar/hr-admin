'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import {
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
} from '@/hooks/use-notifications'
import type {
  NotificationRealtimeEventMessage,
  NotificationRealtimeMessage,
  NotificationUnreadCount,
} from '@/types/notifications'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const RECONNECT_BASE_DELAY_MS = 1000
const RECONNECT_MAX_DELAY_MS = 15000

const isRealtimeInitMessage = (
  message: NotificationRealtimeMessage,
): message is Extract<NotificationRealtimeMessage, { type: 'init' }> =>
  'type' in message && message.type === 'init'

const isRealtimePingMessage = (
  message: NotificationRealtimeMessage,
): message is Extract<NotificationRealtimeMessage, { type: 'ping' }> =>
  'type' in message && message.type === 'ping'

const buildNotificationsWsUrl = (token: string) => {
  const url = new URL(API_BASE_URL, window.location.origin)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = `${url.pathname.replace(/\/$/, '')}/notifications/ws`
  url.searchParams.set('token', token)
  return url.toString()
}

const parseRealtimeMessage = (raw: string): NotificationRealtimeMessage | null => {
  try {
    return JSON.parse(raw) as NotificationRealtimeMessage
  } catch {
    return null
  }
}

type NotificationsRealtimeProviderProps = {
  children: React.ReactNode
}

export function NotificationsRealtimeProvider({ children }: NotificationsRealtimeProviderProps) {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (pathname === '/login' || pathname.startsWith('/login/')) return undefined

    let socket: WebSocket | null = null
    let isDisposed = false

    const clearReconnectTimeout = () => {
      if (!reconnectTimeoutRef.current) return
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    const invalidateNotifications = () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY })
    }

    const handleEventMessage = (message: NotificationRealtimeEventMessage) => {
      queryClient.setQueryData<NotificationUnreadCount>(
        NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
        (current) => ({ unread: (current?.unread ?? 0) + 1 }),
      )
      invalidateNotifications()
      toast({
        title: message.title,
        description: message.body ?? 'Новое уведомление',
      })
    }

    const connect = () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      socket = new WebSocket(buildNotificationsWsUrl(token))

      socket.onopen = () => {
        reconnectAttemptRef.current = 0
      }

      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') return

        const message = parseRealtimeMessage(event.data)
        if (!message) return
        if (isRealtimePingMessage(message)) return

        if (isRealtimeInitMessage(message)) {
          queryClient.setQueryData<NotificationUnreadCount>(
            NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
            { unread: message.unread },
          )
          return
        }

        handleEventMessage(message)
      }

      socket.onclose = (event) => {
        if (isDisposed) return
        if (event.code === 1008) return

        reconnectAttemptRef.current += 1
        const delay = Math.min(
          RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1),
          RECONNECT_MAX_DELAY_MS,
        )
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }

      socket.onerror = () => {
        socket?.close()
      }
    }

    connect()

    return () => {
      isDisposed = true
      clearReconnectTimeout()
      socket?.close()
    }
  }, [pathname, queryClient, toast])

  return <>{children}</>
}
