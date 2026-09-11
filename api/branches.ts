import { apiClient } from './client'
import type { Paginated } from '@/types/pagination'
import type { Department } from '@/types/departments'

export interface Branch {
  id: number
  name: string
  description?: string | null
  code?: string | null
  icon?: string | null
  location?: string | null
  parent_id?: number | null
  created_at?: string
  updated_at?: string
  is_active: boolean
}

export type PaginatedBranches = Paginated<Branch>

export interface BranchTreeNode extends Branch {
  children: BranchTreeNode[]
  departments: Department[]
}

export interface CreateBranchPayload {
  name: string
  description?: string | null
  code?: string | null
  icon?: string | null
  location?: string | null
  parent_id?: number | null
}

export interface UpdateBranchPayload {
  name?: string
  description?: string | null
  code?: string | null
  icon?: string | null
  location?: string | null
  parent_id?: number | null
  is_active?: boolean
}

export const BRANCHES_QUERY_KEY = ['branches'] as const

export const branchesApi = {
  listBranches: (q = '', page = 1, pageSize = 20, includeInactive = false): Promise<PaginatedBranches> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      include_inactive: String(includeInactive),
    })
    if (q.trim()) params.set('q', q.trim())
    return apiClient.get<PaginatedBranches>(`/branches/all?${params.toString()}`)
  },

  createBranch: (data: CreateBranchPayload): Promise<number> =>
    apiClient.post<number>('/branches/branch/create', data),

  updateBranch: (branchId: number, data: UpdateBranchPayload): Promise<{ ok: boolean }> =>
    apiClient.patch<{ ok: boolean }>(`/branches/branch/${branchId}`, data),

  deleteBranch: (branchId: number): Promise<void> =>
    apiClient.delete<void>(`/branches/branch/${branchId}`),

  getBranchesTree: (q?: string): Promise<BranchTreeNode[]> => {
    const params = new URLSearchParams()
    if (q?.trim()) params.set('q', q.trim())
    const qs = params.toString()
    return apiClient.get<BranchTreeNode[]>(qs ? `/branches/tree?${qs}` : '/branches/tree')
  },
}
