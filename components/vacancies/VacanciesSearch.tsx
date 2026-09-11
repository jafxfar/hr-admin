import React from 'react'
import { HeaderSearchInput } from '@/components/hr-header-controls'

interface VacanciesSearchProps {
  value: string
  onChange: (value: string) => void
}

export const VacanciesSearch: React.FC<VacanciesSearchProps> = ({ value, onChange }) => {
  return <HeaderSearchInput value={value} onChange={onChange} placeholder="Поиск по названию вакансии" widthClassName="w-72" />
}
