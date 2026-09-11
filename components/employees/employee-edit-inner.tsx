'use client'

import { HRLayout } from '@/components/hr-layout'
import { ProfileForm, PositionHistorySection } from '@/components/employee-form'
import { useEmployeeProgress } from '@/hooks/use-employee-progress'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { useEmployeeForm } from '@/components/employee-form'
import { useEmployeeEditSave } from '@/hooks/use-employee-edit-save'
import type { EmployeePositionChangeHistoryEntry } from '@/types/employees'
import { EmployeeEditHeader } from './employee-edit-header'
import { EmployeeEditActionBar } from './employee-edit-action-bar'
import { EmployeeEditAmbient } from './employee-edit-ambient'

type EmployeeEditInnerProps = {
  employeeId: number
  fullName: string
  positionHistory: EmployeePositionChangeHistoryEntry[]
}

export const EmployeeEditInner = ({
  employeeId,
  fullName,
  positionHistory,
}: EmployeeEditInnerProps) => {
  const { formData } = useEmployeeForm()
  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false
  const { percent } = useEmployeeProgress(formData, branchesEnabled)
  const { handleSave, isPending } = useEmployeeEditSave(employeeId)

  return (
    <HRLayout isProfile={true}>
      <div className="min-h-[calc(100dvh-64px)] w-full relative">
        <div className="max-w-6xl px-8 py-8 pb-32">
          <EmployeeEditHeader employeeId={employeeId} fullName={fullName} />
          <form
            className="space-y-12"
            onSubmit={(e) => {
              e.preventDefault()
              void handleSave()
            }}
          >
            <ProfileForm isNew={false} employeeId={employeeId} />
            {positionHistory.length > 0 ? (
              <PositionHistorySection history={positionHistory} />
            ) : null}
          </form>
        </div>
        <EmployeeEditActionBar percent={percent} isPending={isPending} onSave={() => void handleSave()} />
        <EmployeeEditAmbient />
      </div>
    </HRLayout>
  )
}
