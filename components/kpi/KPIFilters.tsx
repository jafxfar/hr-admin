import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectValue } from '../ui/select'
import { HeaderFilterSelect, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'

interface DepartmentOption {
  id: number
  name: string
}

interface KPIFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedDepartmentId: number | null
  setSelectedDepartmentId: (value: number | null) => void
  departmentOptions: DepartmentOption[]
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  monthNames: string[]
}

export const KPIFilters: React.FC<KPIFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDepartmentId,
  setSelectedDepartmentId,
  departmentOptions,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  monthNames,
}) => {
  return (
    <HeaderToolbarRow className='py-4'>
      <HeaderSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск по имени"
        widthClassName="flex-1 min-w-[200px] max-w-xs"
      />
      <Select
        value={selectedDepartmentId != null ? String(selectedDepartmentId) : 'all'}
        onValueChange={(v) =>
          setSelectedDepartmentId(v === 'all' ? null : Number(v))
        }
      >
        <HeaderFilterSelect active={selectedDepartmentId !== null} className="w-36">
          <SelectValue placeholder="Все отделы" />
        </HeaderFilterSelect>
        <SelectContent>
          <SelectItem value="all">Все отделы</SelectItem>
          {departmentOptions.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-lg p-2 text-app-text-muted transition hover:bg-app-surface-2 hover:text-brand-accent"
          aria-label="Предыдущий месяц"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-35 text-center text-sm font-medium tabular-nums text-app-text">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-lg p-2 text-app-text-muted transition hover:bg-app-surface-2 hover:text-brand-accent"
          aria-label="Следующий месяц"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </HeaderToolbarRow>
  )
}
