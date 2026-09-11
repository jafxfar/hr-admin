'use client'

import { TasksBoard } from '@/components/tasks/board'
import type { TaskBoardResponse, TaskStatusItem } from '@/types/taskBoard'
import type { TaskItem } from '@/types/tasks'

type TasksKanbanTabProps = {
  board: TaskBoardResponse | undefined
  isLoading: boolean
  isMoving: boolean
  isAddTaskDisabled?: boolean
  onOpenCard: (task: TaskItem) => void
  onMoveCard: (
    taskId: number,
    statusCode: string,
    position: number,
    globalInsertIndex: number
  ) => void
  onAddTask?: (statusCode: string) => void
  onEditStatus?: (status: TaskStatusItem) => void
  onDeleteStatus?: (status: TaskStatusItem) => void
  onAddColumn?: () => void
}

export const TasksKanbanTab = ({
  board,
  isLoading,
  isMoving,
  isAddTaskDisabled,
  onOpenCard,
  onMoveCard,
  onAddTask,
  onEditStatus,
  onDeleteStatus,
  onAddColumn,
}: TasksKanbanTabProps) => (
  <div className="tasks-board flex h-full min-h-0 flex-1 flex-col overflow-hidden select-none">
    <TasksBoard
      board={board}
      isLoading={isLoading}
      isMoving={isMoving}
      isAddTaskDisabled={isAddTaskDisabled}
      onOpenCard={onOpenCard}
      onMoveCard={onMoveCard}
      onAddTask={onAddTask}
      onAddColumn={onAddColumn}
      onEditStatus={onEditStatus}
      onDeleteStatus={onDeleteStatus}
    />
  </div>
)
