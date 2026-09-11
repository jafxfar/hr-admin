'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { VacancyApplicationBoardColumn as BoardColumn } from '@/types/vacancyApplicationBoard'
import type { VacancyApplication } from '@/types/vacancyApplications'
import { VacancyApplicationBoardCard, cardDragId } from './VacancyApplicationBoardCard'

export const columnDragId = (statusCode: string) => `column-${statusCode}`

interface VacancyApplicationBoardColumnProps {
  column: BoardColumn
  onOpenCard: (application: VacancyApplication) => void
  onAddApplicant?: (statusCode: string) => void
  onEditStatus?: (status: BoardColumn['status']) => void
  onDeleteStatus?: (status: BoardColumn['status']) => void
  isAddDisabled?: boolean
}

export const VacancyApplicationBoardColumn = ({
  column,
  onOpenCard,
  onAddApplicant,
  onEditStatus,
  onDeleteStatus,
  isAddDisabled = false,
}: VacancyApplicationBoardColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnDragId(column.status.code),
  })

  const itemIds = column.applications.map((app) => cardDragId(app.id))

  const handleAddClick = () => {
    if (isAddDisabled || !onAddApplicant) return
    onAddApplicant(column.status.code)
  }

  const handleAddKeyDown = (event: React.KeyboardEvent) => {
    if (isAddDisabled || !onAddApplicant) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onAddApplicant(column.status.code)
    }
  }

  return (
    <div
      className="app-panel-glass flex h-full min-h-0 w-80 shrink-0 flex-col"
      aria-label={`Колонка ${column.status.title}`}
    >
      <div className="flex shrink-0 items-center gap-2 px-4 pt-4 pb-3">
        <h3 className="min-w-0 flex-1 truncate text-base font-bold text-app-text">
          {column.status.title}
        </h3>
        <span
          className="shrink-0 rounded-full bg-app-surface-1 px-2.5 py-0.5 text-xs font-bold tabular-nums text-app-text-muted"
          aria-label={`Количество: ${column.applications.length}`}
        >
          {column.applications.length}
        </span>
        {onAddApplicant ? (
          <button
            type="button"
            onClick={handleAddClick}
            onKeyDown={handleAddKeyDown}
            disabled={isAddDisabled}
            aria-label={`Добавить кандидата в «${column.status.title}»`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-surface-1 text-app-text-muted transition-colors hover:bg-brand-accent/15 hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : null}
        {onEditStatus || onDeleteStatus ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Действия для колонки «${column.status.title}»`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-1 hover:text-app-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              {onEditStatus ? (
                <DropdownMenuItem
                  onClick={() => onEditStatus(column.status)}
                  className="cursor-pointer gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
              ) : null}
              {onDeleteStatus ? (
                <DropdownMenuItem
                  onClick={() => onDeleteStatus(column.status)}
                  disabled={column.status.is_default}
                  className="cursor-pointer gap-2 text-red-400 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div
        ref={setNodeRef}
        className={`kanban-col-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-4 transition-colors ${
          isOver ? 'rounded-xl bg-brand-accent/[0.06]' : ''
        }`}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {column.applications.map((application) => (
            <VacancyApplicationBoardCard
              key={application.id}
              application={application}
              onOpen={onOpenCard}
            />
          ))}
        </SortableContext>
        {column.applications.length === 0 ? (
          <p className="flex flex-1 items-center justify-center px-2 py-12 text-center text-sm leading-relaxed text-app-text-muted/60">
            Перетащите карточку сюда
          </p>
        ) : null}
      </div>
    </div>
  )
}
