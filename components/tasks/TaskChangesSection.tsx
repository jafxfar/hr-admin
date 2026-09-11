'use client'

import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/loading'
import {
  TASK_FIELD_LABELS,
  formatChangeValue,
  formatTaskDateTime,
  getTaskUserName,
} from '@/lib/tasks/utils'
import type { TaskChangeItem } from '@/types/tasks'
import type { TaskStatusItem } from '@/types/taskBoard'

type TaskChangesSectionProps = {
  changes: TaskChangeItem[]
  isLoading: boolean
  page: number
  totalPages: number
  statuses?: TaskStatusItem[]
  onPageChange: (page: number) => void
}

export const TaskChangesSection = ({
  changes,
  isLoading,
  page,
  totalPages,
  statuses,
  onPageChange,
}: TaskChangesSectionProps) => {
  if (isLoading) return <Loading />

  if (changes.length === 0) {
    return <p className="py-6 text-center text-sm text-app-text-muted">История изменений пуста</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-app-text">История изменений</h3>
      <div className="overflow-hidden rounded-2xl border border-app-border-accent">
        <table className="w-full text-sm">
          <thead className="bg-app-surface-1 text-left text-xs uppercase tracking-wider text-app-text-muted">
            <tr>
              <th className="px-4 py-3 font-bold">Дата</th>
              <th className="px-4 py-3 font-bold">Автор</th>
              <th className="px-4 py-3 font-bold">Поле</th>
              <th className="px-4 py-3 font-bold">Было</th>
              <th className="px-4 py-3 font-bold">Стало</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border-accent">
            {changes.map((change) => (
              <tr key={change.id} className="align-top">
                <td className="px-4 py-3 text-app-text-muted">
                  {formatTaskDateTime(change.created_at)}
                </td>
                <td className="px-4 py-3 text-app-text">
                  {getTaskUserName(change.actor_user)}
                </td>
                <td className="px-4 py-3 text-app-text">
                  {TASK_FIELD_LABELS[change.field] ?? change.field}
                </td>
                <td className="px-4 py-3 text-app-text-muted">
                  {formatChangeValue(change.field, change.old_value, statuses)}
                </td>
                <td className="px-4 py-3 text-app-text">
                  {formatChangeValue(change.field, change.new_value, statuses)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Назад
          </Button>
          <span className="text-sm text-app-text-muted">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Далее
          </Button>
        </div>
      ) : null}
    </div>
  )
}
