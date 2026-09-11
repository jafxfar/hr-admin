'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { HRLayout } from '@/components/hr-layout'
import { ProfileForm, EmployeeFormProvider, useEmployeeForm, resolveRegisteredAndActualAddresses } from '@/components/employee-form'
import { useCreateEmployeeMutation } from '@/hooks/use-employees'
import { useToast } from '@/hooks/use-toast'
import { useEmployeeProgress } from '@/hooks/use-employee-progress'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { validateEmployeeCreate } from '@/components/employees/employee-edit-validation'
import { formatFieldError } from '@/lib/form-field-errors'
import { mutationOpts } from '@/lib/mutation-options'
import type { CreateEmployeeRequest } from '@/types/employees'
import { Info } from 'lucide-react'

function NewEmployeeContent() {
    const router = useRouter()
    const { formData, setFieldErrors, clearFieldErrors } = useEmployeeForm()
    const { mutate: createEmployee, isPending } = useCreateEmployeeMutation()
    const { toast } = useToast()
    const { data: settingsFeatures } = useSettingsFeatures()
    const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
    const { percent } = useEmployeeProgress(formData, branchesEnabled)

    const handleSave = () => {
        const errors = validateEmployeeCreate({ formData, branchesEnabled })

        if (errors.length > 0) {
            setFieldErrors(errors)
            toast({
                variant: 'destructive',
                title: 'Заполните обязательные поля',
                description: formatFieldError(errors[0]),
            })
            return
        }

        clearFieldErrors()
        const {
            educations,
            work_experiences,
            salaries,
            contracts,
            schedules,
            documents,
            contacts,
            residence_same_as_registered: _omitResidenceSame,
            ...baseFields
        } = formData

        const { registered_address, actual_address } = resolveRegisteredAndActualAddresses(formData)
        const innDigits = (formData.inn ?? '').replace(/\D/g, '')
        const hikvisionId = (formData.hikvision_id ?? '').trim()

        const payload: CreateEmployeeRequest = {
            ...baseFields,
            inn: innDigits || undefined,
            hikvision_id: hikvisionId || undefined,
            education: educations?.[0],
            work_experience: work_experiences?.[0],
            salary: salaries?.[0],
            contracts: contracts ?? [],
            documents: documents ?? [],
            schedules: schedules ?? [],
            contacts: contacts ?? [],
            registered_address,
            actual_address,
            ...(branchesEnabled && formData.branch_id
                ? { branch_id: formData.branch_id }
                : {}),
        }
        if (!branchesEnabled) {
            delete (payload as { branch_id?: number }).branch_id
        }

        createEmployee(
            payload,
            mutationOpts({
                meta: { successTitle: 'Сотрудник успешно создан' },
                onSuccess: () => {
                    router.push('/employees')
                },
            }),
        )
    }

    return (
        <HRLayout isProfile={true}>
            <div className="min-h-[calc(100dvh-64px)] w-full relative">
                <div className="max-w-6xl px-8 py-8 pb-32">
                    {/* Header */}
                    <div className="mb-12 relative">
                        <h2
                            className="text-6xl font-black tracking-tighter leading-tight"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--app-text)' }}
                        >
                            Создать
                            <br />
                            <span style={{ color: 'var(--brand-accent)' }}>Сотрудника</span>
                        </h2>
                        <div className="absolute top-0 right-0">
                            <div
                                className="flex items-center gap-4 p-4 rounded-3xl"
                                style={{ background: 'var(--app-surface-3)' }}
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                                    style={{ background: 'rgb(var(--theme-secondary-rgb) / 0.1)', color: 'var(--secondary)' }}
                                >
                                    <Info size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
                                        ID системы
                                    </p>
                                    <p className="text-lg font-bold text-app-text" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                        #AUTO
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-12" onSubmit={e => { e.preventDefault(); handleSave() }}>
                        <ProfileForm isNew />
                    </form>
                </div>

                {/* Sticky Action Bar */}
                <div
                    className="fixed bottom-6 right-6 left-6 lg:left-78 flex justify-between items-center px-6 py-4 z-40 border rounded-4xl"
                    style={{
                        background: 'var(--app-header-bg)',
                        backdropFilter: 'blur(24px)',
                        borderColor: 'var(--app-border)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="hidden lg:flex items-center gap-3">
                        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--app-text-muted)' }}>
                            Прогресс заполнения
                        </span>
                        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'var(--app-surface-2)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%`, background: 'var(--brand-accent)' }}
                            />
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--brand-accent)' }}>{percent}%</span>
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button
                            type="button"
                            className="flex-1 lg:flex-none px-10 py-3 rounded-full font-bold transition-all active:scale-95 text-app-text"
                            style={{ background: 'var(--app-surface-4)' }}
                            onClick={() => router.push('/employees')}
                        >
                            Отменить
                        </button>
                        <button
                            type="button"
                            className="flex-1 lg:flex-none px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all active:scale-95"
                            style={{
                                background: 'linear-gradient(to right, var(--brand-accent), var(--brand))',
                                color: 'var(--brand-accent-on-alt)',
                                boxShadow: '0 10px 30px -5px rgb(var(--theme-primary-rgb) / 0.4)',
                            }}
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </div>

                {/* Ambient */}
                <div className="fixed top-0 right-0 w-96 h-96 -z-10 pointer-events-none"
                    style={{ background: 'rgb(var(--theme-primary-rgb) / 0.04)', filter: 'blur(120px)' }} />
                <div className="fixed bottom-0 left-0 w-96 h-96 -z-10 pointer-events-none"
                    style={{ background: 'rgb(var(--theme-secondary-rgb) / 0.04)', filter: 'blur(120px)' }} />
            </div>
        </HRLayout>
    )
}

export default function NewEmployeePage() {
    return (
        <Suspense fallback={null}>
            <EmployeeFormProvider>
                <NewEmployeeContent />
            </EmployeeFormProvider>
        </Suspense>
    )
}
