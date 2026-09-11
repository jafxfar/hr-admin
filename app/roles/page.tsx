'use client'

import { PlusCircle } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import Loading from '@/components/ui/loading'
import { RolesMatrixContent, RolesSearchToolbar } from '@/components/roles/roles-matrix-content'
import { useRolesMatrixPage } from '@/hooks/use-roles-matrix-page'

export default function RolesMatrixPage() {
  const view = useRolesMatrixPage()

  if (view.isPageLoading) {
    return (
      <HRLayout title="Архитектура доступа">
        <Loading />
      </HRLayout>
    )
  }

  return (
    <HRLayout
      title="Архитектура доступа"
      action={{
        label: 'Добавить роль',
        onClick: view.handleOpenCreateRole,
        icon: <PlusCircle className="h-4 w-4" />,
      }}
      topActions={
        <RolesSearchToolbar searchQuery={view.searchQuery} onSearchChange={view.setSearchQuery} />
      }
    >
      <div className="admin-content-inset space-y-3 text-app-text">
        <RolesMatrixContent {...view} />
      </div>
    </HRLayout>
  )
}
