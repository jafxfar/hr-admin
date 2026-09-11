import { apiClient } from './client'
import type { Paginated } from '@/types/pagination'
import type {
  Permission,
  PermissionCreate,
  PermissionRoleCreate,
  PermissionRoleResponse,
  PermissionRoleUpdate,
  PermissionUpdate,
  RolePermissionCreate,
  RolePermissionMatrixResponse,
  RolePermissionMatrixUpdate,
} from '@/types/permission'

export const permissionsApi = {
  listPermissions: (params?: {
    resource?: string
    action?: string
    include_inactive?: boolean
  }): Promise<Permission[]> =>
    apiClient.get<Permission[]>('/permissions/', {
      ...(params?.resource ? { resource: params.resource } : {}),
      ...(params?.action ? { action: params.action } : {}),
      ...(typeof params?.include_inactive === 'boolean'
        ? { include_inactive: String(params.include_inactive) }
        : {}),
    }),

  createPermission: (data: PermissionCreate): Promise<Permission> =>
    apiClient.post<Permission>('/permissions/', data),

  updatePermission: (permissionId: number, data: PermissionUpdate): Promise<Permission> =>
    apiClient.put<Permission>(`/permissions/${permissionId}`, data),

  deletePermission: (permissionId: number): Promise<void> =>
    apiClient.delete<void>(`/permissions/${permissionId}`),

  createRolePermission: (data: RolePermissionCreate): Promise<{ id: number }> =>
    apiClient.post<{ id: number }>('/permissions/role-permissions', data),

  getRolePermissions: (roleId: number): Promise<Permission[]> =>
    apiClient.get<Permission[]>(`/permissions/roles/${roleId}/permissions`),

  listRoles: (
    includeInactive = false,
    page = 1,
    pageSize = 20,
  ): Promise<Paginated<PermissionRoleResponse>> => {
    const params = new URLSearchParams({
      include_inactive: String(includeInactive),
      page: String(page),
      page_size: String(pageSize),
    })
    return apiClient.get<Paginated<PermissionRoleResponse>>(`/permissions/roles-admin/all?${params.toString()}`)
  },

  createRole: (data: PermissionRoleCreate): Promise<PermissionRoleResponse> =>
    apiClient.post<PermissionRoleResponse>('/permissions/roles-admin/create', data),

  updateRole: (
    roleId: number,
    data: PermissionRoleUpdate,
  ): Promise<PermissionRoleResponse> =>
    apiClient.put<PermissionRoleResponse>(`/permissions/roles-admin/${roleId}`, data),

  deleteRole: (roleId: number): Promise<void> =>
    apiClient.delete<void>(`/permissions/roles-admin/${roleId}`),

  assignPermissionsToRole: (roleId: number, permissionIds: number[]): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>(`/permissions/roles/${roleId}/assign-permissions`, permissionIds),

  removePermissionsFromRole: (roleId: number, permissionIds: number[]): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>(
      `/permissions/roles/${roleId}/remove-permissions`,
      permissionIds,
    ),

  getMatrixCatalog: (): Promise<RolePermissionMatrixResponse['rows']> =>
    apiClient.get<RolePermissionMatrixResponse['rows']>('/permissions/matrix/catalog'),

  getRoleMatrix: (roleId: number): Promise<RolePermissionMatrixResponse> =>
    apiClient.get<RolePermissionMatrixResponse>(`/permissions/matrix/roles/${roleId}`),

  updateRoleMatrix: (
    roleId: number,
    data: RolePermissionMatrixUpdate,
  ): Promise<RolePermissionMatrixResponse> =>
    apiClient.put<RolePermissionMatrixResponse>(`/permissions/matrix/roles/${roleId}`, data),
}

