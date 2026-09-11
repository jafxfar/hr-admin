import type { TaskBoardResponse } from '@/types/taskBoard'
import type { TaskItem } from '@/types/tasks'

export const parseDeadlineDate = (iso?: string | null): string => {
  if (!iso) return ''
  const datePart = iso.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : ''
}

export const buildDeadlineIso = (dateYmd: string): string | null => {
  const trimmed = dateYmd.trim()
  if (!trimmed) return null
  return `${trimmed}T23:59:59`
}

export const findCardLocation = (
  board: TaskBoardResponse,
  taskId: number
): { columnIndex: number; cardIndex: number; statusCode: string } | null => {
  const columns = board.columns ?? []
  for (let ci = 0; ci < columns.length; ci++) {
    const col = columns[ci]
    const tasks = col.tasks ?? []
    const cardIndex = tasks.findIndex((task) => task.id === taskId)
    if (cardIndex >= 0) {
      return { columnIndex: ci, cardIndex, statusCode: col.status.code }
    }
  }
  return null
}

export const computeBoardPosition = (globalInsertIndex: number): number =>
  Math.max(0, globalInsertIndex)

export const moveCardInBoard = (
  board: TaskBoardResponse,
  taskId: number,
  targetStatusCode: string,
  globalInsertIndex: number
): TaskBoardResponse => {
  const location = findCardLocation(board, taskId)
  if (!location) return board

  const columns = (board.columns ?? []).map((col) => ({
    ...col,
    tasks: [...(col.tasks ?? [])],
  }))

  const sourceCol = columns[location.columnIndex]
  const [card] = sourceCol.tasks.splice(location.cardIndex, 1)
  if (!card) return board

  const targetColIndex = columns.findIndex((c) => c.status.code === targetStatusCode)
  if (targetColIndex < 0) return board

  const updatedCard: TaskItem = {
    ...card,
    status: targetStatusCode,
  }

  const targetCol = columns[targetColIndex]
  const insertIndex = Math.max(0, Math.min(globalInsertIndex, targetCol.tasks.length))
  targetCol.tasks.splice(insertIndex, 0, updatedCard)

  return { columns }
}
