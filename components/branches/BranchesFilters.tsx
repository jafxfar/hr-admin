'use client'
import { HeaderSearchInput } from '@/components/hr-header-controls'

export interface BranchesFiltersProps {
  search: string
  onSearchChange: (value: string) => void
}

export const BranchesFilters = ({ search, onSearchChange }: BranchesFiltersProps) => (
  <HeaderSearchInput
    value={search}
    onChange={onSearchChange}
    placeholder="Поиск по названию или коду"
    widthClassName="w-64"
  />
)
