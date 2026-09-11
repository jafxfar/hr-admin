'use client'

import { useMemo, useState } from 'react'
import { useSearchDepartments } from '@/hooks/use-departments'
import {
  formatMonthTitle,
  getDaysInMonth,
  MONTH_NAMES,
  startOfCurrentMonth,
  type CalendarDay,
} from '@/lib/attendance-calendar'

type DepartmentOption = { id: number; name: string }

type DepartmentListItem = {
  department_id: number
  department_name: string
  employees: unknown[]
}

type DepartmentsPaginated = {
  items?: DepartmentListItem[]
}

type SingleDepartmentPayload = {
  employees: unknown[]
}

type MonthQueryParams = {
  year: number
  month: number
  q?: string
  page?: number
  page_size?: number
}

type UseDepartmentMonthPageOptions<TRow> = {
  useByDepartments: (params: MonthQueryParams) => {
    data?: DepartmentsPaginated
    isLoading: boolean
    isError: boolean
    error: unknown
  }
  useByDepartmentId: (
    departmentId: number | null,
    params: Omit<MonthQueryParams, 'page' | 'page_size'>,
  ) => {
    data?: SingleDepartmentPayload
    isLoading: boolean
    isError: boolean
    error: unknown
  }
  mapEmployee: (employee: never) => TRow
  dayNameStyle?: 'lower' | 'title'
}

export const useDepartmentMonthPage = <TRow,>({
  useByDepartments,
  useByDepartmentId,
  mapEmployee,
  dayNameStyle = 'lower',
}: UseDepartmentMonthPageOptions<TRow>) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMonth, setCurrentMonth] = useState(startOfCurrentMonth)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1
  const trimmedSearch = searchQuery.trim() || undefined

  const allQuery = useByDepartments({
    year,
    month,
    q: trimmedSearch,
    page: 1,
    page_size: 20,
  })

  const singleQuery = useByDepartmentId(selectedDepartmentId, {
    year,
    month,
    q: trimmedSearch,
  })

  const { data: departmentsData } = useSearchDepartments('', 1, 20)

  const isLoading = selectedDepartmentId ? singleQuery.isLoading : allQuery.isLoading
  const isError = selectedDepartmentId ? singleQuery.isError : allQuery.isError
  const error = selectedDepartmentId ? singleQuery.error : allQuery.error

  const days = useMemo(
    () => getDaysInMonth(currentMonth, dayNameStyle),
    [currentMonth, dayNameStyle],
  )

  const employees = useMemo(() => {
    if (selectedDepartmentId) {
      if (!singleQuery.data) return []
      return singleQuery.data.employees.map((emp) => mapEmployee(emp as never))
    }
    if (!allQuery.data?.items) return []
    return allQuery.data.items.flatMap((dept) =>
      dept.employees.map((emp) => mapEmployee(emp as never)),
    )
  }, [allQuery.data, singleQuery.data, selectedDepartmentId, mapEmployee])

  const departmentOptions = useMemo((): DepartmentOption[] => {
    if (allQuery.data?.items?.length) {
      return allQuery.data.items.map((d) => ({
        id: d.department_id,
        name: d.department_name,
      }))
    }
    return departmentsData?.items?.map((d) => ({ id: d.id, name: d.name })) ?? []
  }, [allQuery.data, departmentsData])

  const handlePrevMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const monthTitle = formatMonthTitle(currentMonth)
  const listKey = `${year}-${month}-${selectedDepartmentId ?? 'all'}-${searchQuery.trim()}`

  return {
    selectedDepartmentId,
    setSelectedDepartmentId,
    searchQuery,
    setSearchQuery,
    currentMonth,
    days,
    employees,
    departmentOptions,
    isLoading,
    isError,
    error,
    handlePrevMonth,
    handleNextMonth,
    monthTitle,
    listKey,
    monthNames: MONTH_NAMES,
    monthIndex: currentMonth.getMonth(),
  }
}

export type { CalendarDay, DepartmentOption }
