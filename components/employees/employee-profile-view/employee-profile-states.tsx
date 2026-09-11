'use client'

import Link from 'next/link'
import { ArrowLeft, Building2, Loader2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmployeeProfileBackLink() {
    return (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
            >
                <Link href="/employees" className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Назад к сотрудникам
                </Link>
            </Button>
        </div>
    )
}

export function EmployeeProfileEditButton({ employeeId }: { employeeId: number }) {
    return (
        <Button
            asChild
            size="sm"
            className="rounded-full bg-brand-accent text-brand-accent-on hover:bg-brand-accent/90"
        >
            <Link href={`/employees/${employeeId}`} className="inline-flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Редактировать
            </Link>
        </Button>
    )
}

export function EmployeeProfileLoading() {
    return (
        <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
    )
}

export function EmployeeProfileError({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/10">
                <Building2 className="h-9 w-9 text-brand-accent/60" />
            </div>
            <p className="mb-6 text-app-text-muted">Не удалось загрузить профиль сотрудника</p>
            <Button
                type="button"
                onClick={onBack}
                className="rounded-full bg-brand-accent text-brand-accent-on hover:bg-brand-accent/90"
            >
                К списку сотрудников
            </Button>
        </div>
    )
}

export function EmployeeProfilePageHeader({
    employeeId,
    onBack,
}: {
    employeeId: number
    onBack: () => void
}) {
    return (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
            >
                <span className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Назад к сотрудникам
                </span>
            </Button>
            <EmployeeProfileEditButton employeeId={employeeId} />
        </div>
    )
}
