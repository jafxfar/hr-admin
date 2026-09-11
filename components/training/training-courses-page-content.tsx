'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import { HeaderSearchInput } from '@/components/hr-header-controls'
import Loading from '@/components/ui/loading'
import { CreateCourseModal } from '@/components/training/create-course-modal'
import { TrainingCourseCard } from '@/components/training/training-course-card'
import { useLmsCourses } from '@/hooks/use-lms'
import { cn } from '@/lib/utils'

type CourseFilter = 'all' | 'active' | 'draft'

export const TrainingCoursesPageContent = () => {
  const router = useRouter()
  const { data: courses = [], isLoading, isError } = useLmsCourses()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CourseFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const enrolled = course.users_count ?? 0
      const matchSearch = course.title.toLowerCase().includes(query)
      const matchFilter =
        filter === 'all' ? true : filter === 'active' ? enrolled > 0 : enrolled === 0
      return matchSearch && matchFilter
    })
  }, [courses, filter, search])

  const stats = {
    total: courses.length,
    active: courses.filter((course) => (course.users_count ?? 0) > 0).length,
    draft: courses.filter((course) => (course.users_count ?? 0) === 0).length,
  }

  return (
    <HRLayout
      title="Курсы"
      topActions={<HeaderSearchInput value={search} onChange={setSearch} placeholder="Поиск курсов..." />}
      action={{
        label: 'Новый курс',
        icon: <PlusCircle className="h-4 w-4" />,
        onClick: () => setCreateOpen(true),
      }}
    >
      <div className="admin-content-inset space-y-5 text-app-text">
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: 'Всего', value: stats.total, id: 'all' as const },
            { label: 'С учащимися', value: stats.active, id: 'active' as const },
            { label: 'Без назначений', value: stats.draft, id: 'draft' as const },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === item.id
                  ? 'nav-pill-active'
                  : 'bg-[rgb(var(--theme-primary-rgb)/0.08)] text-app-text-muted hover:text-app-text',
              )}
            >
              {item.label}
              <span>{item.value}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-sm text-app-text-muted">Не удалось загрузить курсы.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-app-text-muted">Курсов пока нет.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <TrainingCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      <CreateCourseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(courseId) => router.push(`/training/courses/${courseId}`)}
      />
    </HRLayout>
  )
}
