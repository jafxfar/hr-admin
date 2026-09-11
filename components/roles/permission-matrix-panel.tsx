'use client'

import { HeaderFilterSelect } from '@/components/hr-header-controls'
import Loading from '@/components/ui/loading'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { ShieldCheck } from 'lucide-react'
import type { PermissionMatrixRow, ScopeType } from '@/types/permission'
import type { DraftMatrixRow, MatrixAction, MatrixColumnState } from '@/lib/roles-matrix'
import { PermissionCardsGrid } from './permission-cards-grid'

type PermissionMatrixPanelProps = {
  roleName?: string
  selectedRoleId: number | null
  roleMatrixLoading: boolean
  scopeType: ScopeType
  onScopeTypeChange: (value: ScopeType) => void
  displayedRows: PermissionMatrixRow[]
  draftRows: DraftMatrixRow[]
  columnState: Record<MatrixAction, MatrixColumnState>
  hasPendingMatrixChanges: boolean
  onEditRole: () => void
  onDeleteRole: () => void
  onMatrixToggle: (resource: string, action: MatrixAction) => void
  onToggleColumn: (action: MatrixAction) => void
  onDiscardChanges: () => void
  onSaveMatrix: () => void
}

export const PermissionMatrixPanel = ({
  roleName,
  selectedRoleId,
  roleMatrixLoading,
  scopeType,
  onScopeTypeChange,
  displayedRows,
  draftRows,
  columnState,
  hasPendingMatrixChanges,
  onEditRole,
  onDeleteRole,
  onMatrixToggle,
  onToggleColumn,
  onDiscardChanges,
  onSaveMatrix,
}: PermissionMatrixPanelProps) => (
  <section className="app-panel-glass col-span-12 flex flex-col rounded-3xl p-5 xl:col-span-8">
    <div className="sticky top-0 z-10 space-y-4 bg-transparent pb-4">
      <div className="app-glass-inset flex w-full items-start gap-3 rounded-2xl px-4 py-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-brand-accent" />
        <PanelHeader roleName={roleName} />
      </div>
      <div className="flex flex-wrap justify-between gap-3">
        <RoleActions
          selectedRoleId={selectedRoleId}
          onEditRole={onEditRole}
          onDeleteRole={onDeleteRole}
        />
        <Select
          value={scopeType}
          onValueChange={(value) => onScopeTypeChange(value as ScopeType)}
        >
          <HeaderFilterSelect active={scopeType !== 'all'} className="w-auto min-w-45">
            <SelectValue placeholder="Область" />
          </HeaderFilterSelect>
          <SelectContent>
            <SelectItem value="all">Область: все</SelectItem>
            <SelectItem value="subtree">Область: поддерево</SelectItem>
            <SelectItem value="own">Область: только свои</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="admin-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
      {roleMatrixLoading ? (
        <Loading />
      ) : selectedRoleId ? (
        <PermissionCardsGrid
          displayedRows={displayedRows}
          draftRows={draftRows}
          columnState={columnState}
          selectedRoleId={selectedRoleId}
          roleMatrixLoading={roleMatrixLoading}
          onMatrixToggle={onMatrixToggle}
          onToggleColumn={onToggleColumn}
        />
      ) : (
        <p className="text-sm text-app-text-muted">Выберите роль для загрузки матрицы</p>
      )}
    </div>

    {hasPendingMatrixChanges && selectedRoleId && !roleMatrixLoading && (
      <div className="app-glass-inset sticky bottom-0 z-10 mt-4 flex justify-end gap-3 border-t border-app-border/60 pt-4">
        <button
          type="button"
          onClick={onDiscardChanges}
          className="rounded-full bg-app-surface-3 px-5 py-2 text-sm font-medium"
        >
          Отменить
        </button>
        <button
          type="button"
          onClick={onSaveMatrix}
          className="rounded-full bg-brand-accent px-6 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.2)]"
        >
          Сохранить матрицу
        </button>
      </div>
    )}
  </section>
)

const PanelHeader = ({ roleName }: { roleName?: string }) => (
  <div>
    <p className="text-sm font-bold">Настройка: {roleName ?? 'Роль'}</p>
    <p className="text-xs text-app-text-muted">
      Изменения логируются и применяются согласно выбранной области роли
    </p>
  </div>
)

const RoleActions = ({
  selectedRoleId,
  onEditRole,
  onDeleteRole,
}: Pick<PermissionMatrixPanelProps, 'selectedRoleId' | 'onEditRole' | 'onDeleteRole'>) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onEditRole}
      disabled={!selectedRoleId}
      className="app-glass-inset app-glass-inset-hover rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
    >
      Редактировать роль
    </button>
    <button
      type="button"
      onClick={onDeleteRole}
      disabled={!selectedRoleId}
      className="rounded-full border border-red-500/35 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
    >
      Удалить роль
    </button>
  </div>
)
