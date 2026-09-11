/**
 * Типы для ролей (business roles)
 */

export interface Role {
  id: number
  role: string
  description?: string
  createdAt?: string
  can_access_admin_ui: boolean
}

export interface CreateRoleDto {
  role: string
  description?: string
  can_access_admin_ui: boolean
}

export interface UpdateRoleDto {
  role?: string
  description?: string
  can_access_admin_ui?: boolean
}
