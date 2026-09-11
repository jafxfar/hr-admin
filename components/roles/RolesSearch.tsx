/**
 * Компонент поиска ролей
 */

'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface RolesSearchProps {
  onSearch?: (query: string) => void
}

export function RolesSearch({ onSearch }: RolesSearchProps) {
  return (
    <div className="py-4">
      <div className="relative max-w-100">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
        <Input
          placeholder="Поиск роли"
          className="pl-9 h-10 bg-white border border-app-border text-[13px]"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  )
}
