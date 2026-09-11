import type { TaskUserBrief } from './tasks'

export interface ProjectItem {
  id: number
  name: string
  description?: string | null
  created_by: number
  created_by_user?: TaskUserBrief | null
  deadline?: string | null
  members: TaskUserBrief[]
  tasks_count: number
  archived_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CreateProjectDTO {
  name: string
  description?: string | null
  deadline?: string | null
  member_ids?: number[]
}

export interface UpdateProjectDTO {
  name?: string
  description?: string | null
  deadline?: string | null
  member_ids?: number[]
}

export interface PaginatedProjects {
  items: ProjectItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type ProjectListScope = 'all' | 'my' | 'archive'
