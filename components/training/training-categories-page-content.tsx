'use client'

import type { ReactNode } from 'react'
import { Building2, FolderTree, Layers } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import Loading from '@/components/ui/loading'
import { useSearchDepartments } from '@/hooks/use-departments'
import { useLmsCourses } from '@/hooks/use-lms'
import { TrainingCourseCard } from '@/components/training/training-course-card'

export const TrainingCategoriesPageContent = () => {
  const { data: departmentsPage, isLoading: departmentsLoading } = useSearchDepartments('', 1, 50)
  const { data: courses = [], isLoading: coursesLoading } = useLmsCourses()
  const departments = departmentsPage?.items ?? []
  const isLoading = departmentsLoading || coursesLoading

  return (
    <HRLayout title="Категории курсов">
      <div className="admin-content-inset space-y-5 text-app-text">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric
                icon={<FolderTree className="h-4 w-4" />}
                title="Отделы"
                value={departments.length}
                subtitle="Группы для назначения"
              />
              <Metric
                icon={<Layers className="h-4 w-4" />}
                title="Курсы"
                value={courses.length}
                subtitle="Пока без привязки к категориям"
              />
              <Metric
                icon={<Building2 className="h-4 w-4" />}
                title="Назначения"
                value={courses.reduce((sum, course) => sum + (course.users_count ?? 0), 0)}
                subtitle="Записи на курсы"
              />
            </div>

            <p className="text-sm text-app-text-muted">
              Отдельного API категорий курсов пока нет. Ниже отделы компании — их можно использовать как ориентир
              при назначении обучения.
            </p>

            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <span
                  key={department.id}
                  className="rounded-full bg-[rgb(var(--theme-primary-rgb)/0.08)] px-3 py-1.5 text-xs font-semibold text-app-text"
                >
                  {department.name}
                </span>
              ))}
              {departments.length === 0 ? (
                <span className="text-sm text-app-text-muted">Отделы не найдены.</span>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <TrainingCourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </HRLayout>
  )
}

const Metric = ({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: ReactNode
  title: string
  value: number
  subtitle: string
}) => (
  <div className="app-panel-glass p-4">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent text-brand-accent-on">
      {icon}
    </div>
    <p className="text-xs text-app-text-muted">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-medium text-app-text-muted">{subtitle}</p>
  </div>
)
