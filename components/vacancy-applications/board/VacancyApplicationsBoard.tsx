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
import { computeBoardPosition, findCardLocation } from '@/lib/vacancy-board'
import type { VacancyApplicationBoardResponse } from '@/types/vacancyApplicationBoard'
import type { VacancyApplication } from '@/types/vacancyApplications'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'
import { VacancyApplicationBoardAddColumn } from './VacancyApplicationBoardAddColumn'
import { VacancyApplicationBoardColumn } from './VacancyApplicationBoardColumn'
import { VacancyApplicationBoardHorizontalScroll } from './VacancyApplicationBoardHorizontalScroll'
import {
  VacancyApplicationBoardCard,
  cardDragId,
  parseCardDragId,
} from './VacancyApplicationBoardCard'

interface VacancyApplicationsBoardProps {
  board: VacancyApplicationBoardResponse | undefined
  isLoading: boolean
  isMoving: boolean
  onOpenCard: (application: VacancyApplication) => void
  onMoveCard: (
    applicationId: number,
    statusCode: string,
    position: number,
    closesVacancy: boolean,
    globalInsertIndex: number
  ) => void
  onAddApplicant?: (statusCode: string) => void
  onEditStatus?: (status: VacancyApplicationStatusItem) => void
  onDeleteStatus?: (status: VacancyApplicationStatusItem) => void
  isAddApplicantDisabled?: boolean
  onAddColumn?: () => void
}

const resolveDropTarget = (
  board: VacancyApplicationBoardResponse,
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
    const appId = parseCardDragId(value)
    if (appId == null) return null
    return findCardLocation(board, appId)?.statusCode ?? null
  }

  const statusCode = resolveColumnCode(containerId) ?? resolveColumnCode(overId)
  if (!statusCode) return null

  const targetColumn = board.columns.find((column) => column.status.code === statusCode)
  if (!targetColumn) return null

  const overAppId = parseCardDragId(overId)
  if (overAppId != null) {
    const loc = findCardLocation(board, overAppId)
    if (!loc) return null
    return { statusCode, index: loc.cardIndex }
  }

  if (Number.isFinite(sortableIndex)) {
    const clampedIndex = Math.max(0, Math.min(Math.floor(sortableIndex), targetColumn.applications.length))
    return { statusCode, index: clampedIndex }
  }

  return { statusCode, index: targetColumn.applications.length }
}

const boardCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args)
  if (pointerHits.length > 0) return pointerHits

  const rectHits = rectIntersection(args)
  if (rectHits.length > 0) return rectHits

  return closestCenter(args)
}

export const VacancyApplicationsBoard = ({
  board,
  isLoading,
  isMoving,
  onOpenCard,
  onMoveCard,
  onAddApplicant,
  onEditStatus,
  onDeleteStatus,
  isAddApplicantDisabled = false,
  onAddColumn,
}: VacancyApplicationsBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const statusByCode = useMemo(() => {
    const map = new Map<string, VacancyApplicationStatusItem>()
    board?.columns.forEach((col) => map.set(col.status.code, col.status))
    return map
  }, [board])

  const [activeDragCard, setActiveDragCard] = useState<VacancyApplication | null>(null)

  const findApplicationById = (applicationId: number): VacancyApplication | null => {
    if (!board) return null
    for (const col of board.columns) {
      const app = col.applications.find((a) => a.id === applicationId)
      if (app) return app
    }
    return null
  }

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const applicationId = parseCardDragId(String(event.active.id))
    if (applicationId == null) return
    setActiveDragCard(findApplicationById(applicationId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragCard(null)
    const { active, over } = event
    if (!board || !over) return
    if (active.id === over.id) return

    const applicationId = parseCardDragId(String(active.id))
    if (applicationId == null) return

    const draggedApp = findApplicationById(applicationId)
    if (!draggedApp) return

    const source = findCardLocation(board, applicationId)
    const target = resolveDropTarget(board, over)
    if (!source || !target) return

    let globalInsertIndex = target.index
    if (source.statusCode === target.statusCode && source.cardIndex < target.index) {
      globalInsertIndex -= 1
    }

    const targetColumn = board.columns.find((c) => c.status.code === target.statusCode)
    if (!targetColumn) return

    const position = computeBoardPosition(
      targetColumn.applications,
      draggedApp,
      globalInsertIndex
    )

    if (source.statusCode === target.statusCode) {
      const currentPosition = computeBoardPosition(
        targetColumn.applications,
        draggedApp,
        source.cardIndex
      )
      if (position === currentPosition) return
    }

    const closesVacancy = statusByCode.get(target.statusCode)?.closes_vacancy ?? false
    onMoveCard(
      applicationId,
      target.statusCode,
      position,
      closesVacancy,
      Math.max(0, globalInsertIndex)
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!board?.columns.length) {
    return (
      <div className="flex flex-1 items-center gap-4">
        {onAddColumn ? (
          <VacancyApplicationBoardAddColumn onClick={onAddColumn} disabled={isMoving} />
        ) : (
          <p className="text-sm text-app-text-muted">Нет колонок для отображения доски</p>
        )}
      </div>
    )
  }

  const sortedColumns = [...board.columns].sort((a, b) => {
    const orderDiff = a.status.column_sort_order - b.status.column_sort_order
    if (orderDiff !== 0) return orderDiff
    return a.status.title.localeCompare(b.status.title, 'ru')
  })

  const totalCards = sortedColumns.reduce((sum, col) => sum + col.applications.length, 0)

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col select-none ${isMoving ? 'pointer-events-none opacity-80' : ''}`}
      aria-busy={isMoving}
      data-marketing="applications"
    >
      {totalCards === 0 ? (
        <p className="mb-3 shrink-0 text-sm text-app-text-muted">Откликов пока нет</p>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={boardCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <VacancyApplicationBoardHorizontalScroll className="min-h-0 flex-1">
          {sortedColumns.map((column) => (
            <VacancyApplicationBoardColumn
              key={column.status.code}
              column={column}
              onOpenCard={onOpenCard}
              onAddApplicant={onAddApplicant}
              onEditStatus={onEditStatus}
              onDeleteStatus={onDeleteStatus}
              isAddDisabled={isMoving || isAddApplicantDisabled}
            />
          ))}
          {onAddColumn ? (
            <VacancyApplicationBoardAddColumn onClick={onAddColumn} disabled={isMoving} />
          ) : null}
        </VacancyApplicationBoardHorizontalScroll>
        <DragOverlay dropAnimation={null}>
          {activeDragCard ? (
            <div className="w-80 rotate-1 opacity-95">
              <VacancyApplicationBoardCard application={activeDragCard} onOpen={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
