'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useMyUiSettingsQuery, usePutMyUiSettingsMutation } from '@/hooks/use-system-settings'
import { useToast } from '@/hooks/use-toast'
import { mutationOpts } from '@/lib/mutation-options'
import type { PaletteMode } from '@/components/settings/settings-constants'
import {
  colorInputFallback,
  FULL_HEX,
  sanitizeHexTyping,
  toRgbChannels,
} from '@/components/settings/settings-constants'

const isValidTheme = (value: string | undefined): value is 'light' | 'dark' | 'system' =>
  value === 'light' || value === 'dark' || value === 'system'

const DEFAULT_COLORS = {
  light_primary: '#d6fd70',
  light_secondary: '#2453ff',
  dark_primary: '#d6fd70',
  dark_secondary: '#38c6f6',
} as const

const normalizeHexColor = (value: string, fallback: string) =>
  FULL_HEX.test(value) ? value.toUpperCase() : fallback.toUpperCase()

export const useThemeColorsSettings = () => {
  const { toast } = useToast()
  const { theme: currentTheme } = useTheme()
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'))
  const { data: uiSettings } = useMyUiSettingsQuery(hasToken)
  const putUiMutation = usePutMyUiSettingsMutation()

  const [lightPrimary, setLightPrimary] = useState('#d6fd70')
  const [lightSecondary, setLightSecondary] = useState('#2453ff')
  const [darkPrimary, setDarkPrimary] = useState('#d6fd70')
  const [darkSecondary, setDarkSecondary] = useState('#38c6f6')
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('light')
  const hasHydratedFromServerRef = useRef(false)

  useEffect(() => {
    if (!uiSettings || hasHydratedFromServerRef.current || putUiMutation.isPending) return

    hasHydratedFromServerRef.current = true
    setLightPrimary(uiSettings.light_primary)
    setLightSecondary(uiSettings.light_secondary)
    setDarkPrimary(uiSettings.dark_primary)
    setDarkSecondary(uiSettings.dark_secondary)
  }, [uiSettings, putUiMutation.isPending])

  const isLightMode = paletteMode === 'light'
  const activePrimary = isLightMode ? lightPrimary : darkPrimary
  const activeSecondary = isLightMode ? lightSecondary : darkSecondary
  const activePrimaryRgb = toRgbChannels(activePrimary)

  const handlePrimaryChange = (value: string) => {
    if (isLightMode) {
      setLightPrimary(value.toUpperCase())
      return
    }
    setDarkPrimary(value.toUpperCase())
  }

  const handleSecondaryChange = (value: string) => {
    if (isLightMode) {
      setLightSecondary(value.toUpperCase())
      return
    }
    setDarkSecondary(value.toUpperCase())
  }

  const handleSaveColors = () => {
    const colors = {
      light_primary: normalizeHexColor(
        lightPrimary,
        uiSettings?.light_primary ?? DEFAULT_COLORS.light_primary,
      ),
      light_secondary: normalizeHexColor(
        lightSecondary,
        uiSettings?.light_secondary ?? DEFAULT_COLORS.light_secondary,
      ),
      dark_primary: normalizeHexColor(
        darkPrimary,
        uiSettings?.dark_primary ?? DEFAULT_COLORS.dark_primary,
      ),
      dark_secondary: normalizeHexColor(
        darkSecondary,
        uiSettings?.dark_secondary ?? DEFAULT_COLORS.dark_secondary,
      ),
    }

    const activeColors = isLightMode
      ? [colors.light_primary, colors.light_secondary]
      : [colors.dark_primary, colors.dark_secondary]

    if (activeColors.some((value) => !FULL_HEX.test(value))) {
      toast({
        variant: 'destructive',
        title: 'Некорректный цвет',
        description: 'Укажите цвета в формате #RRGGBB',
      })
      return
    }

    const themeToSave = isValidTheme(currentTheme)
      ? currentTheme
      : uiSettings?.theme ?? 'light'

    putUiMutation.mutate(
      {
        theme: themeToSave,
        ...colors,
      },
      mutationOpts({
        onSuccess: () => {
          setLightPrimary(colors.light_primary)
          setLightSecondary(colors.light_secondary)
          setDarkPrimary(colors.dark_primary)
          setDarkSecondary(colors.dark_secondary)
          toast({
            title: 'Сохранено',
            description: 'Цвета темы обновлены',
          })
        },
      }),
    )
  }

  return {
    paletteMode,
    setPaletteMode,
    isLightMode,
    activePrimary,
    activeSecondary,
    activePrimaryRgb,
    isColorBusy: putUiMutation.isPending,
    handlePrimaryChange,
    handleSecondaryChange,
    handleSaveColors,
    sanitizeHexTyping,
    colorInputFallback,
  }
}
