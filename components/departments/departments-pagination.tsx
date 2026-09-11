'use client'

import { Button } from '@/components/ui/button'

type DepartmentsPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (updater: (p: number) => number) => void
}

export const DepartmentsPagination = ({
  page,
  totalPages,
  onPageChange,
}: DepartmentsPaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="sticky bottom-0 z-20 flex items-center justify-center gap-2 pt-6 bg-gradient-to-t from-app-bg via-app-bg to-transparent">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange((p) => p - 1)}
      >
        Назад
      </Button>
      <span className="text-sm text-gray-500">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange((p) => p + 1)}
      >
        Вперёд
      </Button>
    </div>
  )
}
