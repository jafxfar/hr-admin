'use client'

import { BadgeDollarSign, BriefcaseBusiness, CalendarClock, FileSignature } from 'lucide-react'

import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import type { WorkExperience } from '@/types/workExperience'
import type { Contract } from '@/types/contracts'
import { PanelCard, SectionHeader } from '@/components/custom-ui'
import { SalaryChip, WorkExpChip, ScheduleChip, ContractChip } from '../../EmployeeChips'
import { useEmployeeForm } from '../../EmployeeFormContext'
import type { DeleteKind } from '../types'

export function WorkConditionsSection({
    schedules,
    salaries,
    workExperiences,
    contracts,
    onAddClick,
    onRequestDelete,
    onRequestEdit,
}: {
    schedules: Schedule[]
    salaries: Salary[]
    workExperiences: WorkExperience[]
    contracts: Contract[]
    onAddClick: (kind: Exclude<DeleteKind, 'education' | 'document'>) => void
    onRequestDelete: (kind: DeleteKind, index: number) => void
    onRequestEdit: (kind: DeleteKind, index: number) => void
}) {
    const { hasRowError } = useEmployeeForm()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <SectionHeader title="Условия работы" description="График, зарплата, опыт и контракты сотрудника." />

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <PanelCard
                    title="График работы *"
                    icon={<CalendarClock size={18} />}
                    onAdd={() => onAddClick('schedule')}
                    emptyLabel="График не задан"
                >
                    {schedules.length > 0 ? (
                        <div>
                            {schedules.map((s, i) => (
                                <ScheduleChip
                                    key={i}
                                    s={s}
                                    hasError={hasRowError('schedule', i + 1)}
                                    onRemove={() => onRequestDelete('schedule', i)}
                                    onView={() => onRequestEdit('schedule', i)}
                                />
                            ))}
                        </div>
                    ) : undefined}
                </PanelCard>

                <PanelCard
                    title="История зарплаты"
                    icon={<BadgeDollarSign size={18} />}
                    onAdd={() => onAddClick('salary')}
                    emptyLabel="Зарплата не задана"
                >
                    {salaries.length > 0 ? (
                        <div>
                            {salaries.map((s, i) => (
                                <SalaryChip
                                    key={i}
                                    sal={s}
                                    hasError={hasRowError('salary', i + 1)}
                                    onRemove={() => onRequestDelete('salary', i)}
                                    onView={() => onRequestEdit('salary', i)}
                                />
                            ))}
                        </div>
                    ) : undefined}
                </PanelCard>

                <PanelCard
                    title="Опыт работы"
                    icon={<BriefcaseBusiness size={18} />}
                    onAdd={() => onAddClick('work')}
                    emptyLabel="Опыт не добавлен"
                >
                    {workExperiences.length > 0 ? (
                        <div>
                            {workExperiences.map((w, i) => (
                                <WorkExpChip
                                    key={i}
                                    exp={w}
                                    hasError={hasRowError('work', i + 1)}
                                    onRemove={() => onRequestDelete('work', i)}
                                    onView={() => onRequestEdit('work', i)}
                                />
                            ))}
                        </div>
                    ) : undefined}
                </PanelCard>

                <PanelCard
                    title="Контракты"
                    icon={<FileSignature size={18} />}
                    onAdd={() => onAddClick('contract')}
                    emptyLabel="Контракты не заданы"
                >
                    {contracts.length > 0 ? (
                        <div>
                            {contracts.map((c, i) => (
                                <ContractChip
                                    key={i}
                                    c={c}
                                    hasError={hasRowError('contract', i + 1)}
                                    onRemove={() => onRequestDelete('contract', i)}
                                    onView={() => onRequestEdit('contract', i)}
                                />
                            ))}
                        </div>
                    ) : undefined}
                </PanelCard>
            </div>
        </div>
    )
}

