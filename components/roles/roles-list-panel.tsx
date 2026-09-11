'use client'

import { cn } from '@/lib/utils'

type RoleItem = {
  id: number
  name: string
  description?: string | null
  is_active?: boolean
  can_access_admin_ui?: boolean
}

type RolesListPanelProps = {
  roles: RoleItem[]
  selectedRoleId: number | null
  onSelectRole: (id: number) => void
}

export const RolesListPanel = ({
  roles,
  selectedRoleId,
  onSelectRole,
}: RolesListPanelProps) => (
  <section className="app-panel-glass col-span-12 space-y-4 rounded-3xl p-5 xl:col-span-4">
    <h2 className="text-xs font-black uppercase tracking-[0.18em] text-app-text-muted">Активные роли</h2>
    <div className="admin-scrollbar max-h-[calc(100vh-280px)] space-y-3 overflow-y-auto pr-1">
      {roles.map((role) => (
        <div
          key={role.id}
          onClick={() => onSelectRole(role.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onSelectRole(role.id)
            }
          }}
          className={cn(
            'w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition',
            selectedRoleId === role.id
              ? 'app-glass-inset border-brand-accent/40 shadow-[0_10px_20px_-18px_rgb(var(--theme-primary-rgb)/0.5)] ring-1 ring-brand-accent/30'
              : 'app-glass-inset app-glass-inset-hover border-app-border/60',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg font-bold">{role.name}</p>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {role.is_active === false ? (
                <span className="rounded-full bg-app-surface-2 px-2 py-0.5 text-xs font-medium text-app-text-muted">
                  Неактивна
                </span>
              ) : (
                <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-xs font-semibold text-brand-accent">
                  Активна
                </span>
              )}
              {role.can_access_admin_ui && (
                <span className="app-glass-inset rounded-full px-2 py-0.5 text-xs font-medium text-app-text-muted">
                  Админ
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-app-text-muted">
            {role.description || 'Нет описания'}
          </p>
        </div>
      ))}
      {roles.length === 0 && (
        <p className="py-8 text-center text-sm text-app-text-muted">Роли не найдены</p>
      )}
    </div>
  </section>
)
