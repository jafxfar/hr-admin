import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationControlsProps {
  page: number
  totalPages: number
  total: number
  entityLabel?: string
  onPageChange: (page: number) => void
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  total,
  entityLabel = 'записей',
  onPageChange,
}) => {
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('ellipsis')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  if (totalPages <= 1 && total === 0) return null

  return (
    <div className="sticky bottom-0 z-20 pt-6 from-app-bg via-app-bg to-transparent">
      <div className="flex items-center justify-between bg-app-surface-0 px-4 py-6 rounded-full border border-app-border-accent brand-glow-sm">
        {/* Left: record count */}
        <div className="flex items-center gap-4 px-4">
          <span className="text-xs text-app-text-muted uppercase tracking-widest font-bold">
            Стр. {page} из {totalPages} · {total} {entityLabel}
          </span>
        </div>

        {/* Right: page buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-app-text-muted hover:text-app-text transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((p, idx) =>
              p === 'ellipsis' ? (
                <span key={`e-${idx}`} className="text-app-text-muted px-1 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors',
                    p === page
                      ? 'bg-(--theme-primary) text-(--on-primary) brand-glow-sm'
                      : 'text-app-text-muted hover:bg-[rgb(var(--theme-primary-rgb)/0.1)] hover:text-app-text',
                  )}
                >
                  {p}
                </button>
              ),
            )}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-app-text-muted hover:text-app-text transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
