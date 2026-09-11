'use client'

import { Suspense } from 'react'
import Loading from '../../components/ui/loading'
import { EmployeesPageContent } from '@/components/employees'

export default function EmployeesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EmployeesPageContent />
    </Suspense>
  )
}
