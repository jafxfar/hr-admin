'use client'

export const PROFILE_EMPTY = '—'

export function InfoLine({ label, value }: { label: string; value: string }) {
    const display = value.trim() ? value : PROFILE_EMPTY
    return (
        <div className="flex flex-col gap-1 border-b border-app-border-accent/30 py-3 first:pt-1 last:border-b-0 last:pb-1">
            <span className="text-xs font-black uppercase tracking-widest text-app-text-muted">
                {label}
            </span>
            <span className="text-[15px] font-medium leading-snug text-app-text">{display}</span>
        </div>
    )
}

export function EmployeeProfileInfoGrid({
    items,
    columns = 1,
}: {
    items: { label: string; value: string }[]
    columns?: 1 | 2
}) {
    return (
        <div
            className={`rounded-3xl border border-app-border-accent/50 bg-app-surface-2/40 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${
                columns === 2 ? 'md:columns-2 md:gap-x-8' : ''
            }`}
        >
            {items.map((item) => (
                <InfoLine key={item.label} label={item.label} value={item.value} />
            ))}
        </div>
    )
}
