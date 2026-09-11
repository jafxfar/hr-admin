import type { Metadata } from 'next'
import { CombinedDashboardPage } from '@/components/dashboard'

export const metadata: Metadata = {
  title: 'Статистика',
  description: 'Табель, KPI и вакансии',
}

export default function DashboardPage() {
  return <CombinedDashboardPage />
}
