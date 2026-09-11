'use client'

import React from "react"
import { AdminShellBackground } from './admin-shell-background'
import { HRSidebar } from './hr-sidebar'
import { HRHeader, HRHeaderTab } from './hr-header'

interface HRLayoutProps {
  children: React.ReactNode
  /** Заголовок страницы */
  title?: string
  /** Полоса под заголовком: поиск, фильтры, селекты */
  toolbar?: React.ReactNode
  /** Элементы в левой части рядом с заголовком */
  topActions?: React.ReactNode
  /** Скрыть header (страница профиля и т.п.) */
  isProfile?: boolean
  /** Основная кнопка действия */
  action?: {
    label: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  /** Табы подстраниц */
  tabs?: HRHeaderTab[]
  /** Активный таб */
  activeTab?: string
  /** Callback при переключении таба */
  onTabChange?: (value: string) => void
  /** Встроенный поиск в хедере */
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function HRLayout({ children, title, action, isProfile, toolbar, topActions, tabs, activeTab, onTabChange, searchPlaceholder, searchValue, onSearchChange }: HRLayoutProps) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <AdminShellBackground />
      <HRSidebar />
      <div className="relative z-5 max-w-screen-5xl mx-auto flex min-w-0 flex-1 flex-col overflow-hidden pt-2 pr-3 pl-3 pb-3">
        <main className="flex flex-1 flex-col overflow-hidden">
          {!isProfile && (
            <HRHeader
              title={title}
              action={action}
              toolbar={toolbar}
              topActions={topActions}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              searchPlaceholder={searchPlaceholder}
              searchValue={searchValue}
              onSearchChange={onSearchChange}
            />
          )}
          <div className="admin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}