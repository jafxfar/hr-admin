import type { PermissionMatrixRow } from '@/types/permission'

export type MatrixAction = 'read' | 'write' | 'delete'

export type DraftMatrixRow = {
  resource: string
  alias_ru: string
  read: boolean
  write: boolean
  delete: boolean
}

export type MatrixColumnState = {
  allOn: boolean
  allOff: boolean
  hasAvailable: boolean
}

export const mapMatrixRowsToDraft = (rows: PermissionMatrixRow[]): DraftMatrixRow[] =>
  rows.map((row) => ({
    resource: row.resource,
    alias_ru: row.alias_ru,
    read: row.read.enabled,
    write: row.write.enabled,
    delete: row.delete.enabled,
  }))

export const getPermissionIdsFromDraft = (
  rows: PermissionMatrixRow[],
  draftRows: DraftMatrixRow[],
): number[] => {
  const draftByResource = new Map(draftRows.map((row) => [row.resource, row]))
  const ids: number[] = []

  rows.forEach((row) => {
    const draft = draftByResource.get(row.resource)
    if (!draft) return

    if (draft.read && row.read.permission_id) ids.push(row.read.permission_id)
    if (draft.write && row.write.permission_id) ids.push(row.write.permission_id)
    if (draft.delete && row.delete.permission_id) ids.push(row.delete.permission_id)
  })

  return ids
}
