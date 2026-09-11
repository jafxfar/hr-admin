'use client'

import { useId } from 'react'
import type { SettingsFeatures } from '@/api/settings'
import { useMe } from '@/hooks/use-employees'
import { usePatchSystemSettingsMutation, useSystemSettingsQuery } from '@/hooks/use-system-settings'
import { useToast } from '@/hooks/use-toast'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'
import { FEATURE_SWITCHES } from '@/components/settings/settings-constants'

export const useFeatureSwitchesSettings = () => {
  const { toast } = useToast()
  const branchesFieldId = useId()
  const vacanciesFieldId = useId()
  const vacancyApplicationsFieldId = useId()
  const timesheetsFieldId = useId()
  const kpiFieldId = useId()
  const newsFieldId = useId()
  const ideasFieldId = useId()
  const lmsFieldId = useId()
  const tasksFieldId = useId()
  const switchIdsByFeature: Record<keyof SettingsFeatures, string> = {
    branches_enabled: branchesFieldId,
    vacancies_enabled: vacanciesFieldId,
    vacancy_applications_enabled: vacancyApplicationsFieldId,
    timesheets_enabled: timesheetsFieldId,
    kpi_enabled: kpiFieldId,
    news_enabled: newsFieldId,
    ideas_enabled: ideasFieldId,
    lms_enabled: lmsFieldId,
    tasks_enabled: tasksFieldId,
  }

  const { data: me } = useMe()
  const roleName = getSystemRoleName(me)
  const { data, isLoading, isError, error } = useSystemSettingsQuery(roleName, true)
  const patchMutation = usePatchSystemSettingsMutation()

  const features = data?.features
  const isBusy = patchMutation.isPending

  const handleFeatureToggle = (featureKey: keyof SettingsFeatures, checked: boolean) => {
    if (!features) return

    patchMutation.mutate(
      {
        features: {
          ...features,
          [featureKey]: checked,
        },
      },
      {
        onSuccess: () => {
          const featureConfig = FEATURE_SWITCHES.find((item) => item.key === featureKey)
          toast({
            title: 'Сохранено',
            description: checked
              ? (featureConfig?.enabledDescription ?? 'Настройка включена')
              : (featureConfig?.disabledDescription ?? 'Настройка выключена'),
          })
        },
      },
    )
  }

  return {
    features,
    isLoading,
    isError,
    error,
    isBusy,
    switchIdsByFeature,
    handleFeatureToggle,
  }
}
