export function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--app-text)' }}
            >
                {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                {description}
            </p>
        </div>
    )
}