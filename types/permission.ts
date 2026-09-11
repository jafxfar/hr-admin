export interface Permission {
    id: number
    name: string
    description?: string
    resource: string
    action: string
    created_at: string
    is_active: boolean
}

export interface PermissionCreate {
    name: string
    description?: string
    resource: string
    action: string
}

export interface PermissionUpdate {
    name?: string
    description?: string
    resource?: string
    action?: string
    is_active?: boolean
}

export interface PermissionRole {
    id: number
    name: string
    description?: string
    created_at: string
    is_active: boolean
    can_access_admin_ui: boolean
}

export interface PermissionRoleCreate {
    name: string
    description?: string
    can_access_admin_ui: boolean
}

export interface PermissionRoleUpdate {
    name?: string
    description?: string
    is_active?: boolean
    can_access_admin_ui?: boolean
}

export interface PermissionRoleResponse {
    id: number
    name: string
    description?: string
    created_at: string
    is_active: boolean
    can_access_admin_ui: boolean
}

export type ScopeType = 'all' | 'subtree' | 'own'

export interface PermissionActionCell {
    permission_id?: number | null
    code?: string | null
    enabled: boolean
}

export interface PermissionMatrixRow {
    resource: string
    alias_ru: string
    read: PermissionActionCell
    write: PermissionActionCell
    delete: PermissionActionCell
}

export interface RolePermissionMatrixResponse {
    role_id: number
    role_name: string
    scope_type: ScopeType
    rows: PermissionMatrixRow[]
}

export interface RolePermissionMatrixUpdate {
    scope_type: ScopeType
    permission_ids: number[]
}

export interface RolePermissionCreate {
    role_id: number
    permission_id: number
}