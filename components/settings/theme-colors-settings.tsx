'use client'

import { DarkInput } from '@/components/custom-ui'
import { labelStyle } from '@/components/employee-form/profile-form/styles'
import { Button } from '@/components/ui/button'
import { SegmentedSwitch } from '@/components/ui/segmented-switch'
import { useThemeColorsSettings } from '@/hooks/use-theme-colors-settings'
import { ThemeColorsPreview } from './theme-colors-preview'

export const ThemeColorsSettings = () => {
  const {
    paletteMode,
    setPaletteMode,
    isLightMode,
    activePrimary,
    activeSecondary,
    activePrimaryRgb,
    isColorBusy,
    handlePrimaryChange,
    handleSecondaryChange,
    handleSaveColors,
    sanitizeHexTyping,
    colorInputFallback,
  } = useThemeColorsSettings()

  return (
    <div className="rounded-3xl border border-app-surface-4 bg-app-surface-0 p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-app-text">Цвета интерфейса</h2>
        <p className="text-xs text-app-text-muted leading-relaxed">
          Primary и secondary используются динамически в компонентах (включая focus/ring)
        </p>
      </div>

      <SegmentedSwitch
        value={paletteMode}
        onValueChange={setPaletteMode}
        options={[
          { value: 'light', label: 'Светлая' },
          { value: 'dark', label: 'Тёмная' },
        ]}
        aria-label="Режим редактирования палитры"
      />

      <div
        id="palette-panel"
        role="tabpanel"
        aria-labelledby={isLightMode ? 'palette-tab-light' : 'palette-tab-dark'}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ThemeColorField
            label={isLightMode ? 'Основной (светлая тема)' : 'Основной (тёмная тема)'}
            value={activePrimary}
            placeholder="#d6fd70"
            fallback={isLightMode ? '#d6fd70' : '#d6fd70'}
            modeLabel={isLightMode ? 'Светлая' : 'Тёмная'}
            fieldKind="основной"
            onChange={handlePrimaryChange}
            sanitizeHexTyping={sanitizeHexTyping}
            colorInputFallback={colorInputFallback}
          />
          <ThemeColorField
            label={isLightMode ? 'Дополнительный (светлая тема)' : 'Дополнительный (тёмная тема)'}
            value={activeSecondary}
            placeholder="#2453ff"
            fallback={isLightMode ? '#2453ff' : '#38c6f6'}
            modeLabel={isLightMode ? 'Светлая' : 'Тёмная'}
            fieldKind="дополнительный"
            onChange={handleSecondaryChange}
            sanitizeHexTyping={sanitizeHexTyping}
            colorInputFallback={colorInputFallback}
          />
        </div>
      </div>

      <ThemeColorsPreview
        activePrimary={activePrimary}
        activeSecondary={activeSecondary}
        activePrimaryRgb={activePrimaryRgb}
      />

      <Button
        type="button"
        onClick={handleSaveColors}
        disabled={isColorBusy}
        className="rounded-full px-6 bg-(--theme-primary) text-white hover:opacity-95 shadow-[0_10px_28px_rgb(var(--theme-primary-rgb)/0.35)] disabled:shadow-none"
      >
        {isColorBusy ? 'Сохранение…' : 'Сохранить цвета'}
      </Button>
    </div>
  )
}

type ThemeColorFieldProps = {
  label: string
  value: string
  placeholder: string
  fallback: string
  modeLabel: string
  fieldKind: string
  onChange: (value: string) => void
  sanitizeHexTyping: (raw: string) => string
  colorInputFallback: (hex: string, fallback: string) => string
}

const ThemeColorField = ({
  label,
  value,
  placeholder,
  fallback,
  modeLabel,
  fieldKind,
  onChange,
  sanitizeHexTyping,
  colorInputFallback,
}: ThemeColorFieldProps) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div className="flex gap-2 items-center">
      <div className="min-w-0 flex-1">
        <DarkInput
          value={value}
          onChange={(e) => onChange(sanitizeHexTyping(e.target.value))}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={`${modeLabel} тема — ${fieldKind} цвет, HEX`}
        />
      </div>
      <input
        type="color"
        value={colorInputFallback(value, fallback)}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full border border-app-border-accent/60 bg-app-surface-0 p-0 shadow-sm [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
        aria-label={`${modeLabel} тема — выбор ${fieldKind} цвета`}
      />
    </div>
  </div>
)
