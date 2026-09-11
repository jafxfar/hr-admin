'use client'

import { Plus } from 'lucide-react'

interface VacancyApplicationBoardAddColumnProps {
  onClick: () => void
  disabled?: boolean
}

export const VacancyApplicationBoardAddColumn = ({
  onClick,
  disabled = false,
}: VacancyApplicationBoardAddColumnProps) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Добавить колонку"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-2xl border border-dashed border-app-border-accent/50 bg-app-surface-0 text-app-text-muted transition-colors hover:border-brand-accent/50 hover:bg-brand-accent/10 hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 disabled:pointer-events-none disabled:opacity-50"
    >
      <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
    </button>
  )
}
