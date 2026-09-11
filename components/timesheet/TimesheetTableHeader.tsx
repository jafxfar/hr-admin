import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

interface TimesheetTableHeaderProps {
  days: Day[]
}

export const TimesheetTableHeader: React.FC<TimesheetTableHeaderProps> = ({ days }) => {
  return (
    <thead className="bg-[#F9FAFB] border-b border-[#E5E5E7]">
      <tr className='h-[60px]'>
        <th className="px-4 py-3 text-left border-r border-[#E5E5E7]">
          <Checkbox />
        </th>
          <th className="px-4 py-3 text-left border-b border-gray-200 min-w-[280px]">
          <div className="text-[12px] font-medium text-[#6B7280]">Имя сотрудника</div>
        </th>
        <th className="px-4 py-3 text-center min-w-[60px] border-r border-[#E5E5E7]">
          <div className="text-[12px] font-medium text-[#6B7280]">Дни</div>
        </th>
        <th className="px-4 py-3 text-center min-w-[60px] border-r border-[#E5E5E7]">
          <div className="text-[12px] font-medium text-[#6B7280]">Часы</div>
        </th>
        <th className="px-4 py-3 text-center min-w-[70px] border-r border-[#E5E5E7]">
          <div className="text-[12px] font-medium text-[#6B7280]">Минуты</div>
        </th>
        {days.map((day) => (
          <th 
            key={day.day} 
            className={`px-2 py-3 text-center min-w-[40px] ${day.isWeekend ? 'bg-red-50' : ''}`}
          >
            <div className={`text-[12px] font-medium ${day.isWeekend ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
              {day.day}
            </div>
            <div className="text-xs font-medium text-[#9CA3AF]">
              {day.dayName}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}
