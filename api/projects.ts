import { apiClient } from './client'
import type {
  CreateProjectDTO,
  PaginatedProjects,
  ProjectItem,
  ProjectListScope,
  UpdateProjectDTO,
} from '@/types/projects'
import type { PaginatedTasks } from '@/types/tasks'

const buildListParams = (
  page: number,
  pageSize: number,
  q?: string
): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    page,
    page_size: pageSize,
  }
  if (q?.trim()) params.q = q.trim()
  return params
}

const listPath = (scope: ProjectListScope) => {
  if (scope === 'my') return '/projects/my'
  if (scope === 'archive') return '/projects/archive'
  return '/projects/all'
}

export const projectsApi = {
  getProjects: (
    scope: ProjectListScope = 'all',
    page = 1,
    pageSize = 20,
    q?: string
  ): Promise<PaginatedProjects> =>
    apiClient.get<PaginatedProjects>(listPath(scope), buildListParams(page, pageSize, q)),

  getProject: (projectId: number): Promise<ProjectItem> =>
    apiClient.get<ProjectItem>(`/projects/${projectId}`),

  getProjectTasks: (
    projectId: number,
    page = 1,
    pageSize = 20,
    q?: string
  ): Promise<PaginatedTasks> => {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    }
    if (q?.trim()) params.q = q.trim()
    return apiClient.get<PaginatedTasks>(`/projects/${projectId}/tasks`, params)
  },

  createProject: (data: CreateProjectDTO): Promise<number> =>
    apiClient.post<number>('/projects/create', data),

  updateProject: (projectId: number, data: UpdateProjectDTO): Promise<{ id: number }> =>
    apiClient.put<{ id: number }>(`/projects/${projectId}`, data),

  archiveProject: (projectId: number): Promise<void> =>
    apiClient.delete(`/projects/${projectId}`),

  hardDeleteProject: (projectId: number): Promise<void> =>
    apiClient.delete(`/projects/archive/${projectId}`),
}
