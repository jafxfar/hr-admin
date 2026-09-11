'use client'

import { RolesListPanel } from './roles-list-panel'
import { PermissionMatrixPanel } from './permission-matrix-panel'
import { RolesSecurityStats } from './roles-security-stats'
import { RoleRbacFormModal } from './role-rbac-form-modal'
import { RoleDeleteDialog } from './role-delete-dialog'
import { HeaderSearchInput } from '@/components/hr-header-controls'
import type { useRolesMatrixPage } from '@/hooks/use-roles-matrix-page'

type RolesMatrixContentProps = ReturnType<typeof useRolesMatrixPage>

export const RolesMatrixContent = (view: RolesMatrixContentProps) => (
  <>
    <p className="text-sm text-app-text-muted">
      Настраивайте детальные права и управляйте ролями в организации
    </p>

    <RolesSecurityStats />

    <div className="admin-card-grid grid grid-cols-12 gap-4">
      <RolesListPanel
        roles={view.filteredRoles}
        selectedRoleId={view.selectedRoleId}
        onSelectRole={view.setSelectedRoleId}
      />
      <PermissionMatrixPanel
        roleName={view.roleMatrix?.role_name}
        selectedRoleId={view.selectedRoleId}
        roleMatrixLoading={view.roleMatrixLoading}
        scopeType={view.scopeType}
        onScopeTypeChange={view.setScopeType}
        displayedRows={view.filteredDisplayedRows}
        draftRows={view.draftRows}
        columnState={view.columnState}
        hasPendingMatrixChanges={view.hasPendingMatrixChanges}
        onEditRole={view.handleOpenEditRole}
        onDeleteRole={() => view.setDeleteRoleOpen(true)}
        onMatrixToggle={view.handleMatrixToggle}
        onToggleColumn={view.handleToggleColumn}
        onDiscardChanges={view.handleDiscardChanges}
        onSaveMatrix={view.handleSaveMatrix}
      />
    </div>

    <RoleRbacFormModal
      open={view.roleFormOpen}
      mode={view.roleFormMode}
      name={view.roleFormName}
      description={view.roleFormDescription}
      isActive={view.roleFormIsActive}
      canAccessAdminUi={view.roleFormCanAccessAdminUi}
      isSaving={view.createRoleMutation.isPending || view.updateRoleMutation.isPending}
      onClose={() => view.setRoleFormOpen(false)}
      onNameChange={view.setRoleFormName}
      onDescriptionChange={view.setRoleFormDescription}
      onIsActiveChange={view.setRoleFormIsActive}
      onCanAccessAdminUiChange={view.setRoleFormCanAccessAdminUi}
      onSave={view.handleRoleFormSave}
    />

    <RoleDeleteDialog
      open={view.deleteRoleOpen}
      roleName={view.selectedRole?.name}
      isDeleting={view.deleteRoleMutation.isPending}
      canDelete={!!view.selectedRoleId}
      onOpenChange={view.setDeleteRoleOpen}
      onConfirm={view.handleConfirmDeleteRole}
    />
  </>
)

export const RolesSearchToolbar = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
}) => (
  <HeaderSearchInput
    value={searchQuery}
    onChange={onSearchChange}
    placeholder="Поиск по ролям или правам..."
    widthClassName="w-64"
  />
)
