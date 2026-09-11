import React from 'react'
import { ChevronDown } from 'lucide-react'

interface Day {
  day: number
  dayName: string
  isWeekend: boolean
}

interface KPITableHeaderProps {
  days: Day[]
}

export const KPITableHeader: React.FC<KPITableHeaderProps> = ({ days }) => {
  return (
    <>
      {/* Fixed Left Section Header */}
      <thead className="bg-gray-50">
        <tr className="h-[60px]">
          <th className="px-4 py-3 text-left border-b border-gray-200">
            <input type="checkbox" className="rounded border-gray-300" />
          </th>
          <th className="px-4 py-3 text-left border-b border-gray-200 min-w-[280px]">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Имя сотрудника
              <ChevronDown className="w-4 h-4" />
            </div>
          </th>
          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 min-w-[100px] border-b border-gray-200">
            Общий kpi
          </th>
          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 min-w-[100px] border-b border-gray-200">
            Бонус
          </th>
        </tr>
      </thead>
    </>
  )
}
