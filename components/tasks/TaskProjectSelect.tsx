'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HeaderFilterSelect } from '@/components/hr-header-controls'
import { useProjects } from '@/hooks/use-projects'
import {
  ALL_PROJECTS_VALUE,
  NO_PROJECT_VALUE,
} from '@/hooks/use-task-page-filters'

const PROJECTS_PAGE_SIZE = 100

type TaskProjectSelectProps = {
  value: string
  onChange: (value: string) => void
  includeAllOption?: boolean
  includeNoneOption?: boolean
  placeholder?: string
  variant?: 'header' | 'form'
  className?: string
}

export const TaskProjectSelect = ({
  value,
  onChange,
  includeAllOption = false,
  includeNoneOption = false,
  placeholder = 'Проект',
  variant = 'form',
  className,
}: TaskProjectSelectProps) => {
  const { data } = useProjects('all', 1, PROJECTS_PAGE_SIZE)
  const projects = data?.items ?? []

  const handleChange = (next: string) => {
    onChange(next)
  }

  const trigger =
    variant === 'header' ? (
      <HeaderFilterSelect
        className={className ?? 'w-full min-w-56 max-w-md sm:w-72'}
        active={value !== ALL_PROJECTS_VALUE}
      >
        <SelectValue placeholder={placeholder} />
      </HeaderFilterSelect>
    ) : (
      <SelectTrigger className={className ?? 'rounded-3xl border-none bg-app-surface-1'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
    )

  return (
    <Select value={value} onValueChange={handleChange}>
      {trigger}
      <SelectContent>
        {includeAllOption ? (
          <SelectItem value={ALL_PROJECTS_VALUE}>Все проекты</SelectItem>
        ) : null}
        {includeNoneOption ? (
          <SelectItem value={NO_PROJECT_VALUE}>Без проекта</SelectItem>
        ) : null}
        {projects.map((project) => (
          <SelectItem key={project.id} value={String(project.id)}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
