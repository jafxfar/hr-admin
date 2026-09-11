import type { SettingsFeatures } from '@/api/settings'

export type FeatureKey = keyof SettingsFeatures

const featureRoutePrefixes: Record<FeatureKey, string[]> = {
  branches_enabled: ['/branches'],
  vacancies_enabled: ['/vacancies'],
  vacancy_applications_enabled: ['/vacancy-applications'],
  timesheets_enabled: ['/timesheet'],
  kpi_enabled: ['/kpi'],
  news_enabled: ['/news'],
  ideas_enabled: ['/ideas'],
  lms_enabled: ['/training'],
  tasks_enabled: ['/tasks'],
}

const isPathMatched = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

export const isPathAllowedByFeatures = (
  pathname: string,
  features?: SettingsFeatures | null,
): boolean => {
  if (!features) return true

  for (const [featureKey, prefixes] of Object.entries(featureRoutePrefixes) as [
    FeatureKey,
    string[],
  ][]) {
    const isRestrictedPath = prefixes.some((prefix) => isPathMatched(pathname, prefix))
    if (isRestrictedPath && features[featureKey] === false) {
      return false
    }
  }

  return true
}

export const isFeatureEnabled = (
  featureKey: FeatureKey | undefined,
  features?: SettingsFeatures | null,
): boolean => {
  if (!featureKey) return true
  if (!features) return true
  return features[featureKey] !== false
}
