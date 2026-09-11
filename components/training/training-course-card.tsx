'use client'

import Link from 'next/link'
import { BookOpen, Pencil, Users } from 'lucide-react'
import type { LmsCourse } from '@/types/lms'

type TrainingCourseCardProps = {
  course: LmsCourse
}

export const TrainingCourseCard = ({ course }: TrainingCourseCardProps) => {
  const enrolled = course.users_count ?? 0

  return (
    <article className="app-panel-glass flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--theme-primary-rgb)/0.12)] text-brand-accent">
          {course.image_url ? (
            <img src={course.image_url} alt="" className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <BookOpen className="h-5 w-5" />
          )}
        </div>
        <span className="rounded-full bg-[rgb(var(--theme-primary-rgb)/0.08)] px-3 py-1 text-xs font-semibold text-app-text-muted">
          {enrolled > 0 ? 'Активный' : 'Черновик'}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold leading-snug text-app-text">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-app-text-muted">
          {course.info?.trim() || 'Описание пока не указано'}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-app-text-muted">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" />
          {enrolled}
        </span>
        {course.max_points != null ? <span>{course.max_points} XP</span> : null}
      </div>

      <div className="flex items-center justify-end border-t border-app-border pt-3">
        <Link
          href={`/training/courses/${course.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-app-border bg-[rgb(var(--theme-primary-rgb)/0.08)] px-3 py-1 text-xs font-medium text-app-text-muted transition-colors hover:text-app-text"
        >
          <Pencil className="h-2.5 w-2.5" />
          Изменить
        </Link>
      </div>
    </article>
  )
}
