'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { SegmentedSwitch } from '@/components/ui/segmented-switch'

type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
  offLabel?: string
  onLabel?: string
  size?: 'default' | 'sm'
}

function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  'aria-label': ariaLabel,
  className,
  offLabel = 'Выкл',
  onLabel = 'Вкл',
  size = 'default',
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : uncontrolledChecked

  const handleValueChange = (value: string) => {
    const nextChecked = value === 'on'

    if (!isControlled) {
      setUncontrolledChecked(nextChecked)
    }

    onCheckedChange?.(nextChecked)
  }

  return (
    <SegmentedSwitch
      id={id}
      value={isChecked ? 'on' : 'off'}
      onValueChange={handleValueChange}
      options={[
        { value: 'off', label: offLabel },
        { value: 'on', label: onLabel },
      ]}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(className)}
      size={size}
    />
  )
}

export { Switch }
