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

type DarkInputProps = {
    placeholder?: string
    type?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void
    min?: number | string
    max?: number | string
    suffix?: string
    disabled?: boolean
    name?: string
    id?: string
    list?: string
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
    required?: boolean
    readOnly?: boolean
    hasError?: boolean
}

const sanitizeIsoDateInput = (raw: string) => {
    const cleaned = raw.replace(/[^\d-]/g, '').slice(0, 10)

    if (cleaned.length !== 10) return cleaned
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return ''

    const d = new Date(cleaned)
    if (Number.isNaN(d.getTime())) return ''

    const [y, m, day] = cleaned.split('-').map(Number)
    const utc = new Date(Date.UTC(y, m - 1, day))
    if (
        utc.getUTCFullYear() !== y ||
        utc.getUTCMonth() !== m - 1 ||
        utc.getUTCDate() !== day
    ) {
        return ''
    }

    return cleaned
}

const isAllowedDateKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey) return true

    const allowed = new Set([
        'Backspace',
        'Delete',
        'Tab',
        'Enter',
        'Escape',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
    ])
    if (allowed.has(e.key)) return true

    if (/^\d$/.test(e.key)) return true
    if (e.key === '-') return true

    return false
}

export function DarkInput({
    placeholder,
    type = 'text',
    value,
    onChange,
    onKeyDown,
    onPaste,
    min,
    max,
    suffix,
    disabled,
    name,
    id,
    list,
    autoComplete,
    inputMode,
    required,
    readOnly,
    hasError = false,
}: DarkInputProps) {
    const errorShadow = '0 0 0 2px rgb(239 68 68 / 0.55)'
    const focusShadow = hasError
        ? errorShadow
        : '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)'
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'date') {
            const nextValue = sanitizeIsoDateInput(e.currentTarget.value)
            if (nextValue !== e.currentTarget.value) {
                e.currentTarget.value = nextValue
            }
        }

        onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === 'date' && !isAllowedDateKey(e)) {
            e.preventDefault()
            return
        }
        onKeyDown?.(e)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (type !== 'date') {
            onPaste?.(e)
            return
        }

        const pasted = e.clipboardData.getData('text')
        const sanitized = sanitizeIsoDateInput(pasted)

        if (sanitized === pasted) {
            onPaste?.(e)
            return
        }

        e.preventDefault()
        const el = e.currentTarget
        el.value = sanitized
        el.dispatchEvent(new Event('input', { bubbles: true }))
        onPaste?.(e)
    }

    return (
        <div style={{ position: 'relative' }}>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value ?? ''}
                min={min}
                max={max}
                list={list}
                autoComplete={autoComplete}
                inputMode={inputMode}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="placeholder:text-app-text-muted/70"
                style={{
                    ...fieldStyle,
                    paddingRight: suffix ? 72 : 16,
                    boxShadow: hasError ? errorShadow : undefined,
                }}
                onFocus={e => (e.target.style.boxShadow = focusShadow)}
                onBlur={e => {
                    e.target.style.boxShadow = hasError ? errorShadow : 'none'
                }} />
            {suffix && (
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.06em', background: 'var(--app-surface-2)', padding: '3px 8px', borderRadius: 8 }}>
                    {suffix}
                </span>
            )}
        </div>
    )
}