'use client'

import { Suspense } from 'react'
import { EmployeeEditPageContent } from '@/components/employees/employee-edit-page-content'

export default function EmployeeViewPage() {
  return (
    <Suspense fallback={null}>
      <EmployeeEditPageContent />
    </Suspense>
  )
}
