import React from 'react'
import { RequestType, RequestStatus, REQUEST_TYPE_LABELS, REQUEST_STATUS_LABELS } from '@/types/request'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { HeaderFilterSelect, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'

interface RequestsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: RequestType | 'all'
  onTypeChange: (value: RequestType | 'all') => void
  statusFilter: RequestStatus | 'all'
  onStatusChange: (value: RequestStatus | 'all') => void
}

export const RequestsFilters: React.FC<RequestsFiltersProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <HeaderToolbarRow>
      <HeaderSearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Поиск по заявкам"
        widthClassName="w-64"
      />
      <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as RequestType | 'all')}>
        <HeaderFilterSelect active={typeFilter !== 'all'} className="w-40">
          <SelectValue placeholder="Все типы" />
        </HeaderFilterSelect>
        <SelectContent>
          <SelectItem value="all">Все типы</SelectItem>
          {(Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map((type) => (
            <SelectItem key={type} value={type}>
              {REQUEST_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as RequestStatus | 'all')}>
        <HeaderFilterSelect active={statusFilter !== 'all'} className="w-40">
          <SelectValue placeholder="Все статусы" />
        </HeaderFilterSelect>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          {(Object.keys(REQUEST_STATUS_LABELS) as RequestStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {REQUEST_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </HeaderToolbarRow>
  )
}
