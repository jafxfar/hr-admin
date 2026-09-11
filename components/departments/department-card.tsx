'use client'

import { useRouter } from 'next/navigation'
import {
  Building2,
  Users,
  Pencil,
  Trash2,
  ChevronRight,
  UserCircle2,
  Cpu,
  Palette,
  Megaphone,
  FlaskConical,
  BarChart2,
  ShieldCheck,
  Boxes,
} from 'lucide-react'
import type { Department } from '@/types/departments'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildFileUrl } from '@/lib/files'
import { getIconByName } from '@/lib/lucide-icons'

type DepartmentCardProps = {
  dept: Department
  index: number
  onEdit: (dept: Department) => void
  onDelete: (dept: Department) => void
}

const fallbackIconSet = [Cpu, Palette, Megaphone, FlaskConical, BarChart2, ShieldCheck, Boxes, Building2]

export const DepartmentCard = ({ dept, index, onEdit, onDelete }: DepartmentCardProps) => {
  const router = useRouter()

  const headName = dept.head_user
    ? [dept.head_user.first_name, dept.head_user.last_name].filter(Boolean).join(' ') ||
      dept.head_user.full_name ||
      'Не назначен'
    : 'Не назначен'

  const headInitials = dept.head_user
    ? dept.head_user.full_name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join('') ||
      [dept.head_user.first_name?.[0], dept.head_user.last_name?.[0]].filter(Boolean).join('')
    : ''

  const headPhotoUrl =
    dept.head_user?.profile_photo_url && dept.head_user.exists !== false
      ? buildFileUrl(dept.head_user.profile_photo_url)
      : undefined

  const DeptIcon = getIconByName(dept.icon) ?? fallbackIconSet[index % fallbackIconSet.length]
  const accentAlt = index % 3 === 1

  return (
    <div className="app-card-glass group flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5">
      <div className="mb-6 flex items-start justify-between">
        <div className={`rounded-2xl bg-app-surface-1 p-3 ${accentAlt ? 'text-secondary' : 'text-brand-accent'}`}>
          <DeptIcon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(dept)}
            className="p-2 rounded-xl text-app-text-muted hover:text-app-text hover:bg-app-surface-2/80 transition-colors"
            title="Редактировать"
            aria-label="Редактировать отдел"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(dept)}
            className="p-2 rounded-xl text-app-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Удалить"
            aria-label="Удалить отдел"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="mb-3 text-xl font-bold leading-tight text-app-text">{dept.name}</h3>

      {dept.description ? (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-app-text-muted">{dept.description}</p>
      ) : null}

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-app-border bg-app-surface-1 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-accent/25 bg-app-surface-2">
          {dept.head_user ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={headPhotoUrl ?? '/default-avatar.png'} alt={headName} className="object-cover" />
              <AvatarFallback className="bg-app-surface-3 text-brand-accent font-bold text-sm">
                {headInitials || <UserCircle2 className="w-7 h-7 text-app-text-muted" />}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserCircle2 className="w-7 h-7 text-app-text-muted" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-app-text">{headName}</p>
          <p className="text-xs font-medium text-app-text-muted">Руководитель отдела</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-app-border pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-app-text-muted">Уровень</span>
          <span className="text-base font-bold text-app-text">
            {dept.level !== undefined ? `Уровень ${dept.level}` : '—'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/departments/${dept.id}`)}
          className="flex items-center gap-2 rounded-full bg-brand-accent/10 px-4 py-2 text-xs font-bold text-brand-accent transition-colors hover:bg-brand-accent/20"
          aria-label={`Сотрудники отдела ${dept.name}`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Сотрудники</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
