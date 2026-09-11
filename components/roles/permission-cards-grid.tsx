'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PermissionMatrixRow } from '@/types/permission'
import type { DraftMatrixRow, MatrixAction, MatrixColumnState } from '@/lib/roles-matrix'
import { groupPermissionRows } from '@/lib/roles-permission-groups'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const ACTION_LABELS: Record<MatrixAction, string> = {
  read: 'Чтение',
  write: 'Запись',
  delete: 'Удаление',
}

type PermissionCardsGridProps = {
  displayedRows: PermissionMatrixRow[]
  draftRows: DraftMatrixRow[]
  columnState: Record<MatrixAction, MatrixColumnState>
  selectedRoleId: number | null
  roleMatrixLoading: boolean
  onMatrixToggle: (resource: string, action: MatrixAction) => void
  onToggleColumn: (action: MatrixAction) => void
}

type PermissionCardProps = {
  row: PermissionMatrixRow
  draft: DraftMatrixRow
  onMatrixToggle: (resource: string, action: MatrixAction) => void
}

const PermissionCard = ({ row, draft, onMatrixToggle }: PermissionCardProps) => (
  <article className="app-card-solid rounded-2xl p-4">
    <div className="mb-3">
      <p className="text-sm font-semibold text-app-text">{row.alias_ru}</p>
      <p className="text-xs text-app-text-muted">{row.resource}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      {(['read', 'write', 'delete'] as const).map((action) => {
        const isAvailable = !!row[action].permission_id
        const isActive = draft[action]

        return (
          <button
            key={action}
            type="button"
            disabled={!isAvailable}
            onClick={() => onMatrixToggle(row.resource, action)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              !isAvailable && 'cursor-not-allowed opacity-40',
              isActive
                ? 'bg-brand-accent text-brand-accent-on shadow-sm'
                : 'app-glass-inset app-glass-inset-hover text-app-text-muted',
            )}
            aria-pressed={isActive}
            aria-label={`${ACTION_LABELS[action]}: ${row.alias_ru}`}
          >
            {ACTION_LABELS[action]}
          </button>
        )
      })}
    </div>
  </article>
)

const BulkToggleBar = ({
  columnState,
  selectedRoleId,
  roleMatrixLoading,
  onToggleColumn,
}: Pick<
  PermissionCardsGridProps,
  'columnState' | 'selectedRoleId' | 'roleMatrixLoading' | 'onToggleColumn'
>) => (
  <div className="app-glass-inset flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2">
    <span className="text-xs font-bold uppercase tracking-wider text-app-text-muted">
      Для всех
    </span>
    {(['read', 'write', 'delete'] as const).map((action) => (
      <button
        key={action}
        type="button"
        onClick={() => onToggleColumn(action)}
        disabled={!selectedRoleId || roleMatrixLoading || !columnState[action].hasAvailable}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40',
          columnState[action].allOn
            ? 'bg-brand-accent/15 text-brand-accent'
            : 'bg-app-surface-1 text-app-text-muted hover:text-app-text',
        )}
      >
        {ACTION_LABELS[action]}
      </button>
    ))}
  </div>
)

export const PermissionCardsGrid = ({
  displayedRows,
  draftRows,
  columnState,
  selectedRoleId,
  roleMatrixLoading,
  onMatrixToggle,
  onToggleColumn,
}: PermissionCardsGridProps) => {
  const draftByResource = new Map(draftRows.map((row) => [row.resource, row]))
  const groupedRows = groupPermissionRows(displayedRows)

  if (groupedRows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-app-text-muted">
        Права не найдены по вашему запросу
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <BulkToggleBar
        columnState={columnState}
        selectedRoleId={selectedRoleId}
        roleMatrixLoading={roleMatrixLoading}
        onToggleColumn={onToggleColumn}
      />

      <div className="space-y-3">
        {groupedRows.map((group) => (
          <Collapsible key={group.id} defaultOpen={group.defaultOpen}>
            <CollapsibleTrigger className="app-glass-inset app-glass-inset-hover group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors">
              <div>
                <p className="text-sm font-bold text-app-text">{group.label}</p>
                <p className="text-xs text-app-text-muted">{group.rows.length} ресурсов</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-app-text-muted transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="admin-card-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
                {group.rows.map((row) => {
                  const draft = draftByResource.get(row.resource)
                  if (!draft) return null

                  return (
                    <PermissionCard
                      key={row.resource}
                      row={row}
                      draft={draft}
                      onMatrixToggle={onMatrixToggle}
                    />
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
