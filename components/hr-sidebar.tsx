'use client'

import Link from 'next/link'
import { useState, useEffect, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BadgeCheck,
  Lightbulb,
  CalendarDays,
  Network,
  Briefcase,
  UserCog,
  IdCard,
  Building2,
  ChartNoAxesCombined,
  Timer,
  Trophy,
  ClipboardList,
  Users,
  Newspaper,
  Settings,
  GitBranch,
  Tag,
  GraduationCap,
  BookOpen,
  FolderTree,
  FolderKanban,
  ListTodo,
  type LucideIcon,
} from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useMe } from '@/hooks/use-employees'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import { isFeatureEnabled } from '@/lib/feature-access'
import type { FeatureKey } from '@/lib/feature-access'
import { useSidebarFlyout } from '@/hooks/use-sidebar-sections'
import { BrandLogo } from '@/components/brand-logo'

type SidebarLinkItem = {
  icon: LucideIcon
  label: string
  href: string
  featureKey?: FeatureKey
  requiresSuperadmin?: boolean
}

type SidebarSection = {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  featureKey?: FeatureKey
  requiresSuperadmin?: boolean
  items: SidebarLinkItem[]
}

const isPathActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

const isChildPathActive = (
  pathname: string,
  href: string,
  siblings: { href: string }[],
) => {
  const matchingSibling = siblings
    .filter((sibling) => isPathActive(pathname, sibling.href))
    .sort((a, b) => b.href.length - a.href.length)[0]

  return matchingSibling?.href === href
}

const isSectionPathActive = (pathname: string, section: SidebarSection) => {
  if (section.href) {
    return isPathActive(pathname, section.href)
  }

  return section.items.some((item) => isPathActive(pathname, item.href))
}

const menuSections: SidebarSection[] = [
  {
    id: 'overview',
    label: 'Статистика',
    icon: LayoutDashboard,
    href: '/dashboard',
    items: [],
  },
  {
    id: 'tasks',
    label: 'Задачи',
    icon: ListTodo,
    featureKey: 'tasks_enabled' as FeatureKey,
    items: [
      { icon: ChartNoAxesCombined, label: 'Отчёты', href: '/tasks/reports' },
      { icon: FolderKanban, label: 'Проекты', href: '/tasks/projects' },
      { icon: ListTodo, label: 'Задачи', href: '/tasks/board' },
    ],
  },
  {
    id: 'organization',
    label: 'Организация',
    icon: Building2,
    items: [
      { icon: BadgeCheck, label: 'Сотрудники', href: '/employees' },
      { icon: UserCog, label: 'Роли', href: '/roles' },
      { icon: IdCard, label: 'Должности', href: '/positions' },
      { icon: Network, label: 'Орг. структура', href: '/org-structure' },
      { icon: Building2, label: 'Отделы', href: '/departments' },
      { icon: GitBranch, label: 'Филиалы', href: '/branches', featureKey: 'branches_enabled' as FeatureKey },
    ],
  },
  {
    id: 'recruiting',
    label: 'Рекрутинг',
    icon: Briefcase,
    items: [
      { icon: Briefcase, label: 'Аналитика', href: '/vacancy-dashboard', featureKey: 'vacancies_enabled' as FeatureKey },
      { icon: Briefcase, label: 'Вакансии', href: '/vacancies', featureKey: 'vacancies_enabled' as FeatureKey },
      { icon: Users, label: 'Отклики', href: '/vacancy-applications', featureKey: 'vacancy_applications_enabled' as FeatureKey },
      { icon: Tag, label: 'Категории', href: '/vacancies/categories', featureKey: 'vacancies_enabled' as FeatureKey },
    ],
  },
  {
    id: 'time',
    label: 'Учёт времени',
    icon: CalendarDays,
    items: [
      { icon: CalendarDays, label: 'Отпуски', href: '/leaves' },
      { icon: ChartNoAxesCombined, label: 'KPI', href: '/kpi', featureKey: 'kpi_enabled' as FeatureKey },
      { icon: Timer, label: 'Табель', href: '/timesheet', featureKey: 'timesheets_enabled' as FeatureKey },
    ],
  },
  {
    id: 'engagement',
    label: 'Вовлечённость',
    icon: Trophy,
    items: [
      { icon: Lightbulb, label: 'Идеи', href: '/ideas', featureKey: 'ideas_enabled' as FeatureKey },
      { icon: Newspaper, label: 'Новости', href: '/news', featureKey: 'news_enabled' as FeatureKey },
      { icon: ClipboardList, label: 'Заявки', href: '/requests' },
      { icon: Trophy, label: 'Награды', href: '/rewards' },
    ],
  },
  {
    id: 'training',
    label: 'Обучение',
    icon: GraduationCap,
    featureKey: 'lms_enabled' as FeatureKey,
    items: [
      { icon: ChartNoAxesCombined, label: 'Отчёт', href: '/training/report' },
      { icon: BookOpen, label: 'Курсы', href: '/training/courses' },
      { icon: FolderTree, label: 'Категории курсов', href: '/training/categories' },
      { icon: Users, label: 'Учащиеся', href: '/training/learners' },
    ],
  },
  {
    id: 'system',
    label: 'Настройки',
    icon: Settings,
    href: '/settings',
    requiresSuperadmin: true,
    items: [],
  },
]

