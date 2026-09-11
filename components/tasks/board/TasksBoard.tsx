'use client'

import { useMemo, useState } from 'react'
import {
  type CollisionDetection,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  type Over,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import Loading from '@/components/ui/loading'
import { computeBoardPosition, findCardLocation } from '@/lib/task-board'
import type { TaskBoardResponse } from '@/types/taskBoard'
import type { TaskItem } from '@/types/tasks'
import type { TaskStatusItem } from '@/types/taskBoard'
import { TaskBoardAddColumn } from './TaskBoardAddColumn'
import { TaskBoardColumn } from './TaskBoardColumn'
import { TaskBoardHorizontalScroll } from './TaskBoardHorizontalScroll'
import { TaskBoardCard, parseCardDragId } from './TaskBoardCard'

interface TasksBoardProps {
  board: TaskBoardResponse | undefined
  isLoading: boolean
  isMoving: boolean
  onOpenCard: (task: TaskItem) => void
  onMoveCard: (taskId: number, statusCode: string, position: number, globalInsertIndex: number) => void
  onAddTask?: (statusCode: string) => void
  onEditStatus?: (status: TaskStatusItem) => void
  onDeleteStatus?: (status: TaskStatusItem) => void
  isAddTaskDisabled?: boolean
  onAddColumn?: () => void
}

const resolveDropTarget = (
  board: TaskBoardResponse,
  over: Over
): { statusCode: string; index: number } | null => {
  const overId = String(over.id)
  const sortableData = over.data.current?.sortable
  const rawContainerId =
    sortableData && typeof sortableData === 'object' && 'containerId' in sortableData
      ? sortableData.containerId
      : undefined
  const containerId = rawContainerId == null ? null : String(rawContainerId)
  const sortableIndex =
    sortableData && typeof sortableData === 'object' && 'index' in sortableData
      ? Number(sortableData.index)
      : NaN

  const resolveColumnCode = (value: string | null): string | null => {
    if (!value) return null
    if (value.startsWith('column-')) return value.slice(7)
    const taskId = parseCardDragId(value)
    if (taskId == null) return null
    return findCardLocation(board, taskId)?.statusCode ?? null
  }

  const statusCode = resolveColumnCode(containerId) ?? resolveColumnCode(overId)
  if (!statusCode) return null

  const columns = board.columns ?? []
  const targetColumn = columns.find((column) => column.status.code === statusCode)
  if (!targetColumn) return null

  const overTaskId = parseCardDragId(overId)
  if (overTaskId != null) {
    const loc = findCardLocation(board, overTaskId)
    if (!loc) return null
    return { statusCode, index: loc.cardIndex }
  }

  if (Number.isFinite(sortableIndex)) {
    const clampedIndex = Math.max(0, Math.min(Math.floor(sortableIndex), targetColumn.tasks.length))
    return { statusCode, index: clampedIndex }
  }

  return { statusCode, index: targetColumn.tasks.length }
}

const boardCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args)
  if (pointerHits.length > 0) return pointerHits

  const rectHits = rectIntersection(args)
  if (rectHits.length > 0) return rectHits

  return closestCenter(args)
}

export const TasksBoard = ({
  board,
  isLoading,
  isMoving,
  onOpenCard,
  onMoveCard,
  onAddTask,
  onEditStatus,
  onDeleteStatus,
  isAddTaskDisabled = false,
  onAddColumn,
}: TasksBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [activeDragCard, setActiveDragCard] = useState<TaskItem | null>(null)

  const findTaskById = (taskId: number): TaskItem | null => {
    if (!board) return null
    for (const col of board.columns ?? []) {
      const task = col.tasks.find((t) => t.id === taskId)
      if (task) return task
    }
    return null
  }

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const taskId = parseCardDragId(String(event.active.id))
    if (taskId == null) return
    setActiveDragCard(findTaskById(taskId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragCard(null)
    const { active, over } = event
    if (!board || !over) return
    if (active.id === over.id) return

    const taskId = parseCardDragId(String(active.id))
    if (taskId == null) return

    const source = findCardLocation(board, taskId)
    const target = resolveDropTarget(board, over)
    if (!source || !target) return

    let globalInsertIndex = target.index
    if (source.statusCode === target.statusCode && source.cardIndex < target.index) {
      globalInsertIndex -= 1
    }

    const position = computeBoardPosition(globalInsertIndex)

    if (source.statusCode === target.statusCode && source.cardIndex === globalInsertIndex) {
      return
    }

    onMoveCard(taskId, target.statusCode, position, Math.max(0, globalInsertIndex))
  }

  const sortedColumns = useMemo(() => {
    const columns = board?.columns ?? []
    if (!columns.length) return []
    return [...columns].sort((a, b) => {
      const orderDiff = a.status.column_sort_order - b.status.column_sort_order
      if (orderDiff !== 0) return orderDiff
      return a.status.title.localeCompare(b.status.title, 'ru')
    })
  }, [board])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!sortedColumns.length) {
    return (
      <div className="flex flex-1 items-center gap-4">
        {onAddColumn ? (
          <TaskBoardAddColumn onClick={onAddColumn} disabled={isMoving} />
        ) : (
          <p className="text-sm text-app-text-muted">Нет колонок для отображения доски</p>
        )}
      </div>
    )
  }

  const totalCards = sortedColumns.reduce((sum, col) => sum + (col.tasks?.length ?? 0), 0)

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col select-none ${isMoving ? 'pointer-events-none opacity-80' : ''}`}
      aria-busy={isMoving}
    >
      {totalCards === 0 ? (
        <p className="mb-3 shrink-0 text-sm text-app-text-muted">Задач пока нет</p>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={boardCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <TaskBoardHorizontalScroll className="min-h-0 flex-1">
          {sortedColumns.map((column) => (
            <TaskBoardColumn
              key={column.status.code}
              column={column}
              onOpenCard={onOpenCard}
              onAddTask={onAddTask}
              onEditStatus={onEditStatus}
              onDeleteStatus={onDeleteStatus}
              isAddDisabled={isMoving || isAddTaskDisabled}
            />
          ))}
          {onAddColumn ? (
            <TaskBoardAddColumn onClick={onAddColumn} disabled={isMoving} />
          ) : null}
        </TaskBoardHorizontalScroll>
        <DragOverlay dropAnimation={null}>
          {activeDragCard ? (
            <div className="w-80 rotate-1 opacity-95">
              <TaskBoardCard task={activeDragCard} onOpen={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
