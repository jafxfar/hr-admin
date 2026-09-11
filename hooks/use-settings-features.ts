import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@/api/settings'

export const SETTINGS_FEATURES_QUERY_KEY = ['settings', 'system', 'features']

export function useSettingsFeatures(enabled = true) {
  return useQuery({
    queryKey: SETTINGS_FEATURES_QUERY_KEY,
    queryFn: settingsApi.getSystemFeatures,
    enabled,
    staleTime: 60_000,
  })
}