const linkClassName = (isActive: boolean) =>
  cn(
    'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-[background-color,color,transform,box-shadow] duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-sidebar-bg)]',
    'active:scale-[0.96]',
    isActive
    ? 'bg-[rgb(var(--theme-primary-rgb)/0.14)] text-brand-accent'
    : 'text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] hover:text-app-text',
  )

const railButtonClassName = (isActive: boolean) =>
  cn(
    'relative flex h-12 w-12 items-center justify-center rounded-xl transition-[background-color,color,transform] duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-sidebar-bg)]',
    'active:scale-[0.96]',
    isActive
      ? 'bg-[rgb(var(--theme-primary-rgb)/0.14)] text-brand-accent'
      : 'text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] hover:text-app-text',
  )

const SidebarNavLinks = ({
  section,
  pathname,
}: {
  section: SidebarSection
  pathname: string
}) => (
  <>
    {section.items.map((item) => {
      const Icon = item.icon
      const isActive = isChildPathActive(pathname, item.href, section.items)

      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive ? 'page' : undefined}
          className={linkClassName(isActive)}
        >
          {isActive ? (
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-brand-accent"
            />
          ) : null}
          <Icon
            className={cn(
              'w-5 h-5 shrink-0 transition-colors duration-200',
              isActive ? 'text-brand-accent' : 'text-app-text-muted group-hover:text-app-text',
            )}
            strokeWidth={isActive ? 2.25 : 2}
          />
          <span className="truncate">{item.label}</span>
        </Link>
      )
    })}
  </>
)

