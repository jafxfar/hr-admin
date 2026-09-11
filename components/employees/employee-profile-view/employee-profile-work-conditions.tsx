'use client'

import type { Employee } from '@/types/employees'
import {
    ReadonlyContractChip,
    ReadonlySalaryChip,
    ReadonlyScheduleChip,
} from './employee-profile-readonly-chips'
import { EmployeeProfileSection } from './employee-profile-section'

export function EmployeeProfileWorkConditions({ employee }: { employee: Employee }) {
    const schedules = employee.schedules ?? []
    const salaries = employee.salaries ?? employee.salary ?? []
    const contracts = employee.contracts ?? []

    const isEmpty = schedules.length === 0 && salaries.length === 0 && contracts.length === 0

    return (
        <EmployeeProfileSection
            title="Условия работы"
            description="Графики, зарплата и контракты."
            isEmpty={isEmpty}
            emptyMessage="Условия работы не заданы."
        >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        Графики работы
                    </h3>
                    {schedules.length > 0 ? (
                        schedules.map((schedule, index) => (
                            <ReadonlyScheduleChip key={schedule.id ?? index} schedule={schedule} />
                        ))
                    ) : (
                        <p className="text-sm text-app-text-muted">Нет записей</p>
                    )}
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        История зарплаты
                    </h3>
                    {salaries.length > 0 ? (
                        salaries.map((salary, index) => (
                            <ReadonlySalaryChip key={salary.id ?? index} salary={salary} />
                        ))
                    ) : (
                        <p className="text-sm text-app-text-muted">Нет записей</p>
                    )}
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        Контракты
                    </h3>
                    {contracts.length > 0 ? (
                        contracts.map((contract, index) => (
                            <ReadonlyContractChip key={contract.id ?? index} contract={contract} />
                        ))
                    ) : (
                        <p className="text-sm text-app-text-muted">Нет записей</p>
                    )}
                </div>
            </div>
        </EmployeeProfileSection>
    )
}
