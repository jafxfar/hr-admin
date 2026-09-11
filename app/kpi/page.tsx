'use client'

import { HRLayout } from '@/components/hr-layout'
import { AttendanceDataStates } from '@/components/attendance/attendance-data-states'
import { KPIFilters, KPITable } from '@/components/kpi'
import { useKPIByDepartments, useKPIByDepartmentId } from '@/hooks/use-kpi'
import { useDepartmentMonthPage } from '@/hooks/use-department-month-page'
import { mapKpiEmployeeToTableRow } from '@/lib/kpi-table-map'

const KPIDashboard = () => {
  const view = useDepartmentMonthPage({
    useByDepartments: useKPIByDepartments,
    useByDepartmentId: useKPIByDepartmentId,
    mapEmployee: mapKpiEmployeeToTableRow,
  })

  return (
    <HRLayout
      title="KPI"
      topActions={
        <KPIFilters
          searchQuery={view.searchQuery}
          setSearchQuery={view.setSearchQuery}
          selectedDepartmentId={view.selectedDepartmentId}
          setSelectedDepartmentId={view.setSelectedDepartmentId}
          departmentOptions={view.departmentOptions}
          currentMonth={view.currentMonth}
          onPrevMonth={view.handlePrevMonth}
          onNextMonth={view.handleNextMonth}
          monthNames={[...view.monthNames]}
        />
      }
    >
      <div className="admin-content-inset">
        <AttendanceDataStates
          isLoading={view.isLoading}
          isError={view.isError}
          error={view.error}
          errorLabel="Ошибка загрузки KPI. Проверьте соединение с сервером."
        >
          <KPITable
            employees={view.employees}
            days={view.days}
            monthTitle={view.monthTitle}
            monthIndex={view.monthIndex}
            listKey={view.listKey}
          />
        </AttendanceDataStates>
      </div>
    </HRLayout>
  )
}

export default KPIDashboard
