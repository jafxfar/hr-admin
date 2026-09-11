import React from 'react'
import { HeaderSearchInput } from '@/components/hr-header-controls'

interface RewardsSearchProps {
  value: string
  onChange: (value: string) => void
}

export const RewardsSearch: React.FC<RewardsSearchProps> = ({ value, onChange }) => {
  return (
    <HeaderSearchInput
      value={value}
      onChange={onChange}
      placeholder="Поиск по названию"
      widthClassName="w-[280px] max-w-full"
    />
  )
}
