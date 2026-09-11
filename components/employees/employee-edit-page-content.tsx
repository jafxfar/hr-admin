'use client'

import { useParams } from 'next/navigation'
import { HRLayout } from '@/components/hr-layout'
import { EmployeeFormProvider } from '@/components/employee-form'
import { useEmployee, useEmployeePositionChangeReasons } from '@/hooks/use-employees'
import { isForbiddenError } from '@/lib/query-error'
import { EmployeeEditInner } from './employee-edit-inner'

const buildFullName = (employee: NonNullable<ReturnType<typeof useEmployee>['data']>) => {
  const parts = [
    employee.properties?.last_name,
    employee.properties?.first_name,
    employee.properties?.middle_name,
  ].filter(Boolean)
  if (parts.length > 0) {
    return parts.join(' ')
  }
  return employee.email?.trim() || 'Сотрудник'
}

export const EmployeeEditPageContent = () => {
  const { id } = useParams<{ id: string }>()
  const employeeId = Number(id)
  const { data: employee, isLoading, isError, error } = useEmployee(employeeId)
  const { data: positionHistory = [] } = useEmployeePositionChangeReasons(employeeId)

  if (isLoading) {
    return (
      <HRLayout isProfile={true}>
        <div className="flex items-center justify-center h-64" style={{ color: 'var(--app-text-muted)' }}>
          Загрузка...
        </div>
      </HRLayout>
    )
  }

  if (isError || !employee) {
    return (
      <HRLayout isProfile={true}>
        <EmployeeEditErrorState error={error} />
      </HRLayout>
    )
  }

  return (
    <EmployeeFormProvider initialEmployee={employee}>
      <EmployeeEditInner
        employeeId={employeeId}
        fullName={buildFullName(employee)}
        positionHistory={positionHistory}
      />
    </EmployeeFormProvider>
  )
}

const EmployeeEditErrorState = ({ error }: { error: unknown }) => (
  <div className="flex items-center justify-center h-64" style={{ color: 'var(--app-text-muted)' }}>
    {isForbiddenError(error) ? 'Нет доступа' : 'Не удалось загрузить сотрудника'}
  </div>
)
