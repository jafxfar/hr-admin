'use client'

import type { Employee, EmployeePositionChangeHistoryEntry, EmployeeProfileViewModel } from '@/types/employees'
import { useEmployeeProfileHeroLayout } from '@/hooks/use-employee-profile-view'
import { EmployeeProfileHero } from './employee-profile-hero'
import { EmployeeProfileSchedule } from './employee-profile-schedule'
import { EmployeeProfileIdentity } from './employee-profile-identity'
import { EmployeeProfileContacts } from './employee-profile-contacts'
import { EmployeeProfileAddresses } from './employee-profile-addresses'
import { EmployeeProfileAccess } from './employee-profile-access'
import { EmployeeProfileCurrentPosition } from './employee-profile-current-position'
import { EmployeeProfilePositionHistory } from './employee-profile-position-history'
import { EmployeeProfilePositionChanges } from './employee-profile-position-changes'
import { EmployeeProfileWorkConditions } from './employee-profile-work-conditions'
import { EmployeeProfileWorkExperience } from './employee-profile-work-experience'
import { EmployeeProfileEducation } from './employee-profile-education'
import { EmployeeProfileManagement } from './employee-profile-management'
import { EmployeeProfileAwards } from './employee-profile-awards'
import { EmployeeProfileDocuments } from './employee-profile-documents'

export function EmployeeProfileContent({
    profile,
    employee,
    positionChangeHistory,
    branchesEnabled,
}: {
    profile: EmployeeProfileViewModel
    employee: Employee
    positionChangeHistory: EmployeePositionChangeHistoryEntry[]
    branchesEnabled: boolean
}) {
    const { schedule, hasSchedule } = useEmployeeProfileHeroLayout(profile)
    const checklistItems = profile.document_checklist?.items ?? []
    const head = profile.department?.head_user

    return (
        <>
            <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className={hasSchedule ? 'lg:col-span-8' : 'lg:col-span-12'}>
                    <EmployeeProfileHero profile={profile} branchesEnabled={branchesEnabled} />
                </div>
                {hasSchedule && schedule ? (
                    <div className="lg:col-span-4">
                        <EmployeeProfileSchedule schedule={schedule} />
                    </div>
                ) : null}
            </div>

            <div className="space-y-16">
                <EmployeeProfileIdentity employee={employee} />
                <EmployeeProfileContacts employee={employee} />
                <EmployeeProfileAddresses employee={employee} />
                <EmployeeProfileAccess employee={employee} />
                <EmployeeProfileCurrentPosition
                    employee={employee}
                    profile={profile}
                    branchesEnabled={branchesEnabled}
                />
                <EmployeeProfilePositionHistory
                    items={profile.position_history ?? []}
                    branchesEnabled={branchesEnabled}
                />
                <EmployeeProfilePositionChanges history={positionChangeHistory} />
                <EmployeeProfileWorkConditions employee={employee} />
                <EmployeeProfileEducation items={profile.educations ?? []} />
                <EmployeeProfileWorkExperience items={profile.work_experiences ?? []} />
                <EmployeeProfileManagement head={head} />
                <EmployeeProfileAwards items={profile.rewards ?? []} />
                <EmployeeProfileDocuments employee={employee} checklistItems={checklistItems} />
            </div>
        </>
    )
}
