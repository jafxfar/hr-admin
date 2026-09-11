'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X, Search, Loader2, ChevronDown } from 'lucide-react'
import { usePositions } from '@/hooks/use-positions'
import { Positions } from '@/types/positions'
import { cn } from '@/lib/utils'

interface PositionsMultiSelectProps {
  value: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  bordered?: boolean
}

const labelCls = 'block text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted mb-[8px]'

const triggerStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--app-surface-1)',
  border: 'none',
  borderRadius: 24,
  padding: '10px 16px',
  color: 'var(--app-text)',
  fontSize: 14,
  outline: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
  transition: 'box-shadow 0.2s',
  minHeight: 52,
}

export { labelCls as positionsLabelCls }

export function PositionsMultiSelect({
  value,
  onChange,
  placeholder = 'Выберите должности',
  className,
  disabled,
  bordered = false,
}: PositionsMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const { data, isFetching } = usePositions(search, 1, 20)
  const positions: Positions[] = data?.items ?? []

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const remove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== id))
  }

  // Keep a label cache so chips don't disappear when search changes
  const [labelCache, setLabelCache] = useState<Record<number, string>>({})
  useEffect(() => {
    if (positions.length > 0) {
      setLabelCache((prev) => {
        const next = { ...prev }
        positions.forEach((p) => { next[p.id] = p.title })
        return next
      })
    }
  }, [positions])

  const boxShadow = focused || open ? '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)' : 'none'

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => { setOpen((v) => !v); setFocused(true) }}
        style={{
          ...triggerStyle,
          border: bordered ? '1px solid var(--app-border-accent)' : triggerStyle.border,
          boxShadow,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {value.length === 0 ? (
          <span style={{ color: 'var(--app-text-muted)', flex: 1 }}>{placeholder}</span>
        ) : (
          <>
            {value.map((id) => (
              <span
                key={id}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgb(var(--theme-primary-rgb) / 0.12)', border: '1px solid rgb(var(--theme-primary-rgb) / 0.3)',
                  color: 'var(--brand-accent)', fontSize: 11, fontWeight: 700,
                  padding: '2px 10px 2px 8px', borderRadius: 99,
                }}
              >
                {labelCache[id] ?? `#${id}`}
                <X
                  size={11}
                  style={{ cursor: 'pointer', opacity: 0.8 }}
                  onClick={(e) => remove(id, e)}
                />
              </span>
            ))}
          </>
        )}
        <ChevronDown
          size={14}
          style={{ marginLeft: 'auto', color: 'var(--app-text-muted)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
            background: 'var(--app-surface-2)', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--app-surface-3)' }}>
            {isFetching
              ? <Loader2 size={13} style={{ color: 'var(--app-text-muted)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              : <Search size={13} style={{ color: 'var(--app-text-muted)', flexShrink: 0 }} />
            }
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск должности..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--app-text)', fontSize: 13 }}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
            {positions.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--app-text-muted)', fontSize: 12 }}>
                {isFetching ? 'Загрузка...' : 'Должности не найдены'}
              </div>
            ) : (
              positions.map((pos) => {
                const selected = value.includes(pos.id)
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => toggle(pos.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px', background: selected ? 'rgb(var(--theme-primary-rgb) / 0.08)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      color: selected ? 'var(--app-text)' : 'var(--app-text-muted)',
                      fontSize: 13, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--app-surface-3)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = selected ? 'rgb(var(--theme-primary-rgb) / 0.08)' : 'transparent' }}
                  >
                    <span style={{
                      width: 16, height: 16, flexShrink: 0, borderRadius: 4, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: selected ? 'var(--brand-accent)' : 'transparent',
                      border: selected ? '1.5px solid var(--brand-accent)' : '1.5px solid var(--app-border-accent)',
                    }}>
                      {selected && <Check size={10} color="var(--brand-accent-on)" strokeWidth={3} />}
                    </span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selected ? 700 : 400 }}>
                      {pos.title}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          {/* Footer */}
          {value.length > 0 && (
            <div style={{ borderTop: '1px solid var(--app-surface-3)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>
                Выбрано: <span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>{value.length}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--app-text-muted)', fontSize: 11 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--app-text-muted)')}
              >
                Сбросить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
