const initialsFromFullName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
        const a = parts[0]?.[0] ?? ''
        const b = parts[1]?.[0] ?? ''
        return (a + b).toUpperCase()
    }
    if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0]?.[0] ?? '?').toUpperCase()
}

export const getInitialsFromName = (
    fullName?: string | null,
    firstName?: string | null,
    lastName?: string | null,
): string => {
    if (fullName?.trim()) return initialsFromFullName(fullName)
    const fn = firstName?.trim() ?? ''
    const ln = lastName?.trim() ?? ''
    const combined = [fn, ln].filter(Boolean).join(' ')
    if (combined) return initialsFromFullName(combined)
    return '?'
}