export function HRSidebar() {
  const pathname = usePathname()
  const { data: settingsFeatures } = useSettingsFeatures()
  const { data: me } = useMe()
  const [isPortalReady, setIsPortalReady] = useState(false)

  useEffect(() => {
    setIsPortalReady(true)
  }, [])
  const features = settingsFeatures?.features
  const systemRoleName = getSystemRoleName(me)
  const isSuperadmin = systemRoleName?.toLowerCase() === 'superadmin'
  const canAccessAdminUi = isSuperadmin || me?.can_access_admin_ui === true
  const profilePhotoUrl = getImageUrl(me?.properties?.profile_photo_url ?? null)
  const userFirstName = me?.properties?.first_name?.trim() ?? ''
  const userLastName = me?.properties?.last_name?.trim() ?? ''
  const userFullName = [userFirstName, userLastName].filter(Boolean).join(' ') || me?.email || 'Пользователь'
  const roleLabel = systemRoleName?.trim().toLowerCase() || 'employee'
  const roleTitleRu: Record<string, string> = {
    superadmin: 'Суперадмин',
    admin: 'Администратор',
    employee: 'Сотрудник',
    hr: 'HR',
  }
  const roleTitle =
    roleTitleRu[roleLabel] ??
    (systemRoleName?.trim() ? systemRoleName.charAt(0).toUpperCase() + systemRoleName.slice(1) : 'Сотрудник')
  const avatarInitials = `${userFirstName[0] ?? ''}${userLastName[0] ?? ''}`.toUpperCase() || (me?.email?.[0] ?? '?').toUpperCase()

  const visibleSections = menuSections
    .filter((section) => {
      if (section.requiresSuperadmin && !isSuperadmin) {
        return false
      }

      return isFeatureEnabled(section.featureKey, features)
    })
    .map((section) => {
      const items = section.items.filter((item) => {
        if (!canAccessAdminUi && item.href !== '/dashboard') {
          return false
        }

        if (item.requiresSuperadmin && !isSuperadmin) {
          return false
        }

        return isFeatureEnabled(item.featureKey, features)
      })

      return { ...section, items }
    })
    .filter((section) => {
      if (section.href) {
        if (!canAccessAdminUi && section.href !== '/dashboard') {
          return false
        }

        return true
      }

      return section.items.length > 0
    })

  const railSections = visibleSections.filter((section) => section.id !== 'system')
  const systemSection = visibleSections.find((section) => section.id === 'system')

  const {
    openSectionId,
    handleClose,
    handlePanelEnter,
    handlePanelLeave,
    handleSectionHover,
    handleSectionToggle,
  } = useSidebarFlyout()

  const openSection = visibleSections.find((section) => section.id === openSectionId && !section.href) ?? null
  const flyoutPanelId = openSection ? `sidebar-flyout-${openSection.id}` : undefined

  const handleRailKeyDown = (event: KeyboardEvent<HTMLButtonElement>, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSectionToggle(sectionId)
    }
  }

  const flyoutPanel = openSection ? (
    <div
      id={flyoutPanelId}
      role="region"
      aria-label={openSection.label}
      onMouseEnter={handlePanelEnter}
      onMouseLeave={handlePanelLeave}
        className={cn(
          'fixed top-0 z-40 flex h-screen w-56 flex-col overflow-hidden isolate app-chrome-glass',
          'left-[var(--admin-sidebar-width)] rounded-none rounded-r-[var(--radius-card)] text-brand-accent',
          'shadow-[12px_0_40px_-12px_rgb(var(--theme-primary-rgb)/0.18),4px_0_24px_-8px_rgba(0,0,0,0.08)]',
        )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative z-[1] flex items-center gap-2.5 px-4 pt-7 pb-4">
        <openSection.icon className="h-5 w-5 text-brand-accent" strokeWidth={2} />
        <p className="text-[15px] font-bold tracking-tight text-app-text">{openSection.label}</p>
      </div>
      <nav className="relative z-[1] flex-1 space-y-1 overflow-y-auto px-2 pb-4 no-scrollbar">
        <SidebarNavLinks section={openSection} pathname={pathname} />
      </nav>
    </div>
  ) : null

  return (
    <div
      className="relative z-30 flex h-screen flex items-center justify-center shrink-0"
      onMouseEnter={handlePanelEnter}
      onMouseLeave={handlePanelLeave}
    >
      <aside
        className={cn(
          'relative z-10 flex h-screen w-admin-sidebar shrink-0 flex-col overflow-hidden tracking-tight isolate app-chrome-glass',
          'rounded-none text-brand-accent',
          'shadow-[12px_0_40px_-12px_rgb(var(--theme-primary-rgb)/0.18),4px_0_24px_-8px_rgba(0,0,0,0.08)]',
        )}
        aria-label="Основная навигация"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgb(var(--theme-primary-rgb)/0.14),transparent_55%),linear-gradient(180deg,rgb(var(--theme-primary-rgb)/0.04),transparent_42%)]"
        />

        <div className="relative z-[1] flex justify-center px-2.5 pt-6 pb-4">
          <BrandLogo
            href="/dashboard"
            showName={false}
            className="justify-center [&>div]:h-13 [&>div]:w-13 [&_svg]:h-8 [&_svg]:w-8"
          />
        </div>

        <nav className="relative z-[1] flex flex-1 flex-col items-center gap-2 overflow-y-auto px-2.5 pb-3 no-scrollbar">
          {railSections.map((section) => {
            const Icon = section.icon
            const isActive = isSectionPathActive(pathname, section)
            const isOpen = openSectionId === section.id
            const hasFlyout = !section.href

            if (!hasFlyout && section.href) {
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  aria-label={section.label}
                  aria-current={isActive ? 'page' : undefined}
                  title={section.label}
                  className={railButtonClassName(isActive)}
                  onMouseEnter={handleClose}
                  onFocus={handleClose}
                >
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-brand-accent"
                    />
                  ) : null}
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 2} />
                </Link>
              )
            }

            return (
              <button
                key={section.id}
                type="button"
                aria-label={section.label}
                aria-expanded={isOpen}
                aria-controls={isOpen ? flyoutPanelId : undefined}
                title={section.label}
                className={railButtonClassName(isActive || isOpen)}
                onMouseEnter={() => handleSectionHover(section.id)}
                onFocus={() => handleSectionHover(section.id)}
                onClick={() => handleSectionHover(section.id)}
                onKeyDown={(event) => handleRailKeyDown(event, section.id)}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-brand-accent"
                  />
                ) : null}
                <Icon className="h-6 w-6" strokeWidth={isActive || isOpen ? 2.25 : 2} />
              </button>
            )
          })}
        </nav>

        <div className="relative z-[1] mt-auto flex flex-col items-center gap-3 px-2.5 pb-5 pt-3">
          {systemSection?.href ? (
            <Link
              href={systemSection.href}
              aria-label={systemSection.label}
              aria-current={isSectionPathActive(pathname, systemSection) ? 'page' : undefined}
              title={systemSection.label}
              className={railButtonClassName(isSectionPathActive(pathname, systemSection))}
              onMouseEnter={handleClose}
              onFocus={handleClose}
            >
              {isSectionPathActive(pathname, systemSection) ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r-full bg-brand-accent"
                />
              ) : null}
              <Settings
                className="h-6 w-6"
                strokeWidth={isSectionPathActive(pathname, systemSection) ? 2.25 : 2}
              />
            </Link>
          ) : null}

          <div className="flex h-12 w-12 items-center justify-center" title={`${userFullName} · ${roleTitle}`}>
            {profilePhotoUrl ? (
              <img
                alt={userFullName}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-accent/20"
                src={profilePhotoUrl}
              />
            ) : (
              <div
                aria-label={userFullName}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-brand-accent/10 text-xs font-semibold text-brand-accent"
              >
                {avatarInitials}
              </div>
            )}
          </div>
        </div>
      </aside>

      {isPortalReady && flyoutPanel ? createPortal(flyoutPanel, document.body) : null}
    </div>
  )
}
