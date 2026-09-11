'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    useEmployee,
    useEmployeePositionChangeReasons,
    useEmployeePositionHistory,
} from '@/hooks/use-employees'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { mapEmployeeToProfileView } from '@/lib/employee-profile-view-map'
import type { EmployeeProfileViewModel } from '@/types/employees'
import {
    formatScheduleHours,
    formatScheduleSummary,
    getActiveSchedule,
} from '@/lib/employee-profile-format'

export function useEmployeeProfileView() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const id = Number(params?.id)
    const isInvalidId = !Number.isFinite(id) || id <= 0

    const { data: employee, isLoading: employeeLoading, isError, error } = useEmployee(id)
    const { data: positionHistory = [], isLoading: historyLoading } = useEmployeePositionHistory(id)
    const { data: positionChangeHistory = [], isLoading: changesLoading } =
        useEmployeePositionChangeReasons(id)
    const { data: settingsFeatures } = useSettingsFeatures(!isInvalidId)
    const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false

    const profile = useMemo<EmployeeProfileViewModel | null>(() => {
        if (!employee) return null
        return mapEmployeeToProfileView(employee, positionHistory)
    }, [employee, positionHistory])

    const isLoading = employeeLoading || historyLoading || changesLoading

    return {
        id,
        profile,
        employee,
        positionChangeHistory,
        isLoading,
        isError: isError || isInvalidId,
        isInvalidId,
        branchesEnabled,
        router,
        error,
    }
}

export function useEmployeeProfileHeroLayout(profile: EmployeeProfileViewModel) {
    const schedule = getActiveSchedule(profile.schedules ?? [])
    const hasSchedule = Boolean(schedule && (formatScheduleSummary(schedule) || formatScheduleHours(schedule)))

    return { schedule, hasSchedule }
}
