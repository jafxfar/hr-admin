'use client'

import { Building2 } from 'lucide-react'
import type { Department } from '@/types/departments'
import { DepartmentCard } from '@/components/departments/department-card'

type DepartmentsGridProps = {
  isLoading: boolean
  departments: Department[]
  onEdit: (dept: Department) => void
  onDelete: (dept: Department) => void
}

export const DepartmentsGrid = ({
  isLoading,
  departments,
  onEdit,
  onDelete,
}: DepartmentsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-app-text-muted text-sm">
        Загрузка...
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-app-text-muted">
        <Building2 className="w-10 h-10 opacity-40" />
        <span className="text-sm">Отделы не найдены</span>
      </div>
    )
  }

  return (
    <div className="admin-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((dept, index) => (
        <DepartmentCard
          key={dept.id}
          dept={dept}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
