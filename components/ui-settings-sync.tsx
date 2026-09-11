'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useMyUiSettingsQuery } from '@/hooks/use-system-settings'
import { getContrastColor, hexToRgbChannels } from '@/lib/theme-color-utils'

const DEFAULT_UI_COLORS = {
  lightPrimary: '#d6fd70',
  lightSecondary: '#2453ff',
  darkPrimary: '#d6fd70',
  darkSecondary: '#38c6f6',
}

const hasToken = () => typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'))

const setColorVariables = (
  root: HTMLElement,
  prefix: 'light' | 'dark',
  primary: string,
  secondary: string,
) => {
  root.style.setProperty(`--user-${prefix}-primary`, primary)
  root.style.setProperty(`--user-${prefix}-secondary`, secondary)
  root.style.setProperty(`--user-${prefix}-primary-rgb`, hexToRgbChannels(primary))
  root.style.setProperty(`--user-${prefix}-secondary-rgb`, hexToRgbChannels(secondary))
  root.style.setProperty(`--on-${prefix}-primary`, getContrastColor(primary))
  root.style.setProperty(`--on-${prefix}-secondary`, getContrastColor(secondary))
}

const applyColorVariables = (root: HTMLElement, data?: {
  light_primary?: string
  light_secondary?: string
  dark_primary?: string
  dark_secondary?: string
}) => {
  const lightPrimary = data?.light_primary ?? DEFAULT_UI_COLORS.lightPrimary
  const lightSecondary = data?.light_secondary ?? DEFAULT_UI_COLORS.lightSecondary
  const darkPrimary = data?.dark_primary ?? DEFAULT_UI_COLORS.darkPrimary
  const darkSecondary = data?.dark_secondary ?? DEFAULT_UI_COLORS.darkSecondary

  setColorVariables(root, 'light', lightPrimary, lightSecondary)
  setColorVariables(root, 'dark', darkPrimary, darkSecondary)
}

const applyActiveContrastColors = (root: HTMLElement, isDark: boolean) => {
  const prefix = isDark ? 'dark' : 'light'
  const onPrimary = root.style.getPropertyValue(`--on-${prefix}-primary`)
    || getComputedStyle(root).getPropertyValue(`--on-${prefix}-primary`).trim()
  const onSecondary = root.style.getPropertyValue(`--on-${prefix}-secondary`)
    || getComputedStyle(root).getPropertyValue(`--on-${prefix}-secondary`).trim()

  if (onPrimary) root.style.setProperty('--on-primary', onPrimary)
  if (onSecondary) root.style.setProperty('--on-secondary', onSecondary)
}

export function UiSettingsSync() {
  const { setTheme, resolvedTheme } = useTheme()
  const { data } = useMyUiSettingsQuery(hasToken())
  const hasInitializedThemeRef = useRef(false)

  useEffect(() => {
    applyColorVariables(document.documentElement, data)
    applyActiveContrastColors(document.documentElement, resolvedTheme === 'dark')
  }, [data, resolvedTheme])

  useEffect(() => {
    if (!data?.theme || hasInitializedThemeRef.current) return

    hasInitializedThemeRef.current = true
    setTheme(data.theme)
  }, [data?.theme, setTheme])

  return null
}
