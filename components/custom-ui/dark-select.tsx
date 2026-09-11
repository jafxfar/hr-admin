const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--app-surface-1)',
    border: '1px solid var(--app-border-accent)',
    borderRadius: '24px',
    padding: '14px 16px',
    color: 'var(--app-text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'box-shadow 0.2s',
}

export function DarkSelect({ value, onChange, options, placeholder }: {
    value?: string | number; onChange?: (val: string) => void
    options: { value: string; label: string }[]; placeholder?: string
}) {
    return (
        <div style={{ position: 'relative' }}>
            <select value={value ?? ''} onChange={e => onChange?.(e.target.value)}
                style={{ ...fieldStyle, appearance: 'none' as any, cursor: 'pointer', paddingRight: 40 }}
                onFocus={e => (e.target.style.boxShadow = '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)')}
                onBlur={e => (e.target.style.boxShadow = 'none')}>
                {placeholder && <option value="" disabled style={{ color: 'var(--app-text-muted)' }}>{placeholder}</option>}
                {options.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--app-surface-2)' }}>{o.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--app-text-muted)', pointerEvents: 'none', fontSize: 12 }}>▼</span>
        </div>
    )
}