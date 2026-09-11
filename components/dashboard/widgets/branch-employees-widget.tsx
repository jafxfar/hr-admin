'use client'

import type { KeyboardEvent } from 'react'
import { GitBranch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { BranchEmployeesDashboardItem } from '@/types/dashboard'
import { GlassCard, SkeletonBlock } from '../dashboard-glass-ui'

export interface BranchEmployeesWidgetProps {
  items?: BranchEmployeesDashboardItem[]
  isLoading: boolean
}

export const BranchEmployeesWidget = ({
  items = [],
  isLoading,
}: BranchEmployeesWidgetProps) => {
  const branchItems = items ?? []
  const router = useRouter()

  const handleBranchClick = (branchId: number) => {
    router.push(`/employees?branch_id=${branchId}`)
  }

  const handleBranchKeyDown = (event: KeyboardEvent, branchId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleBranchClick(branchId)
    }
  }

  return (
    <GlassCard variant="solid" className="col-span-12" data-marketing="branches">
      <h3
        className="mb-1 text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Активные сотрудники по филиалам
      </h3>
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted">
        Нажмите на филиал, чтобы открыть список сотрудников
      </p>

      {isLoading ? (
        <div className="admin-card-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24" />
          ))}
        </div>
      ) : branchItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-app-text-muted">
          <GitBranch className="mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm">Филиалы не найдены</p>
        </div>
      ) : (
        <div className="admin-card-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {branchItems.map((branch) => (
            <button
              key={branch.branch_id}
              type="button"
              role="link"
              tabIndex={0}
              aria-label={`${branch.branch_name}: ${branch.active_employees_count} активных сотрудников`}
              onClick={() => handleBranchClick(branch.branch_id)}
              onKeyDown={(event) => handleBranchKeyDown(event, branch.branch_id)}
              className="group flex flex-col rounded-2xl border border-app-border bg-app-surface-1 px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-app-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
            >
              <div className="mb-2 flex items-center gap-2 text-app-text-muted">
                <GitBranch className="h-4 w-4 shrink-0 text-brand-accent" />
                <span className="line-clamp-2 text-sm font-semibold text-app-text group-hover:text-brand-accent">
                  {branch.branch_name}
                </span>
              </div>
              <span
                className="text-3xl font-black tabular-nums text-brand-accent"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {branch.active_employees_count}
              </span>
              <span className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-app-text-muted">
                активных
              </span>
            </button>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
