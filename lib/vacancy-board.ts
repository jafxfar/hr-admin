import type {
  VacancyApplicationBoardResponse,
  VacancyApplicationStatusItem,
} from '@/types/vacancyApplicationBoard'
import type { VacancyApplication } from '@/types/vacancyApplications'

export const parseDeadlineDate = (iso?: string | null): string => {
  if (!iso) return ''
  const datePart = iso.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : ''
}

export const buildDeadlineIso = (dateYmd: string): string => {
  return `${dateYmd}T23:59:59`
}

const sortApplicationsInColumn = (apps: VacancyApplication[]): VacancyApplication[] => {
  return [...apps].sort((a, b) => {
    if (a.vacancy_id !== b.vacancy_id) return a.vacancy_id - b.vacancy_id
    const orderA = a.board_sort_order ?? 0
    const orderB = b.board_sort_order ?? 0
    if (orderA !== orderB) return orderA - orderB
    return a.id - b.id
  })
}

export const buildBoardFromApplications = (
  statuses: VacancyApplicationStatusItem[],
  applications: VacancyApplication[]
): VacancyApplicationBoardResponse => {
  const appsByStatus = new Map<string, VacancyApplication[]>()
  for (const status of statuses) {
    appsByStatus.set(status.code, [])
  }

  for (const app of applications) {
    const bucket = appsByStatus.get(app.status)
    if (bucket) bucket.push(app)
  }

  const columns = statuses.map((status) => ({
    status,
    applications: sortApplicationsInColumn(appsByStatus.get(status.code) ?? []),
  }))

  return { vacancy_id: null, columns }
}

export const findCardLocation = (
  board: VacancyApplicationBoardResponse,
  applicationId: number
): { columnIndex: number; cardIndex: number; statusCode: string } | null => {
  for (let ci = 0; ci < board.columns.length; ci++) {
    const col = board.columns[ci]
    const cardIndex = col.applications.findIndex((a) => a.id === applicationId)
    if (cardIndex >= 0) {
      return { columnIndex: ci, cardIndex, statusCode: col.status.code }
    }
  }
  return null
}

/** Position for PATCH board-position: index among cards with same vacancy_id in the target column. */
export const computeBoardPosition = (
  columnApps: VacancyApplication[],
  draggedApp: VacancyApplication,
  globalInsertIndex: number
): number => {
  let position = 0
  const limit = Math.max(0, Math.min(globalInsertIndex, columnApps.length))

  for (let i = 0; i < limit; i++) {
    const app = columnApps[i]
    if (app.id === draggedApp.id) continue
    if (app.vacancy_id === draggedApp.vacancy_id) {
      position++
    }
  }

  return position
}

export const moveCardInBoard = (
  board: VacancyApplicationBoardResponse,
  applicationId: number,
  targetStatusCode: string,
  globalInsertIndex: number
): VacancyApplicationBoardResponse => {
  const location = findCardLocation(board, applicationId)
  if (!location) return board

  const columns = board.columns.map((col) => ({
    ...col,
    applications: [...col.applications],
  }))

  const sourceCol = columns[location.columnIndex]
  const [card] = sourceCol.applications.splice(location.cardIndex, 1)
  if (!card) return board

  const targetColIndex = columns.findIndex((c) => c.status.code === targetStatusCode)
  if (targetColIndex < 0) return board

  const updatedCard: VacancyApplication = {
    ...card,
    status: targetStatusCode,
  }

  const targetCol = columns[targetColIndex]
  const insertIndex = Math.max(0, Math.min(globalInsertIndex, targetCol.applications.length))
  targetCol.applications.splice(insertIndex, 0, updatedCard)

  return { ...board, columns }
}
