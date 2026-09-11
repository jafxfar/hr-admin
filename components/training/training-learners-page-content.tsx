'use client'

import { useMemo, useState } from 'react'
import { Crown, Medal, UserPlus } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import { HeaderSearchInput } from '@/components/hr-header-controls'
import Loading from '@/components/ui/loading'
import { Modal, ModalActions, ModalHeader } from '@/components/custom-ui/modal'
import { useEmployeesFiltered } from '@/hooks/use-employees'
import { useLmsCourses, useLmsLeaderboard, useRegisterEmployeeToCourse } from '@/hooks/use-lms'
import { useToast } from '@/hooks/use-toast'
import type { Employee } from '@/types/employees'
import type { LmsLeaderboardEntry } from '@/types/lms'

const getEmployeeName = (employee: Employee) => {
  const firstName = employee.properties?.first_name?.trim() ?? ''
  const lastName = employee.properties?.last_name?.trim() ?? ''
  return [lastName, firstName].filter(Boolean).join(' ') || employee.email
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?'

export const TrainingLearnersPageContent = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const { data: employeesPage, isLoading: employeesLoading } = useEmployeesFiltered({
    q: search,
    employee_status: 'active',
    page: 1,
    page_size: 50,
  })
  const { data: leaders = [], isLoading: leadersLoading, isError: leadersError } = useLmsLeaderboard('user', 50)
  const { data: courses = [], isError: coursesError } = useLmsCourses()
  const registerEmployee = useRegisterEmployeeToCourse()

  const employees = employeesPage?.items ?? []
  const pointsByUser = useMemo(() => {
    const map = new Map<number, LmsLeaderboardEntry>()
    leaders.forEach((row) => map.set(row.entity_id, row))
    return map
  }, [leaders])

  const podium = leaders.slice(0, 3)
  const isLoading = employeesLoading || leadersLoading
  const hasLoadError = leadersError || coursesError

  const handleAssign = () => {
    if (!selectedEmployeeId || !selectedCourseId) return
    registerEmployee.mutate(
      { courseId: selectedCourseId, employeeId: selectedEmployeeId },
      {
        onSuccess: () => {
          toast({ title: 'Сотрудник назначен на курс' })
          setAssignOpen(false)
          setSelectedEmployeeId(null)
          setSelectedCourseId(null)
        },
        onError: () => toast({ title: 'Не удалось назначить', variant: 'destructive' }),
      },
    )
  }

  return (
    <HRLayout
      title="Учащиеся"
      topActions={<HeaderSearchInput value={search} onChange={setSearch} placeholder="Поиск сотрудников..." />}
      action={{
        label: 'Назначить на курс',
        icon: <UserPlus className="h-4 w-4" />,
        onClick: () => setAssignOpen(true),
      }}
    >
      <div className="admin-content-inset space-y-5 text-app-text">
        {isLoading ? (
          <Loading />
        ) : hasLoadError ? (
          <p className="text-sm text-app-text-muted">Не удалось загрузить данные обучения.</p>
        ) : (
          <>
            <div className="app-panel-glass p-5">
              <h2 className="text-sm font-bold">Лучшие по XP</h2>
              <p className="mb-4 text-xs text-app-text-muted">Лидерборд обучения</p>
              {podium.length === 0 ? (
                <p className="text-sm text-app-text-muted">Пока нет очков.</p>
              ) : (
                <div className="flex items-end justify-center gap-4 pt-2">
                  {podium[1] ? <PodiumPlace entry={podium[1]} place={2} /> : null}
                  {podium[0] ? <PodiumPlace entry={podium[0]} place={1} /> : null}
                  {podium[2] ? <PodiumPlace entry={podium[2]} place={3} /> : null}
                </div>
              )}
            </div>

            <div className="app-panel-glass overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-4 border-b border-app-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-app-text-muted">
                <span>Сотрудник</span>
                <span>XP</span>
                <span>Отдел</span>
              </div>
              {employees.length === 0 ? (
                <p className="px-5 py-6 text-sm text-app-text-muted">Сотрудники не найдены.</p>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="grid grid-cols-[2fr_1fr_1.5fr] gap-4 border-b border-app-border px-5 py-3 text-sm last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{getEmployeeName(employee)}</p>
                      <p className="text-xs text-app-text-muted">{employee.email}</p>
                    </div>
                    <p className="font-semibold">{pointsByUser.get(employee.id)?.points ?? 0}</p>
                    <p className="truncate text-app-text-muted">
                      {employee.department?.name ?? '—'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <Modal open={assignOpen} onClose={() => setAssignOpen(false)}>
        <ModalHeader
          icon={UserPlus}
          title="Назначить на курс"
          subtitle="Сотрудник получит запись в обучении"
          onClose={() => setAssignOpen(false)}
        />
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Сотрудник</span>
            <select
              value={selectedEmployeeId ?? ''}
              onChange={(event) => setSelectedEmployeeId(Number(event.target.value) || null)}
              className="h-10 w-full rounded-full border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 text-sm text-app-text outline-none"
              aria-label="Сотрудник"
            >
              <option value="">Выберите</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {getEmployeeName(employee)}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Курс</span>
            <select
              value={selectedCourseId ?? ''}
              onChange={(event) => setSelectedCourseId(Number(event.target.value) || null)}
              className="h-10 w-full rounded-full border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 text-sm text-app-text outline-none"
              aria-label="Курс"
            >
              <option value="">Выберите</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ModalActions
          onCancel={() => setAssignOpen(false)}
          onConfirm={handleAssign}
          confirmLabel="Назначить"
          confirmDisabled={!selectedEmployeeId || !selectedCourseId}
          confirmLoading={registerEmployee.isPending}
        />
      </Modal>
    </HRLayout>
  )
}

const PodiumPlace = ({
  entry,
  place,
}: {
  entry: LmsLeaderboardEntry
  place: 1 | 2 | 3
}) => {
  const name = entry.name?.trim() || `Сотрудник ${entry.entity_id}`
  const isFirst = place === 1

  return (
    <div className="flex flex-col items-center gap-2">
      {isFirst ? <Crown className="h-5 w-5 text-brand-accent" /> : null}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--theme-primary-rgb)/0.12)] text-xs font-bold text-brand-accent">
        {getInitials(name)}
      </div>
      <div
        className={
          isFirst
            ? 'flex h-28 w-24 flex-col items-center justify-center rounded-t-xl bg-[rgb(var(--theme-primary-rgb)/0.12)]'
            : 'flex h-20 w-20 flex-col items-center justify-center rounded-t-xl bg-[rgb(var(--theme-primary-rgb)/0.08)]'
        }
      >
        <Medal className="h-4 w-4 text-brand-accent" />
        <p className="text-xs font-bold">{place}-е</p>
        <p className="text-xs font-medium text-app-text-muted">{entry.points} XP</p>
      </div>
      <p className="w-24 truncate text-center text-xs font-medium">{name.split(' ')[0]}</p>
    </div>
  )
}
