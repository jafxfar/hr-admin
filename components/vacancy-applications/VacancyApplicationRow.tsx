import React from 'react'
import { PencilLine } from 'lucide-react'
import { getStatusBadgeClass, getStatusDotClass, getStatusLabel } from '@/lib/vacancy-application-status'
import { DataTableBodyRow, DataTableCell, DataTableStatus } from '@/components/ui/data-table'
import type { VacancyApplication } from '@/types/vacancyApplications'

interface VacancyApplicationRowProps {
  application: VacancyApplication
  categoryName?: string
  onManage: (application: VacancyApplication) => void
}

function getFullName(application: VacancyApplication) {
  return [application.last_name, application.first_name, application.middle_name]
    .filter(Boolean)
    .join(' ')
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export const VacancyApplicationRow: React.FC<VacancyApplicationRowProps> = ({
  application,
  categoryName,
  onManage,
}) => {
  return (
    <DataTableBodyRow>
      <DataTableCell>
        <span className="text-sm font-medium text-app-text">{getFullName(application) || '—'}</span>
      </DataTableCell>
      <DataTableCell>
        <span className="text-sm text-app-text-muted">{application.email || '—'}</span>
      </DataTableCell>
      <DataTableCell>
        <span className="text-sm text-app-text">{application.vacancy_title || '—'}</span>
      </DataTableCell>
      <DataTableCell>
        <span className="text-sm text-app-text-muted">{categoryName || '—'}</span>
      </DataTableCell>
      <DataTableCell>
        <span className="text-sm text-app-text-muted">{formatDate(application.created_at)}</span>
      </DataTableCell>
      <DataTableCell>
        <DataTableStatus
          className={getStatusBadgeClass(application.status)}
          dotClassName={getStatusDotClass(application.status)}
        >
          {getStatusLabel(application.status)}
        </DataTableStatus>
      </DataTableCell>
      <DataTableCell className="text-right">
        <button
          type="button"
          onClick={() => onManage(application)}
          className="inline-flex items-center gap-2 rounded-full bg-brand-accent/10 px-3 py-1.5 text-xs font-semibold text-brand-accent transition-colors hover:bg-brand-accent/20"
        >
          <PencilLine className="h-3.5 w-3.5" />
          Действие
        </button>
      </DataTableCell>
    </DataTableBodyRow>
  )
}
