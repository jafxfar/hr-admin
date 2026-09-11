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

const errorShadow = '0 0 0 2px rgb(var(--error) / 0.5)'

export function DarkTextarea({
    placeholder,
    value,
    onChange,
    rows = 4,
    hasError = false,
}: {
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    rows?: number
    hasError?: boolean
}) {
    const focusShadow = hasError
        ? errorShadow
        : '0 0 0 1px rgb(var(--theme-primary-rgb) / 0.4)'

    return (
        <textarea
            placeholder={placeholder}
            value={value ?? ''}
            rows={rows}
            onChange={onChange}
            className="placeholder:text-app-text-muted/70"
            style={{
                ...fieldStyle,
                resize: 'none',
                lineHeight: '1.6',
                boxShadow: hasError ? errorShadow : undefined,
            }}
            onFocus={(e) => {
                e.target.style.boxShadow = focusShadow
            }}
            onBlur={(e) => {
                e.target.style.boxShadow = hasError ? errorShadow : 'none'
            }}
        />
    )
}
