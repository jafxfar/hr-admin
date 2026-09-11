'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { HRLayout } from '@/components/hr-layout'
import { ProfileForm, EmployeeFormProvider } from '@/components/employee-form'
import { useMe } from '@/hooks/use-employees'
import { Info } from 'lucide-react'

function ProfilePageContent() {
    const [activeTab, setActiveTab] = useState<'profile' | 'positions' | 'documents'>('profile')
    const router = useRouter()
    const { data: employee, isLoading } = useMe()

    const tabs = [
        { id: 'profile', label: 'Анкета' },
        { id: 'positions', label: 'Позиции' },
        { id: 'documents', label: 'Документы' },
    ] as const

    if (isLoading) {
        return (
            <HRLayout isProfile={true}>
                <div className="flex items-center justify-center h-64" style={{ color: 'var(--app-text-muted)' }}>
                    Загрузка...
                </div>
            </HRLayout>
        )
    }

    const fullName = employee
        ? [employee.properties?.last_name, employee.properties?.first_name, employee.properties?.middle_name]
            .filter(Boolean)
            .join(' ')
        : 'Профиль'

    return (
        <EmployeeFormProvider initialEmployee={employee}>
            <HRLayout isProfile={true}>
                <div className="min-h-[calc(100dvh-64px)] w-full relative">
                    <div className="max-w-6xl px-8 py-8 pb-32">

                        {/* Editorial Header */}
                        <div className="mb-12 relative">
                            <h2
                                className="text-6xl font-black tracking-tighter leading-tight"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--app-text)' }}
                            >
                                Мой
                                <br />
                                <span style={{ color: 'var(--brand-accent)' }}>{fullName}</span>
                            </h2>
                            <div className="absolute top-0 right-0">
                                <div
                                    className="flex items-center gap-4 p-4"
                                    style={{ background: 'var(--app-surface-3)', borderRadius: '24px' }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                                        style={{ background: 'rgb(var(--theme-secondary-rgb) / 0.1)', color: 'var(--secondary)' }}
                                    >
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <p
                                            className="text-xs uppercase tracking-widest"
                                            style={{ color: 'var(--secondary)' }}
                                        >
                                            Профиль
                                        </p>
                                        <p
                                            className="text-lg font-bold text-app-text"
                                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                                        >
                                            #{employee?.id ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div
                            className="flex gap-1 mb-10"
                            style={{ background: 'var(--app-surface-2)', borderRadius: '24px', padding: '4px', width: 'fit-content' }}
                        >
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className="px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all"
                                    style={{
                                        borderRadius: '20px',
                                        background: activeTab === tab.id ? 'var(--brand-accent)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--brand-accent-on-alt)' : 'var(--app-text-muted)',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div>
                            {activeTab === 'profile' && <ProfileForm />}
                            {activeTab === 'positions' && (
                                <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Раздел в разработке</p>
                            )}
                            {activeTab === 'documents' && (
                                <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>Раздел в разработке</p>
                            )}
                        </div>
                    </div>

                    {/* Sticky Action Bar */}
                    <div
                        className="fixed bottom-6 right-6 left-6 flex justify-between items-center px-6 py-4 z-40 border"
                        style={{
                            borderRadius: '32px',
                            background: 'rgba(28,27,27,0.7)',
                            backdropFilter: 'blur(24px)',
                            borderColor: 'rgba(255,255,255,0.05)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div className="hidden lg:flex items-center gap-3">
                            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--app-text-muted)' }}>
                                Мой профиль
                            </span>
                            <div
                                className="w-48 h-1 rounded-full overflow-hidden"
                                style={{ background: 'var(--app-surface-0)' }}
                            >
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: '100%', background: 'var(--brand-accent)' }}
                                />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'var(--brand-accent)' }}>100%</span>
                        </div>
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <button
                                type="button"
                                className="flex-1 lg:flex-none px-10 py-3 font-bold transition-all active:scale-95 text-app-text"
                                style={{ background: 'var(--app-surface-4)', borderRadius: '9999px' }}
                                onClick={() => router.back()}
                            >
                                Отменить
                            </button>
                            <button
                                type="button"
                                className="flex-1 lg:flex-none px-12 py-3 font-black uppercase tracking-widest transition-all active:scale-95"
                                style={{
                                    borderRadius: '9999px',
                                    background: 'linear-gradient(to right, var(--brand-accent), var(--brand))',
                                    color: 'var(--brand-accent-on-alt)',
                                    boxShadow: '0 10px 30px -5px rgb(var(--theme-primary-rgb) / 0.4)',
                                }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>

                    {/* Decorative ambient light */}
                    <div
                        className="fixed top-0 right-0 w-96 h-96 -z-10 pointer-events-none"
                        style={{ background: 'rgb(var(--theme-primary-rgb) / 0.04)', filter: 'blur(120px)' }}
                    />
                    <div
                        className="fixed bottom-0 left-0 w-96 h-96 -z-10 pointer-events-none"
                        style={{ background: 'rgb(var(--theme-secondary-rgb) / 0.04)', filter: 'blur(120px)' }}
                    />
                </div>
            </HRLayout>
        </EmployeeFormProvider>
    )
}

export default function ProfilePage() {
    return (
        <Suspense fallback={null}>
            <ProfilePageContent />
        </Suspense>
    )
}
