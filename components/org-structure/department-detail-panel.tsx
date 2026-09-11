'use client'

import { Building2, ChevronRight, UserCircle2, Users, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildFileUrl } from '@/lib/files'
import { getDeptName, getFullName, getInitials } from '@/lib/org-structure-utils'
import type { Department } from '@/types/departments'

export function DepartmentDetailPanel({
  dept,
  allDepts,
  onClose,
}: {
  dept: Department
  allDepts: Department[]
  onClose: () => void
}) {
  const headUser = dept.head_user ?? null
  const fullName = getFullName(headUser)
  const hasHead = !!headUser
  const headPhotoUrl = headUser?.profile_photo_url && headUser.exists !== false
    ? buildFileUrl(headUser.profile_photo_url)
    : undefined

  // Count direct children
  const childCount = allDepts.filter((d) => d.parent_id === dept.id).length
  // Count all descendants
  const countDescendants = (id: number): number => {
    const children = allDepts.filter((d) => d.parent_id === id)
    return children.reduce((acc, c) => acc + 1 + countDescendants(c.id), 0)
  }
  const totalDescendants = countDescendants(dept.id)

  return (
    <div className="absolute top-6 right-6 w-80 z-30 flex flex-col gap-3 animate-in slide-in-from-right-4 duration-200">
      {/* Main info card */}
      <div className="rounded-2xl border border-app-border bg-app-surface-0 p-6 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-brand-accent flex items-center justify-center shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.3)] shrink-0">
              <Building2 className="w-6 h-6 text-brand-accent-on" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-accent leading-tight">{getDeptName(dept)}</h3>
              <p className="text-xs font-medium text-app-text-muted mt-0.5">
                {dept.path ?? (dept.level === 0 ? 'Корневой отдел' : `Уровень ${dept.level}`)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[12px] cursor-pointer text-app-text-muted hover:text-app-text hover:bg-app-surface-2/80 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {dept.description && (
          <p className="text-xs text-app-text-muted leading-relaxed mb-5 border-l-2 border-brand-accent/40 pl-3">
            {dept.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="flex flex-col items-center rounded-3xl bg-app-surface-1 p-3">
            <span className="text-xl font-black text-secondary">{childCount}</span>
            <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-app-text-muted">Подотделов</span>
          </div>
          <div className="flex flex-col items-center rounded-3xl bg-app-surface-1 p-3">
            <span className="text-xl font-black text-brand-accent">{totalDescendants}</span>
            <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-app-text-muted">Всего вложенных</span>
          </div>
        </div>

        {/* Level bar */}
        <div className="mb-1 flex flex-col gap-1">
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">Уровень иерархии</span>
            <span className="text-xs font-bold text-app-text">{dept.level ?? 0}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-app-surface-1">
            <div
              className="h-full rounded-full bg-brand-accent transition-all duration-500"
              style={{ width: `${Math.min(100, ((dept.level ?? 0) + 1) * 20)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Head user card */}
      <div className="rounded-2xl border border-app-border bg-app-surface-0 p-4 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-app-text-muted">Руководитель</span>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand-accent/50 bg-app-surface-1">
            {hasHead ? (
              <Avatar className="h-full w-full">
                <AvatarImage src={headPhotoUrl ?? '/default-avatar.png'} alt={fullName} className="object-cover" />
                <AvatarFallback className="bg-app-surface-1 text-sm font-bold text-brand-accent">
                  {getInitials(headUser)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCircle2 className="h-6 w-6 text-app-text-muted" />
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold text-app-text">{fullName}</span>
            <span className="text-xs font-medium text-app-text-muted">Руководитель отдела</span>
          </div>
        </div>
        <a
          href={`/departments/${dept.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl border border-app-border bg-app-surface-1 py-2 text-xs font-bold text-app-text transition-all hover:border-brand-accent/40 hover:text-brand-accent"
        >
          <Users className="h-3.5 w-3.5" />
          Сотрудники отдела
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
