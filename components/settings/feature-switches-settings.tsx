'use client'

import { Switch } from '@/components/ui/switch'
import { isForbiddenError } from '@/lib/query-error'
import { FEATURE_SWITCHES } from './settings-constants'
import { useFeatureSwitchesSettings } from '@/hooks/use-feature-switches-settings'

export const FeatureSwitchesSettings = () => {
  const { features, isLoading, isError, error, isBusy, switchIdsByFeature, handleFeatureToggle } =
    useFeatureSwitchesSettings()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-app-surface-4 bg-app-surface-0 px-5 py-4 text-sm text-app-text-muted">
        Загрузка системных настроек…
      </div>
    )
  }

  if (isError || !features) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
        {isForbiddenError(error)
          ? 'Нет доступа'
          : (error as Error)?.message ?? 'Системные настройки доступны только superadmin'}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-app-surface-4 bg-app-surface-0 p-6 shadow-sm space-y-4">
      {FEATURE_SWITCHES.map((featureConfig) => {
        const isChecked = features[featureConfig.key]
        const switchId = switchIdsByFeature[featureConfig.key]

        return (
          <div key={featureConfig.key} className="flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <label
                htmlFor={switchId}
                className="text-sm font-semibold text-app-text cursor-pointer block"
              >
                {featureConfig.label}
              </label>
              <p className="text-xs text-app-text-muted leading-relaxed">{featureConfig.description}</p>
            </div>
            <Switch
              id={switchId}
              checked={isChecked}
              onCheckedChange={(checked) => handleFeatureToggle(featureConfig.key, checked)}
              disabled={isBusy}
              aria-label={featureConfig.label}
            />
          </div>
        )
      })}
    </div>
  )
}
