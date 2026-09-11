'use client'

import { HRLayout } from '@/components/hr-layout'
import { EmployeeFilters, EmployeeTable, defaultEmployeeFilters } from '@/components/employees'
import type { EmployeeFilterState } from '@/components/employees'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/ui/loading'
import { useEmployeesFiltered } from '@/hooks/use-employees'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { UserPlus } from 'lucide-react'

const PAGE_SIZE = 20

const parseBranchIdParam = (value: string | null): number | undefined => {
  if (!value) return undefined
  const id = Number(value)
  if (Number.isNaN(id) || id <= 0) return undefined
  return id
}

export const EmployeesPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const branchIdParam = searchParams.get('branch_id')
  const branchIdFromUrl = parseBranchIdParam(branchIdParam)

  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<EmployeeFilterState>(() => ({
    ...defaultEmployeeFilters,
    branch_ids: branchIdFromUrl ? [branchIdFromUrl] : undefined,
  }))
  const [isArchiveMode, setIsArchiveMode] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.searchQuery.trim()), 400)
    return () => clearTimeout(timer)
  }, [filters.searchQuery])

  useEffect(() => {
    const nextBranchId = parseBranchIdParam(searchParams.get('branch_id'))
    setFilters((prev) => {
      const currentBranchId = prev.branch_ids?.[0]
      if (currentBranchId === nextBranchId) return prev
      return {
        ...prev,
        branch_ids: nextBranchId ? [nextBranchId] : undefined,
      }
    })
  }, [searchParams])

  useEffect(() => {
    setPage(1)
  }, [
    filters.gender,
    filters.has_contract,
    filters.has_salary,
    filters.has_schedule,
    filters.has_documents,
    filters.has_profile_photo,
    filters.upcoming_birthdays_days,
    filters.branch_ids,
    filters.department_ids,
    debouncedSearch,
    isArchiveMode,
  ])

  const isActive = isArchiveMode ? false : true

  const employeesResult = useEmployeesFiltered(
    {
      ...filters,
      q: debouncedSearch || undefined,
      is_active: isActive,
      page,
      page_size: PAGE_SIZE,
    },
    true,
  )

  const { data, isLoading } = employeesResult

  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false

  const handleFiltersChange = (next: EmployeeFilterState) => {
    setFilters(next)

    const nextBranchId = next.branch_ids?.[0]
    const currentBranchParam = searchParams.get('branch_id')

    if (nextBranchId && String(nextBranchId) !== currentBranchParam) {
      router.replace(`/employees?branch_id=${nextBranchId}`)
      return
    }

    if (!nextBranchId && currentBranchParam) {
      router.replace('/employees')
    }
  }

  const handleToggleArchive = () => {
    setIsArchiveMode((v) => !v)
  }

  return (
    <HRLayout
      title="Сотрудники"
      topActions={
        <EmployeeFilters
          filters={filters}
          onChange={handleFiltersChange}
          isArchiveMode={isArchiveMode}
          onToggleArchive={handleToggleArchive}
          branchesEnabled={branchesEnabled}
        />
      }
      action={{
        label: 'Добавить сотрудника',
        icon: <UserPlus className="w-4 h-4" />,
        onClick: () => router.push('/employees/new'),
      }}
    >
      <div className="admin-content-inset space-y-3" data-marketing="employees">
        {isLoading ? (
          <Loading />
        ) : (
          <EmployeeTable
            employees={data?.items ?? []}
            total={data?.total ?? 0}
            page={data?.page ?? page}
            pageSize={data?.page_size ?? PAGE_SIZE}
            totalPages={data?.total_pages ?? 1}
            onPageChange={setPage}
            branchesEnabled={branchesEnabled}
            isArchiveMode={isArchiveMode}
          />
        )}
      </div>
    </HRLayout>
  )
}
