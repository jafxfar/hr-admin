'use client';

import { Bell, Settings, LogOut, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useMe } from '@/hooks/use-employees';
import { buildFileUrl } from '@/lib/files';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import {
  useMarkNotificationsSeenAllMutation,
  useUnreadNotificationsCount,
} from '@/hooks/use-notifications'
import { clearAuthStorage } from '@/lib/auth-storage'
import { HeaderActionButton, HeaderSearchInput } from '@/components/hr-header-controls'

export interface HRHeaderTab {
  label: string
  value: string
}

interface HRHeaderProps {
  /** Заголовок страницы */
  title?: string
  /** Основная кнопка действия (динамическая) */
  action?: {
    label: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  /** Полоса под заголовком: поиск, фильтры и т.д. (динамическая) */
  toolbar?: React.ReactNode
  /** Дополнительный поиск / элементы в левой части (динамические) */
  topActions?: React.ReactNode
  /** Встроенный поиск в хедере */
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  /** Табы подстраниц (динамические) */
  tabs?: HRHeaderTab[]
  /** Активный таб */
  activeTab?: string
  /** Callback при переключении таба */
  onTabChange?: (value: string) => void
}

export function HRHeader({ title, action, toolbar, topActions, searchPlaceholder, searchValue, onSearchChange, tabs, activeTab, onTabChange }: HRHeaderProps) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = React.useState(false)
  const { data: me } = useMe()
  const { data: unreadCount } = useUnreadNotificationsCount()
  const markSeenAllMutation = useMarkNotificationsSeenAllMutation()
  const unreadNotifications = unreadCount?.unread ?? 0

  const firstName = me?.properties?.first_name ?? ''
  const lastName = me?.properties?.last_name ?? ''
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || me?.email || 'Администратор'
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('') || 'AD'
  const photoUrl = me?.properties?.profile_photo_url
    ? buildFileUrl(me.properties.profile_photo_url)
    : undefined

  const handleToggleNotifications = () => {
    setShowNotifications((current) => {
      const next = !current
      if (next) {
        markSeenAllMutation.mutate()
      }
      return next
    })
  }

  const handleLogout = () => {
    clearAuthStorage()
    router.push('/login')
  }

  return (
    <header className="app-chrome-glass w-full shrink-0 sticky top-0 z-40 flex flex-col rounded-[var(--radius-card)]">
      {/* ── Main bar ── */}
      <div className="flex h-20 items-center justify-between gap-4 px-5">

        {/* Left: title + search + dynamic topActions */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Built-in search */}
          {(searchPlaceholder !== undefined || onSearchChange !== undefined) && (
            <HeaderSearchInput
              value={searchValue ?? ''}
              onChange={(value) => onSearchChange?.(value)}
              placeholder={searchPlaceholder ?? 'Поиск...'}
              widthClassName="w-full max-w-sm"
            />
          )}

          {topActions && (
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {topActions}
            </div>
          )}
        </div>

        {/* Right: dynamic action button + static icons */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Dynamic CTA button */}
          {action && (
            <HeaderActionButton onClick={action.onClick} icon={action.icon ?? <PlusCircle className="w-4 h-4" />}>
              {action.label}
            </HeaderActionButton>
          )}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Static: notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="app-glass-inset flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] text-app-text-muted transition-opacity hover:opacity-90 hover:text-brand-accent"
              aria-label="Открыть уведомления"
            >
              <Bell className="h-4 w-4" />
            </button>
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold leading-none text-brand-accent-on">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
            {showNotifications && (
              <NotificationsDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* Static: settings */}
          <button
            type="button"
            onClick={() => router.push('/settings')}
            className="app-glass-inset flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] text-app-text-muted transition-opacity hover:opacity-90 hover:text-brand-accent"
            aria-label="Открыть настройки"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Static: avatar */}
          <Link href="/profile" className="shrink-0">
            <Avatar className="h-9 w-9 ring-2 ring-brand-accent/20 transition-all hover:ring-brand-accent/50">
              <AvatarImage src={photoUrl ?? '/default-avatar.png'} alt={displayName} />
              <AvatarFallback className="bg-[rgb(var(--theme-primary-rgb)/0.08)] text-[12px] font-bold text-brand-accent">{initials}</AvatarFallback>
            </Avatar>
          </Link>

          {/* Static: logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="app-glass-inset flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] text-app-text-muted transition-opacity hover:opacity-90 hover:text-red-400"
            aria-label="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs (dynamic) ── */}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 border-t border-white/10 px-5 pb-0">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  'px-5 py-3 text-[13px] font-semibold transition-all duration-200 border-b-2 -mb-px',
                  isActive
                    ? 'nav-pill-active rounded-full px-5 py-2 border-b-0 -mb-0'
                    : 'text-app-text-muted border-transparent hover:text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] rounded-full px-5 py-2 border-b-0 -mb-0',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Toolbar (dynamic: search, filters, selects…) ── */}
      {toolbar && (
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-3">
          {toolbar}
        </div>
      )}
    </header>
  )
}
