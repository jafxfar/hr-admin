'use client'

import { Suspense } from 'react'
import { HRLayout } from '@/components/hr-layout'
import { EmployeeProfileContent } from '@/components/employees/employee-profile-view'
import {
    EmployeeProfileError,
    EmployeeProfileLoading,
    EmployeeProfilePageHeader,
} from '@/components/employees/employee-profile-view'
import { useEmployeeProfileView } from '@/hooks/use-employee-profile-view'

function EmployeeProfilePageInner() {
    const {
        id,
        profile,
        employee,
        positionChangeHistory,
        isLoading,
        isError,
        branchesEnabled,
        router,
    } = useEmployeeProfileView()

    return (
        <HRLayout isProfile={true}>
            <div className="min-h-[calc(100dvh-64px)] w-full text-app-text">
                <main className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
                    <EmployeeProfilePageHeader
                        employeeId={id}
                        onBack={() => router.push('/employees')}
                    />

                    {isLoading && <EmployeeProfileLoading />}

                    {isError && !isLoading && (
                        <EmployeeProfileError onBack={() => router.push('/employees')} />
                    )}

                    {profile && employee && !isLoading && !isError && (
                        <EmployeeProfileContent
                            profile={profile}
                            employee={employee}
                            positionChangeHistory={positionChangeHistory}
                            branchesEnabled={branchesEnabled}
                        />
                    )}
                </main>
            </div>
        </HRLayout>
    )
}

export default function EmployeeProfileViewPage() {
    return (
        <Suspense fallback={null}>
            <EmployeeProfilePageInner />
        </Suspense>
    )
}
