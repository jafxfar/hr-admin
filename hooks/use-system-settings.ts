import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  settingsApi,
  SETTINGS_SYSTEM_QUERY_KEY,
  SETTINGS_UI_ME_QUERY_KEY,
  type SystemSettingsResponse,
  type UserUiSettings,
} from '@/api/settings'
import { SETTINGS_FEATURES_QUERY_KEY } from '@/hooks/use-settings-features'

const isSuperadminRole = (role: string | undefined) => role?.toLowerCase() === 'superadmin'

export const useSystemSettingsQuery = (meRole: string | undefined, hasToken: boolean) =>
  useQuery({
    queryKey: [...SETTINGS_SYSTEM_QUERY_KEY],
    queryFn: settingsApi.getSystemSettings,
    enabled: hasToken && isSuperadminRole(meRole),
    staleTime: 30_000,
  })

export const usePatchSystemSettingsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: (body: SystemSettingsResponse) => settingsApi.patchSystemSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...SETTINGS_SYSTEM_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: SETTINGS_FEATURES_QUERY_KEY })
    },
  })
}

export const useMyUiSettingsQuery = (hasToken: boolean) =>
  useQuery({
    queryKey: [...SETTINGS_UI_ME_QUERY_KEY],
    queryFn: settingsApi.getMyUiSettings,
    enabled: hasToken,
    staleTime: 30_000,
  })

export const usePutMyUiSettingsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const, skipSuccessToast: true },
    mutationFn: (body: Partial<UserUiSettings>) => settingsApi.putMyUiSettings(body),
    onSuccess: (updated) => {
      queryClient.setQueryData<UserUiSettings | undefined>(
        [...SETTINGS_UI_ME_QUERY_KEY],
        (prev) => (prev ? { ...prev, ...updated } : updated),
      )
      void queryClient.invalidateQueries({ queryKey: [...SETTINGS_UI_ME_QUERY_KEY] })
    },
  })
}
