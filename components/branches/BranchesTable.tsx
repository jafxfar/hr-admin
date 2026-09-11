'use client'

import type { Branch } from '@/api/branches'
import { Button } from '@/components/ui/button'
import { GitBranch, Pencil, Trash2 } from 'lucide-react'

export interface BranchesTableProps {
  branches: Branch[]
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (branch: Branch) => void
  onDelete: (id: number) => void
}

export const BranchesTable = ({
  branches,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: BranchesTableProps) => (
  <>
    {isLoading ? (
      <div className="flex items-center justify-center h-40 text-app-text-muted text-sm">
        Загрузка...
      </div>
    ) : branches.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-app-text-muted">
        <GitBranch className="w-10 h-10 opacity-40" />
        <span className="text-sm">Филиалы не найдены</span>
      </div>
    ) : (
      <div className="admin-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <div
            key={b.id}
            className="group flex flex-col gap-4 rounded-3xl border border-app-border bg-app-surface-0 p-6 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-app-surface-1"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-xl font-bold text-app-text leading-tight">{b.name}</h3>
                {b.code ? <p className="mt-1 text-xs text-app-text-muted">Код: {b.code}</p> : null}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(b)}
                  className="rounded-xl p-2 text-app-text-muted transition-colors hover:bg-app-surface-2/80 hover:text-app-text"
                  title="Редактировать"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(b.id)}
                  className="rounded-xl p-2 text-app-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {b.description ? <p className="line-clamp-3 text-sm leading-relaxed text-app-text-muted">{b.description}</p> : null}
            <div className="mt-auto border-t border-app-border pt-4">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${b.is_active !== false ? 'text-brand-accent' : 'text-app-text-muted'}`}
              >
                {b.is_active !== false ? 'Активен' : 'Неактивен'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}

    {totalPages > 1 ? (
      <div className="flex items-center justify-center gap-3 mt-8">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Назад
        </Button>
        <span className="text-sm text-app-text-muted">
          {page} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Вперёд
        </Button>
      </div>
    ) : null}
  </>
)
