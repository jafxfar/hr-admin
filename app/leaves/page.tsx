'use client'

import { HRLayout } from '@/components/hr-layout'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { LeavesTable } from '@/components/leaves'
import { Suspense, useState } from 'react'
import Loading from '../../components/ui/loading'
import { useSalary as useVacations, useCreateSalaryMutation as useCreateVacationMutation, useUpdateSalaryMutation as useUpdateVacationMutation, useDeleteVacationMutation } from '@/hooks/use-vacations'
import { useEmployees } from '@/hooks/use-employees'
import { VacationStatus } from '@/types/vacation'
import type { Vacation } from '@/types/vacation'
import { addDays, isWithinInterval, parseISO } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { HeaderFilterSelect } from '@/components/hr-header-controls'
import { Calendar, Clock, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export default function LeavesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLeave, setSelectedLeave] = useState<Vacation | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const { data: vacationsData, isLoading: vacationsLoading } = useVacations(page, PAGE_SIZE)
  const { data: employeesData, isLoading: employeesLoading } = useEmployees(1, 20)
  const createMutation = useCreateVacationMutation()
  const updateMutation = useUpdateVacationMutation()
  const deleteMutation = useDeleteVacationMutation()

  const vacations = vacationsData?.items ?? []
  const employees = employeesData?.items ?? []

  const isLoading = vacationsLoading || employeesLoading

  const filtered = vacations.filter((v) => {
    const emp = employees.find((e) => e.id === v.user_id)
    const fullName = [emp?.properties?.last_name, emp?.properties?.first_name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Metrics
  const today = new Date()
  const in7Days = addDays(today, 7)
  const currentlyAway = vacations.filter(
    (v) =>
      v.status === VacationStatus.APPROVED &&
      isWithinInterval(today, { start: parseISO(v.started_at), end: parseISO(v.ended_at) })
  ).length
  const pendingApprovals = vacations.filter((v) => v.status === VacationStatus.PENDING).length
  const upcomingIn7Days = vacations.filter(
    (v) =>
      v.status === VacationStatus.APPROVED &&
      parseISO(v.started_at) > today &&
      parseISO(v.started_at) <= in7Days
  ).length

  return (
    <HRLayout
      title="Отпуски"
      searchValue={search}
      searchPlaceholder='Поиск по имени сотрудника...'
      onSearchChange={setSearch}
      topActions={
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <HeaderFilterSelect active={statusFilter !== 'all'} className="w-40">
            <SelectValue placeholder="Все статусы" />
          </HeaderFilterSelect>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value={VacationStatus.PENDING}>На рассмотрении</SelectItem>
            <SelectItem value={VacationStatus.APPROVED}>Одобрено</SelectItem>
            <SelectItem value={VacationStatus.REJECTED}>Отклонено</SelectItem>
            <SelectItem value={VacationStatus.CANCALLED}>Отменено</SelectItem>
          </SelectContent>
        </Select>
      }>
      <Suspense fallback={<Loading />}>
        <div className="admin-content-inset space-y-3">

          {!isLoading && (
            <section className="admin-card-grid grid grid-cols-1 md:grid-cols-3">
              <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
                <StatHeader label="В отпуске сейчас" icon={Plane} />
                <p className="mt-4 text-4xl font-black">{currentlyAway}</p>
                <p className="mt-2 text-xs text-app-text-muted">Live</p>
              </div>
              <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
                <StatHeader label="Ожидают подтверждения" icon={Clock} />
                <p className="mt-4 text-4xl font-black">{pendingApprovals}</p>
                {pendingApprovals > 0 ? (
                  <p className="mt-2 text-xs text-brand-accent">ТРЕБУЕТСЯ ДЕЙСТВИЕ</p>
                ) : (
                  <p className="mt-2 text-xs text-app-text-muted">Очередь пуста</p>
                )}
              </div>
              <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
                <StatHeader label="Предстоит в течение 7 дней" icon={Calendar} />
                <p className="mt-4 text-4xl font-black">{upcomingIn7Days}</p>
              </div>
            </section>
          )}

          <Tabs defaultValue="leaves" className="w-full">
            <TabsContent value="leaves" className="m-0">
              {isLoading ? (
                <Loading />
              ) : (
                <LeavesTable
                  leaves={filtered}
                  employees={employees}
                  total={vacationsData?.total ?? 0}
                  page={vacationsData?.page ?? page}
                  totalPages={vacationsData?.total_pages ?? 1}
                  onPageChange={setPage}
                  onRowClick={(leave) => setSelectedLeave(leave)}
                  onDelete={(leave) => deleteMutation.mutate(leave.id)}
                  onStatusUpdate={(leave, status) =>
                    updateMutation.mutate({ vacation_id: leave.id, data: { status } })
                  }
                  isUpdating={updateMutation.isPending}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </HRLayout>
  )
}
const StatHeader = ({
  label,
  icon: Icon,
}: {
  label: string
  icon: LucideIcon
}) => (
  <div className="flex items-center justify-between">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-app-text-muted">{label}</p>
    <Icon className="h-4 w-4 text-brand-accent" />
  </div>
)

