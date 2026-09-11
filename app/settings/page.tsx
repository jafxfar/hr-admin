'use client'

import { HRLayout } from '@/components/hr-layout'
import { ThemeColorsSettings } from '@/components/settings/theme-colors-settings'
import { FeatureSwitchesSettings } from '@/components/settings/feature-switches-settings'
import { DocumentTypesSettings } from '@/components/settings/document-types-settings'

export default function SystemSettingsPage() {
  return (
    <HRLayout title="Системные настройки">
      <div className="admin-content-inset max-w-7xl space-y-3">
        <ThemeColorsSettings />
        <FeatureSwitchesSettings />
        <DocumentTypesSettings />
      </div>
    </HRLayout>
  )
}
