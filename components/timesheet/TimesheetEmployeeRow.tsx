import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Employee {
  id: number
  name: string
  position: string
  days: number
  hours: number
  minutes: number
  avatar?: string
  dailyHours: { [key: string]: number }
}

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

interface TimesheetEmployeeRowProps {
  employee: Employee
  days: Day[]
}

export const TimesheetEmployeeRow: React.FC<TimesheetEmployeeRowProps> = ({ employee, days }) => {
  return (
    <>
      {/* Fixed columns */}
      <td className="px-4 py-3 border-r border-[#E5E5E7]">
        <Checkbox />
      </td>
      <td className="px-4 py-3 border-r border-[#E5E5E7]">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-[#E5E7EB] text-[#6B7280] text-[12px]">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-app-text">{employee.name}</span>
            <span className="text-[12px] text-[#6B7280]">{employee.position}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center text-[14px] text-app-text border-r border-[#E5E5E7]">{employee.days}</td>
      <td className="px-4 py-3 text-center text-[14px] text-app-text border-r border-[#E5E5E7]">{employee.hours}</td>
      <td className="px-4 py-3 text-center text-[14px] text-app-text border-r border-[#E5E5E7]">{employee.minutes}</td>
      
      {/* Scrollable day columns */}
      {days.map((day) => {
        const dailyHours = employee.dailyHours[day.day] || 0
        const isWorked = dailyHours > 0
        return (
          <td 
            key={day.day} 
            className={`px-2 py-4 text-center text-[12px] ${
              day.isWeekend 
                ? 'bg-red-50 text-[#EF4444]' 
                : isWorked 
                  ? 'bg-brand-accent-dim text-app-text font-medium' 
                  : 'text-[#9CA3AF]'
            }`}
          >
            {isWorked ? dailyHours : day.isWeekend ? '' : '0'}
          </td>
        )
      })}
    </>
  )
}
