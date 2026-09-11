'use client'

import { HRLayout } from '@/components/hr-layout'
import {
  BranchesFilters,
  BranchesTable,
  BranchCreateModal,
  BranchEditModal,
  BranchDeleteModal,
} from '@/components/branches'
import { useBranchesPage } from '@/hooks/use-branches-page'
import { Plus } from 'lucide-react'

export default function BranchesPage() {
  const p = useBranchesPage()

  return (
    <HRLayout
      title="Филиалы"
      action={{
        label: 'Добавить филиал',
        icon: <Plus className="w-4 h-4" />,
        onClick: p.openCreate,
      }}
      topActions={<BranchesFilters search={p.search} onSearchChange={p.setSearch} />}
    >
      <div className="admin-content-inset">
      <BranchesTable
        branches={p.branches}
        isLoading={p.isLoading}
        page={p.page}
        totalPages={p.totalPages}
        onPageChange={p.setPage}
        onEdit={p.openEdit}
        onDelete={p.setDeleteId}
      />
      </div>
      <BranchCreateModal
        open={p.createOpen}
        name={p.createName}
        description={p.createDescription}
        code={p.createCode}
        mutation={p.createMutation}
        onClose={() => p.setCreateOpen(false)}
        onNameChange={p.setCreateName}
        onDescriptionChange={p.setCreateDescription}
        onCodeChange={p.setCreateCode}
        onSave={p.handleCreateSave}
      />

      <BranchEditModal
        open={p.editId !== null}
        name={p.editName}
        description={p.editDescription}
        code={p.editCode}
        isActive={p.editIsActive}
        activeSwitchId={p.branchActiveSwitchId}
        mutation={p.updateMutation}
        onClose={() => p.setEditId(null)}
        onNameChange={p.setEditName}
        onDescriptionChange={p.setEditDescription}
        onCodeChange={p.setEditCode}
        onIsActiveChange={p.setEditIsActive}
        onSave={p.handleEditSave}
      />

      <BranchDeleteModal
        open={p.deleteId !== null}
        mutation={p.deleteMutation}
        onClose={() => p.setDeleteId(null)}
        onConfirm={p.handleDeleteConfirm}
      />
    </HRLayout>
  )
}
