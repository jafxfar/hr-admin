'use client'

import { HRLayout } from '@/components/hr-layout'
import { useDepartmentsListPage } from '@/hooks/use-departments-list-page'
import { DepartmentsGrid } from '@/components/departments/departments-grid'
import { DepartmentsPagination } from '@/components/departments/departments-pagination'
import { CreateDepartmentModal } from '@/components/departments/create-department-modal'
import { EditDepartmentModal } from '@/components/departments/edit-department-modal'
import { DeleteDepartmentModal } from '@/components/departments/delete-department-modal'
import { HeaderSearchInput } from '@/components/hr-header-controls'

export default function DepartmentsPage() {
  const page = useDepartmentsListPage()

  return (
    <HRLayout
      title="Отделы"
      action={{ label: 'Добавить отдел', onClick: page.openCreate }}
      topActions={
        <HeaderSearchInput
          value={page.search}
          onChange={page.setSearch}
          placeholder="Поиск по отделам"
          widthClassName="w-64"
        />
      }
    >
      <div className="admin-content-inset">
        <DepartmentsGrid
          isLoading={page.isLoading}
          departments={page.departments}
          onEdit={page.openEdit}
          onDelete={page.setDeleteTarget}
        />
        <DepartmentsPagination
          page={page.page}
          totalPages={page.totalPages}
          onPageChange={page.setPage}
        />
      </div>

      <CreateDepartmentModal
        open={page.isCreateOpen}
        onClose={() => page.setIsCreateOpen(false)}
        name={page.createName}
        onNameChange={page.setCreateName}
        description={page.createDescription}
        onDescriptionChange={page.setCreateDescription}
        parentId={page.createParentId}
        onParentIdChange={page.setCreateParentId}
        allowedPositionIds={page.createAllowedPositionIds}
        onAllowedPositionIdsChange={page.setCreateAllowedPositionIds}
        branchId={page.createBranchId}
        onBranchIdChange={page.setCreateBranchId}
        icon={page.createIcon}
        onIconChange={page.setCreateIcon}
        branchesEnabled={page.branchesEnabled}
        allDepartments={page.allDepartments}
        branchSelectOptions={page.branchSelectOptions}
        onConfirm={page.handleCreateSave}
        isCreating={page.isCreating}
      />

      <EditDepartmentModal
        open={!!page.editTarget}
        onClose={() => page.setEditTarget(null)}
        excludeDepartmentId={page.editTarget?.id}
        name={page.editName}
        onNameChange={page.setEditName}
        description={page.editDescription}
        onDescriptionChange={page.setEditDescription}
        parentId={page.editParentId}
        onParentIdChange={page.setEditParentId}
        headUserId={page.editHeadUserId}
        onHeadUserIdChange={page.setEditHeadUserId}
        allowedPositionIds={page.editAllowedPositionIds}
        onAllowedPositionIdsChange={page.setEditAllowedPositionIds}
        branchId={page.editBranchId}
        onBranchIdChange={page.setEditBranchId}
        branchesEnabled={page.branchesEnabled}
        allDepartments={page.allDepartments}
        allEmployees={page.allEmployees}
        branchSelectOptions={page.branchSelectOptions}
        onConfirm={page.handleEditSave}
        isUpdating={page.isUpdating}
        headVariant="list"
      />

      <DeleteDepartmentModal
        target={page.deleteTarget}
        isDeleting={page.isDeleting}
        onClose={() => page.setDeleteTarget(null)}
        onConfirm={page.handleDeleteConfirm}
      />
    </HRLayout>
  )
}
