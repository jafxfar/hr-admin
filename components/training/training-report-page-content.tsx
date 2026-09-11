'use client'

import { Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { HRLayout } from '@/components/hr-layout'
import Loading from '@/components/ui/loading'
import { useEmployeesFiltered } from '@/hooks/use-employees'
import { useLmsCourses, useLmsLeaderboard } from '@/hooks/use-lms'

export const TrainingReportPageContent = () => {
  const { data: courses = [], isLoading: coursesLoading, isError: coursesError } = useLmsCourses()
  const { data: userLeaders = [], isLoading: usersLoading, isError: usersError } = useLmsLeaderboard('user', 8)
  const { data: departmentLeaders = [], isLoading: departmentsLoading, isError: departmentsError } = useLmsLeaderboard(
    'department',
    8,
  )
  const { data: employeesPage, isLoading: employeesLoading } = useEmployeesFiltered({
    employee_status: 'active',
    page: 1,
    page_size: 1,
  })

  const enrolled = courses.reduce((sum, course) => sum + (course.users_count ?? 0), 0)
  const employeeCount = employeesPage?.total ?? 0
  const completionRate =
    employeeCount > 0 && courses.length > 0
      ? Math.min(100, Math.round((enrolled / (employeeCount * courses.length)) * 100))
      : 0

  const isLoading = coursesLoading || usersLoading || departmentsLoading || employeesLoading
  const hasLoadError = coursesError || usersError || departmentsError
  const departmentChartData = Array.isArray(departmentLeaders) ? departmentLeaders : []

  return (
    <HRLayout title="Отчёт по обучению">
      <div className="admin-content-inset space-y-5 text-app-text">
        {isLoading ? (
          <Loading />
        ) : hasLoadError ? (
          <p className="text-sm text-app-text-muted">Не удалось загрузить отчёт по обучению.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-app-text-muted">Назначения</span>
                <span className="nav-pill-active rounded-full px-4 py-1.5 text-sm font-semibold">
                  {enrolled}
                </span>
                <span className="text-xs text-app-text-muted">Покрытие</span>
                <span className="rounded-full bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 py-1.5 text-sm font-semibold">
                  {completionRate}%
                </span>
              </div>
              <div className="ml-auto flex items-center gap-6">
                {[
                  { n: employeeCount, label: 'Сотрудники' },
                  { n: courses.length, label: 'Курсы' },
                  { n: enrolled, label: 'Записи' },
                ].map((item) => (
                  <div key={item.label} className="text-right">
                    <p className="text-2xl font-bold leading-none">{item.n}</p>
                    <p className="mt-0.5 text-xs font-medium text-app-text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="app-panel-glass p-5">
                <h2 className="text-sm font-bold">Очки по отделам</h2>
                <p className="mb-4 text-xs text-app-text-muted">Лидерборд подразделений</p>
                {departmentChartData.length === 0 ? (
                  <p className="text-sm text-app-text-muted">Пока нет данных.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} hide />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="points" fill="rgb(var(--theme-primary-rgb))" radius={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  {departmentLeaders.slice(0, 5).map((row) => (
                    <div key={row.entity_id} className="flex items-center justify-between text-sm">
                      <span className="truncate text-app-text-muted">
                        {row.rank}. {row.name || `Отдел ${row.entity_id}`}
                      </span>
                      <span className="font-semibold">{row.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="app-panel-glass p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold">Таблица лидеров XP</h2>
                    <p className="text-xs text-app-text-muted">Лучшие сотрудники</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--theme-primary-rgb)/0.12)] px-2.5 py-1 text-xs font-medium text-brand-accent">
                    <Trophy className="h-3 w-3" />
                    XP
                  </span>
                </div>
                {userLeaders.length === 0 ? (
                  <p className="text-sm text-app-text-muted">Пока нет данных.</p>
                ) : (
                  <div className="space-y-2">
                    {userLeaders.map((row) => (
                      <div
                        key={row.entity_id}
                        className="flex items-center justify-between rounded-xl bg-[rgb(var(--theme-primary-rgb)/0.06)] px-3 py-2 text-sm"
                      >
                        <span className="truncate">
                          {row.rank}. {row.name?.trim() || `Сотрудник ${row.entity_id}`}
                        </span>
                        <span className="font-semibold">{row.points} XP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </HRLayout>
  )
}
