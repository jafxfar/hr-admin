'use client'

import { HRLayout } from '@/components/hr-layout'
import { useState } from 'react'
import Loading from '@/components/ui/loading'
import { RolesTable, RoleDialog } from '@/components/roles'
import { Positions } from '@/types/positions'
import { CreatePositionRequest } from '@/api/positions'
import {
  usePositions,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} from '@/hooks/use-positions'
import { HeaderSearchInput } from '@/components/hr-header-controls'

export default function PositionsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Positions | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = usePositions(searchQuery, page, pageSize)
  const createMutation = useCreatePositionMutation()
  const updateMutation = useUpdatePositionMutation()
  const deleteMutation = useDeletePositionMutation()

  const filtered = data?.items ?? []

  const handleOpenCreate = () => {
    setEditingRole(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (role: Positions) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleSave = (formData: CreatePositionRequest) => {
    if (editingRole) {
      updateMutation.mutate({
        id: editingRole.id,
        data: { title: formData.title, description: formData.description },
      })
    } else {
      createMutation.mutate(formData)
    }
    setIsDialogOpen(false)
  }

  return (
    <HRLayout
      title="Должности"
      action={{ label: 'Добавить должность', onClick: handleOpenCreate }}
      topActions={
        <HeaderSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по должностям"
          widthClassName="w-64"
        />
      }
    >
      <div className="px-1 pt-4">
        {isLoading ? (
          <Loading />
        ) : (
          <RolesTable
            roles={filtered}
            total={data?.total ?? 0}
            page={data?.page ?? page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={setPage}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

      <RoleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        role={editingRole}
        mode={editingRole ? 'edit' : 'create'}
      />
    </HRLayout>
  )
}

