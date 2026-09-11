'use client'

import { HRLayout } from '@/components/hr-layout'
import { AttendanceDataStates } from '@/components/attendance/attendance-data-states'
import { TimesheetFilters, TimesheetTable } from '@/components/timesheet'
import { useTimesheetByDepartments, useTimesheetByDepartmentId } from '@/hooks/use-timesheet'
import { useDepartmentMonthPage } from '@/hooks/use-department-month-page'
import { mapTimesheetEmployeeToTableRow } from '@/lib/timesheet-table-map'

export default function TimesheetPage() {
  const view = useDepartmentMonthPage({
    useByDepartments: useTimesheetByDepartments,
    useByDepartmentId: useTimesheetByDepartmentId,
    mapEmployee: mapTimesheetEmployeeToTableRow,
    dayNameStyle: 'title',
  })

  return (
    <HRLayout
      title="Табель учета времени"
      topActions={
        <TimesheetFilters
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
      <div className="admin-content-inset space-y-3">
        <AttendanceDataStates
          isLoading={view.isLoading}
          isError={view.isError}
          error={view.error}
          errorLabel="Ошибка загрузки табеля. Проверьте соединение с сервером."
        >
          <TimesheetTable
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
