import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { permissionsApi } from '@/api/permissions'
import type {
  PermissionCreate,
  PermissionRoleCreate,
  PermissionRoleUpdate,
  PermissionUpdate,
  RolePermissionMatrixUpdate,
} from '@/types/permission'

export const PERMISSIONS_QUERY_KEY = ['permissions']
export const RBAC_ROLES_QUERY_KEY = ['rbac-roles']
export const RBAC_MATRIX_QUERY_KEY = ['rbac-matrix']

export function usePermissions(includeInactive = true) {
  return useQuery({
    queryKey: [...PERMISSIONS_QUERY_KEY, includeInactive],
    queryFn: () => permissionsApi.listPermissions({ include_inactive: includeInactive }),
  })
}

export function useRbacRoles(includeInactive = true) {
  return useQuery({
    queryKey: [...RBAC_ROLES_QUERY_KEY, includeInactive],
    queryFn: async () => {
      const res = await permissionsApi.listRoles(includeInactive)
      return res.items ?? []
    },
  })
}

export function useMatrixCatalog() {
  return useQuery({
    queryKey: [...RBAC_MATRIX_QUERY_KEY, 'catalog'],
    queryFn: permissionsApi.getMatrixCatalog,
  })
}

export function useRoleMatrix(roleId: number | null) {
  return useQuery({
    queryKey: [...RBAC_MATRIX_QUERY_KEY, 'role', roleId],
    queryFn: () => permissionsApi.getRoleMatrix(roleId!),
    enabled: !!roleId,
  })
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: PermissionRoleCreate) => permissionsApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RBAC_ROLES_QUERY_KEY })
    },
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: number
      data: PermissionRoleUpdate
    }) => permissionsApi.updateRole(roleId, data),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: RBAC_ROLES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...RBAC_MATRIX_QUERY_KEY, 'role', payload.roleId] })
    },
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (roleId: number) => permissionsApi.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RBAC_ROLES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: RBAC_MATRIX_QUERY_KEY })
    },
  })
}

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: PermissionCreate) => permissionsApi.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: RBAC_MATRIX_QUERY_KEY })
    },
  })
}

export function useUpdatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ permissionId, data }: { permissionId: number; data: PermissionUpdate }) =>
      permissionsApi.updatePermission(permissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: RBAC_MATRIX_QUERY_KEY })
    },
  })
}

export function useDeletePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (permissionId: number) => permissionsApi.deletePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: RBAC_MATRIX_QUERY_KEY })
    },
  })
}

export function useAssignPermissionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
      permissionsApi.assignPermissionsToRole(roleId, permissionIds),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...RBAC_MATRIX_QUERY_KEY, 'role', payload.roleId] })
    },
  })
}

export function useRemovePermissionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
      permissionsApi.removePermissionsFromRole(roleId, permissionIds),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...RBAC_MATRIX_QUERY_KEY, 'role', payload.roleId] })
    },
  })
}

export function useUpdateRoleMatrixMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ roleId, data }: { roleId: number; data: RolePermissionMatrixUpdate }) =>
      permissionsApi.updateRoleMatrix(roleId, data),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...RBAC_MATRIX_QUERY_KEY, 'role', payload.roleId] })
    },
  })
}

