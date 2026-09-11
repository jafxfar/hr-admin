import React from 'react'

interface Employee {
  id: number
  name: string
  position: string
  avatar?: string
  kpi: number
  bonus: number
  dailyKpi: { [key: string]: number }
}

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

interface KPIEmployeeRowProps {
  employee: Employee
  days: Day[]
}

export const KPIEmployeeRow: React.FC<KPIEmployeeRowProps> = ({ employee, days }) => {
  return (
    <>
      {/* Fixed Left Section - Employee Info */}
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <input type="checkbox" className="rounded border-gray-300" />
        </td>
        <td className="px-2 py-3 min-w-[240px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
              {employee.id === 2 && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                  J
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">{employee.name}</div>
              <div className="text-xs text-gray-500">{employee.position}</div>
            </div>
          </div>
        </td>
        <td className="px-2 py-3 text-center text-sm text-gray-700">
          {employee.kpi.toFixed(2)}
        </td>
        <td className="px-2 py-3 text-center text-sm text-gray-700">
          {employee.bonus}
        </td>
      </tr>

      {/* Scrollable Right Section - Daily KPI */}
      <tr className="hover:bg-gray-50">
        {days.map((day) => (
          <td
            key={day.day}
            className={`px-1 py-5 text-center text-sm ${
              day.isWeekend ? 'bg-red-50' : ''
            }`}
          >
            {employee.dailyKpi[day.day] ? (
              <span className="text-gray-700">{employee.dailyKpi[day.day].toFixed(2)}</span>
            ) : (
              <span className="text-gray-300">-</span>
            )}
          </td>
        ))}
      </tr>
    </>
  )
}
