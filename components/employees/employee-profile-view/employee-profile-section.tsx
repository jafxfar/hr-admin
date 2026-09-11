'use client'

import type { ReactNode } from 'react'

type EmployeeProfileSectionProps = {
    title: string
    description?: string
    children?: ReactNode
    emptyMessage?: string
    isEmpty?: boolean
    className?: string
}

export function EmployeeProfileSection({
    title,
    description,
    children,
    emptyMessage = 'Нет данных',
    isEmpty = false,
    className = '',
}: EmployeeProfileSectionProps) {
    return (
        <section className={className}>
            <div className="mb-8">
                <h2 className="relative inline-block pb-2 text-3xl font-bold tracking-tight text-app-text after:absolute after:bottom-0 after:left-0 after:h-1 after:w-10 after:rounded-full after:bg-brand-accent">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-3 max-w-2xl text-sm text-app-text-muted">{description}</p>
                ) : null}
            </div>
            {isEmpty ? (
                <p className="rounded-2xl border border-dashed border-app-border-accent/40 px-4 py-6 text-center text-sm text-app-text-muted">
                    {emptyMessage}
                </p>
            ) : (
                children
            )}
        </section>
    )
}
