export const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--app-text-muted)',
    marginBottom: '8px',
}

export const sectionCardStyle: React.CSSProperties = {
    background: 'var(--app-surface-0)',
    borderRadius: '32px',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
}

/** Более заметная граница полей на белых карточках формы сотрудника (без фокуса). */
export const employeeFormFieldsScopeStyle: React.CSSProperties = {
    ['--app-border-accent' as string]: 'color-mix(in srgb, var(--app-text) 22%, transparent)',
}

