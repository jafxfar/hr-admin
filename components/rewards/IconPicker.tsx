'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { getIconByName, POPULAR_ICON_NAMES, ALL_ICON_NAMES } from '@/lib/lucide-icons'

interface IconPickerProps {
  value: string | null
  onChange: (iconName: string) => void
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState('')

  // Filtered list based on query; fall back to popular icons when empty
  const displayedIcons = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = !q
      ? POPULAR_ICON_NAMES
      : ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(q)).slice(0, 60)
    if (value && !base.includes(value)) return [value, ...base]
    return base
  }, [query, value])

  const handleClearQuery = useCallback(() => setQuery(''), [])

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative border border-app-border-accent rounded-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти иконку (например: trophy, star, flame...)"
          className="w-full bg-app-surface-1 border border-app-border-accent rounded-2xl pl-11 pr-10 py-3 text-sm text-app-text placeholder-app-text-muted/40 focus:outline-none focus:ring-1 focus:ring-brand-accent/30 transition-all"
        />
        {query && (
          <button
            onClick={handleClearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-app-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-6 gap-2 max-h-52 overflow-y-auto pr-1">
        {displayedIcons.length === 0 ? (
          <p className="col-span-6 text-center text-xs text-app-text-muted py-4">
            Иконки не найдены
          </p>
        ) : (
          displayedIcons.map((name) => {
            const Icon = getIconByName(name)
            if (!Icon) return null
            const isSelected = value === name
            return (
              <button
                key={name}
                title={name}
                type="button"
                onClick={() => onChange(name)}
                className={`aspect-square flex items-center justify-center rounded-xl transition-all ${
                  isSelected
                    ? 'bg-brand-accent text-brand-accent-on shadow-[0_0_12px_rgb(var(--theme-primary-rgb) / 0.35)]'
                    : 'bg-app-surface-0 text-app-text-muted hover:bg-app-surface-2 hover:text-app-text'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })
        )}
      </div>

      {/* Selected label */}
      {value && (
        <p className="text-[0.65rem] text-app-text-muted uppercase tracking-widest">
          Выбрано:{' '}
          <span className="text-brand-accent font-bold">{value}</span>
        </p>
      )}

      {!query && (
        <p className="text-xs font-medium text-app-text-muted/50">
          Популярные иконки. Введите название для поиска среди всех {ALL_ICON_NAMES.length}+.
        </p>
      )}
    </div>
  )
}
