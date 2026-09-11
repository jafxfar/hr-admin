import type { ReactNode } from 'react'
import { Plus, SquareDashed } from 'lucide-react'

export function PanelCard({
    title,
    icon,
    onAdd,
    children,
    emptyLabel,
}: {
    title: string
    icon?: ReactNode
    onAdd: () => void
    children?: ReactNode
    emptyLabel: string
}) {
    return (
        <div style={{ background: 'var(--app-surface-0)', borderRadius: 32, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 180, border: '1px solid var(--app-border)', boxShadow: '0 10px 24px -20px rgba(0,0,0,0.45)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {icon ? (
                        <span style={{ color: 'var(--app-text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                            {icon}
                        </span>
                    ) : null}
                    <span style={{ color: 'var(--app-text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16 }}>
                        {title}
                    </span>
                </div>
                <button type="button" onClick={onAdd}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--app-surface-1)', border: '1px solid rgb(var(--theme-primary-rgb) / 0.2)', color: 'var(--brand-accent)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, transition: 'background 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-accent)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--app-surface-1)')}
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {children ?? (
                    <div className='bg-app-surface-1' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 80, border: '1px dashed var(--app-surface-4)', borderRadius: 16, gap: 8 }}>
                        <SquareDashed size={20} className="text-app-border-accent" />
                        <span style={{ color: 'var(--app-border-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{emptyLabel}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
