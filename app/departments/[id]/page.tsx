'use client'

import { HRLayout } from '@/components/hr-layout'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useDepartmentDetailPage } from '@/hooks/use-department-detail-page'
import { useAddEmployeeToDepartment } from '@/hooks/use-add-employee-to-department'
import { DepartmentEmployeesSection } from '@/components/departments/department-employees-section'
import { EditDepartmentModal } from '@/components/departments/edit-department-modal'
import { AddEmployeeToDepartmentModal } from '@/components/departments/add-employee-to-department-modal'

export default function DepartmentDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const departmentId = Number(params.id)

  const detail = useDepartmentDetailPage(departmentId)
  const addEmployee = useAddEmployeeToDepartment(
    departmentId,
    detail.currentDepartment,
    detail.branchesEnabled,
  )

  return (
    <HRLayout
      title="Отдел"
      topActions={
        <div className="flex items-center w-full justify-between gap-2">
        <button
          type="button"
          onClick={() => router.push('/departments')}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-app-text-muted hover:text-app-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к отделам
        </button>
        <button
        type="button"
        onClick={addEmployee.openAddModal}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-app-bg bg-brand-accent hover:opacity-90 transition-opacity"
      >
        <UserPlus className="w-4 h-4" />
        Добавить в отдел
      </button>
          </div>
      }
    >
      <div className="px-5 pt-4 space-y-6">
        <DepartmentEmployeesSection
          empLoading={detail.empLoading}
          employees={detail.employees}
          total={detail.employeesData?.total ?? 0}
          page={detail.page}
          totalPages={detail.totalPages}
          onPageChange={detail.setPage}
          branchesEnabled={detail.branchesEnabled}
        />
      </div>

      <EditDepartmentModal
        open={detail.editOpen}
        onClose={() => detail.setEditOpen(false)}
        excludeDepartmentId={departmentId}
        name={detail.editName}
        onNameChange={detail.setEditName}
        description={detail.editDescription}
        onDescriptionChange={detail.setEditDescription}
        parentId={detail.editParentId}
        onParentIdChange={detail.setEditParentId}
        headUserId={detail.editHeadUserId}
        onHeadUserIdChange={detail.setEditHeadUserId}
        allowedPositionIds={detail.editAllowedPositionIds}
        onAllowedPositionIdsChange={detail.setEditAllowedPositionIds}
        branchId={detail.editBranchId}
        onBranchIdChange={detail.setEditBranchId}
        branchesEnabled={detail.branchesEnabled}
        allDepartments={detail.allDepartments}
        allEmployees={detail.allEmployees}
        branchSelectOptions={detail.branchSelectOptions}
        onConfirm={detail.handleEditSave}
        isUpdating={detail.isUpdating}
        headVariant="detail"
      />

      <AddEmployeeToDepartmentModal
        open={addEmployee.addOpen}
        onClose={addEmployee.closeAddModal}
        addUserId={addEmployee.addUserId}
        onAddUserIdChange={addEmployee.setAddUserId}
        addUserSearch={addEmployee.addUserSearch}
        onAddUserSearchChange={addEmployee.setAddUserSearch}
        addUserSearchItems={addEmployee.addUserSearchItems}
        isAddUserSearchLoading={addEmployee.isAddUserSearchLoading}
        addPositionId={addEmployee.addPositionId}
        onAddPositionIdChange={addEmployee.setAddPositionId}
        deptPositions={addEmployee.deptPositions}
        deptPositionsLoading={addEmployee.deptPositionsLoading}
        addManagerId={addEmployee.addManagerId}
        onAddManagerIdChange={addEmployee.setAddManagerId}
        managerCandidates={addEmployee.managerCandidates}
        addPositionChangeReason={addEmployee.addPositionChangeReason}
        onAddPositionChangeReasonChange={addEmployee.setAddPositionChangeReason}
        addPositionChangeBasisType={addEmployee.addPositionChangeBasisType}
        onAddPositionChangeBasisTypeChange={addEmployee.setAddPositionChangeBasisType}
        addPositionChangeBasisFilename={addEmployee.addPositionChangeBasisFilename}
        addPositionChangeFileError={addEmployee.addPositionChangeFileError}
        fileInputRef={addEmployee.addPositionChangeFileInputRef}
        onFileSelect={addEmployee.handleAddPositionChangeFile}
        assignMutation={addEmployee.assignToDepartment}
        onConfirm={addEmployee.handleAddToDepartment}
      />
    </HRLayout>
  )
}
