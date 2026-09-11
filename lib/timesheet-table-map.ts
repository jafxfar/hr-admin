import type { TimesheetEmployee } from '@/api/timesheet'

export interface TimesheetTableEmployee {
  id: number
  name: string
  position: string
  days: number
  hours: number
  minutes: number
  avatar?: string
  dailyHours: { [key: string]: number }
}

const calcHours = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 0
  const [h1, m1] = checkIn.split(':').map(Number)
  const [h2, m2] = checkOut.split(':').map(Number)
  const minutes = h2 * 60 + m2 - (h1 * 60 + m1)
  return Math.max(0, minutes / 60)
}

export const mapTimesheetEmployeeToTableRow = (
  emp: TimesheetEmployee,
): TimesheetTableEmployee => {
  const dailyHours: { [key: string]: number } = {}
  let totalMinutes = 0
  let workedDays = 0

  for (const ts of emp.timesheets) {
    const day = new Date(ts.work_date).getDate()
    const h = calcHours(ts.check_in, ts.check_out)
    if (h > 0 || ts.status === 'present') {
      dailyHours[day] = h
      totalMinutes += h * 60
      workedDays++
    }
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  const displayName = emp.email?.trim() || `Сотрудник #${emp.user_id}`

  return {
    id: emp.user_id,
    name: displayName,
    position: '',
    days: workedDays,
    hours,
    minutes,
    dailyHours,
  }
}
