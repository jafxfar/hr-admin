'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useMatrixCatalog,
  useRbacRoles,
  useRoleMatrix,
  useUpdateRoleMutation,
  useUpdateRoleMatrixMutation,
} from '@/hooks/use-permissions'
import { useToast } from '@/hooks/use-toast'
import { mutationOpts } from '@/lib/mutation-options'
import type { PermissionMatrixRow, ScopeType, PermissionRoleResponse } from '@/types/permission'
import {
  getPermissionIdsFromDraft,
  mapMatrixRowsToDraft,
  type DraftMatrixRow,
  type MatrixAction,
  type MatrixColumnState,
} from '@/lib/roles-matrix'

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]
  return []
}

export const useRolesMatrixPage = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [scopeType, setScopeType] = useState<ScopeType>('all')
  const [draftRows, setDraftRows] = useState<DraftMatrixRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFormMode, setRoleFormMode] = useState<'create' | 'edit'>('create')
  const [roleFormOpen, setRoleFormOpen] = useState(false)
  const [roleFormName, setRoleFormName] = useState('')
  const [roleFormDescription, setRoleFormDescription] = useState('')
  const [roleFormIsActive, setRoleFormIsActive] = useState(true)
  const [roleFormCanAccessAdminUi, setRoleFormCanAccessAdminUi] = useState(false)
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(false)

  const { data: roles = [], isLoading: rolesLoading } = useRbacRoles(true)
  const { data: matrixCatalog = [], isLoading: matrixCatalogLoading } = useMatrixCatalog()
  const { data: roleMatrix, isLoading: roleMatrixLoading, refetch: refetchRoleMatrix } =
    useRoleMatrix(selectedRoleId)
  const updateMatrixMutation = useUpdateRoleMatrixMutation()
  const createRoleMutation = useCreateRoleMutation()
  const updateRoleMutation = useUpdateRoleMutation()
  const deleteRoleMutation = useDeleteRoleMutation()

  const roleList = useMemo(() => toArray<typeof roles[number]>(roles), [roles])
  const matrixRows = useMemo(() => toArray<PermissionMatrixRow>(matrixCatalog), [matrixCatalog])
  const selectedRole = useMemo(
    () => roleList.find((role) => role.id === selectedRoleId) ?? null,
    [roleList, selectedRoleId],
  )

  useEffect(() => {
    if (!selectedRoleId && roleList.length > 0) {
      setSelectedRoleId(roleList[0].id)
    }
  }, [roleList, selectedRoleId])

  useEffect(() => {
    if (!roleMatrix) return
    setScopeType(roleMatrix.scope_type)
    setDraftRows(mapMatrixRowsToDraft(roleMatrix.rows))
  }, [roleMatrix])

  const displayedRows = useMemo(() => {
    if (roleMatrix?.rows) return roleMatrix.rows
    return matrixRows
  }, [roleMatrix?.rows, matrixRows])

  const filteredDisplayedRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return displayedRows
    return displayedRows.filter((row) => {
      const alias = row.alias_ru.toLowerCase()
      const resource = row.resource.toLowerCase()
      return alias.includes(q) || resource.includes(q)
    })
  }, [displayedRows, searchQuery])

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return roleList
    return roleList.filter((role) => {
      const roleName = role.name.toLowerCase()
      const description = (role.description ?? '').toLowerCase()
      return roleName.includes(q) || description.includes(q)
    })
  }, [roleList, searchQuery])

  const hasPendingMatrixChanges = useMemo(() => {
    if (!roleMatrix) return false
    const current = JSON.stringify(mapMatrixRowsToDraft(roleMatrix.rows))
    const draft = JSON.stringify(draftRows)
    return current !== draft || roleMatrix.scope_type !== scopeType
  }, [roleMatrix, draftRows, scopeType])

  const draftByResource = useMemo(() => new Map(draftRows.map((row) => [row.resource, row])), [draftRows])

  const columnState = useMemo<Record<MatrixAction, MatrixColumnState>>(() => {
    const getActionState = (action: MatrixAction): MatrixColumnState => {
      let allOn = true
      let allOff = true
      let hasAvailable = false

      displayedRows.forEach((row) => {
        const permissionId = row[action].permission_id
        if (!permissionId) return

        hasAvailable = true
        const currentValue = draftByResource.get(row.resource)?.[action] ?? false
        if (!currentValue) allOn = false
        if (currentValue) allOff = false
      })

      if (!displayedRows.length || !hasAvailable) {
        allOn = false
        allOff = true
      }

      return { allOn, allOff, hasAvailable }
    }

    return {
      read: getActionState('read'),
      write: getActionState('write'),
      delete: getActionState('delete'),
    }
  }, [displayedRows, draftByResource])

  const handleMatrixToggle = (resource: string, action: MatrixAction) => {
    setDraftRows((prev) =>
      prev.map((row) =>
        row.resource === resource ? { ...row, [action]: !row[action] } : row,
      ),
    )
  }

  const handleToggleColumn = (action: MatrixAction) => {
    const nextValue = !columnState[action].allOn
    const availableResources = new Set(
      displayedRows.filter((row) => !!row[action].permission_id).map((row) => row.resource),
    )

    setDraftRows((prev) =>
      prev.map((row) =>
        availableResources.has(row.resource) ? { ...row, [action]: nextValue } : row,
      ),
    )
  }

  const handleDiscardChanges = () => {
    if (!roleMatrix) return
    setScopeType(roleMatrix.scope_type)
    setDraftRows(mapMatrixRowsToDraft(roleMatrix.rows))
  }

  const handleOpenCreateRole = () => {
    setRoleFormMode('create')
    setRoleFormName('')
    setRoleFormDescription('')
    setRoleFormIsActive(true)
    setRoleFormCanAccessAdminUi(false)
    setRoleFormOpen(true)
  }

  const handleOpenEditRole = () => {
    if (!selectedRole) return
    setRoleFormMode('edit')
    setRoleFormName(selectedRole.name)
    setRoleFormDescription(selectedRole.description ?? '')
    setRoleFormIsActive(selectedRole.is_active)
    setRoleFormCanAccessAdminUi(selectedRole.can_access_admin_ui)
    setRoleFormOpen(true)
  }

  const handleRoleFormSave = () => {
    const roleName = roleFormName.trim()
    if (!roleName) {
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: 'Укажите название роли',
      })
      return
    }

    if (roleFormMode === 'create') {
      createRoleMutation.mutate(
        {
          name: roleName,
          description: roleFormDescription.trim() || undefined,
          can_access_admin_ui: roleFormCanAccessAdminUi || false,
        },
        mutationOpts({
          meta: {
            successTitle: 'Роль создана',
            successDescription:
              'Если меняли доступ для текущего пользователя, выполните повторный вход',
          },
          onSuccess: (role: PermissionRoleResponse) => {
            setRoleFormOpen(false)
            setRoleFormName('')
            setRoleFormDescription('')
            setRoleFormCanAccessAdminUi(false)
            setSelectedRoleId(role.id)
            queryClient.invalidateQueries({ queryKey: ['employees', 'me'] })
          },
        }),
      )
      return
    }

    if (!selectedRoleId) return

    updateRoleMutation.mutate(
      {
        roleId: selectedRoleId,
        data: {
          name: roleName,
          description: roleFormDescription.trim() || undefined,
          is_active: roleFormIsActive,
          can_access_admin_ui: roleFormCanAccessAdminUi,
        },
      },
      mutationOpts({
        meta: {
          successTitle: 'Роль обновлена',
          successDescription:
            'Доступ в админку обновится после повторного входа или обновления профиля',
        },
        onSuccess: () => {
          setRoleFormOpen(false)
          queryClient.invalidateQueries({ queryKey: ['employees', 'me'] })
        },
      }),
    )
  }

  const handleConfirmDeleteRole = () => {
    if (!selectedRoleId) return
    const deletingRoleId = selectedRoleId
    const nextRole = roleList.find((role) => role.id !== deletingRoleId)

    deleteRoleMutation.mutate(
      deletingRoleId,
      mutationOpts({
        meta: { successTitle: 'Роль удалена' },
        onSuccess: () => {
          setDeleteRoleOpen(false)
          if (selectedRoleId === deletingRoleId) {
            setSelectedRoleId(nextRole?.id ?? null)
            if (!nextRole) {
              setDraftRows([])
              setScopeType('all')
            }
          }
        },
      }),
    )
  }

  const handleSaveMatrix = async () => {
    if (!selectedRoleId || !roleMatrix) return
    const permissionIds = getPermissionIdsFromDraft(roleMatrix.rows, draftRows)

    try {
      await updateMatrixMutation.mutateAsync(
        {
          roleId: selectedRoleId,
          data: { scope_type: scopeType, permission_ids: permissionIds },
        },
        mutationOpts({ meta: { successTitle: 'Матрица прав обновлена' } }),
      )
      await refetchRoleMatrix()
    } catch {
      // Global mutation toast already shows the backend error
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedRoleId,
    setSelectedRoleId,
    scopeType,
    setScopeType,
    draftRows,
    filteredRoles,
    selectedRole,
    roleMatrix,
    roleMatrixLoading,
    displayedRows,
    filteredDisplayedRows,
    columnState,
    hasPendingMatrixChanges,
    roleFormOpen,
    setRoleFormOpen,
    roleFormMode,
    roleFormName,
    setRoleFormName,
    roleFormDescription,
    setRoleFormDescription,
    roleFormIsActive,
    setRoleFormIsActive,
    roleFormCanAccessAdminUi,
    setRoleFormCanAccessAdminUi,
    deleteRoleOpen,
    setDeleteRoleOpen,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    handleMatrixToggle,
    handleToggleColumn,
    handleDiscardChanges,
    handleOpenCreateRole,
    handleOpenEditRole,
    handleRoleFormSave,
    handleConfirmDeleteRole,
    handleSaveMatrix,
    isPageLoading: rolesLoading || matrixCatalogLoading,
  }
}
