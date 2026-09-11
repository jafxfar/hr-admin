import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects'
import {
  PROJECT_DETAIL_KEY,
  PROJECT_TASKS_KEY,
  PROJECTS_KEY,
  TASK_BOARD_KEY,
  TASK_DASHBOARD_KEY,
  TASK_TABLE_KEY,
} from '@/lib/tasks/query-keys'
import type { CreateProjectDTO, ProjectListScope, UpdateProjectDTO } from '@/types/projects'

export { PROJECTS_KEY, PROJECT_DETAIL_KEY, PROJECT_TASKS_KEY }

const invalidateProjectQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId?: number | null
) => {
  queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_BOARD_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_TABLE_KEY], exact: false })
  queryClient.invalidateQueries({ queryKey: [TASK_DASHBOARD_KEY], exact: false })
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: [PROJECT_DETAIL_KEY, projectId] })
    queryClient.invalidateQueries({ queryKey: [PROJECT_TASKS_KEY, projectId], exact: false })
  }
}

export const useProjects = (
  scope: ProjectListScope = 'all',
  page = 1,
  pageSize = 20,
  q?: string
) =>
  useQuery({
    queryKey: [PROJECTS_KEY, scope, page, pageSize, q?.trim() ?? ''],
    queryFn: () => projectsApi.getProjects(scope, page, pageSize, q),
  })

export const useProject = (projectId: number | null, enabled = true) =>
  useQuery({
    queryKey: [PROJECT_DETAIL_KEY, projectId],
    queryFn: () => projectsApi.getProject(projectId as number),
    enabled: enabled && projectId != null && projectId > 0,
  })

export const useProjectTasks = (
  projectId: number | null,
  page = 1,
  pageSize = 20,
  q?: string,
  enabled = true
) =>
  useQuery({
    queryKey: [PROJECT_TASKS_KEY, projectId, page, pageSize, q?.trim() ?? ''],
    queryFn: () => projectsApi.getProjectTasks(projectId as number, page, pageSize, q),
    enabled: enabled && projectId != null && projectId > 0,
  })

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateProjectDTO) => projectsApi.createProject(data),
    onSuccess: () => {
      invalidateProjectQueries(queryClient)
    },
  })
}

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ projectId, data }: { projectId: number; data: UpdateProjectDTO }) =>
      projectsApi.updateProject(projectId, data),
    onSuccess: (_data, variables) => {
      invalidateProjectQueries(queryClient, variables.projectId)
    },
  })
}

export const useArchiveProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (projectId: number) => projectsApi.archiveProject(projectId),
    onSuccess: (_data, projectId) => {
      invalidateProjectQueries(queryClient, projectId)
    },
  })
}

export const useHardDeleteProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (projectId: number) => projectsApi.hardDeleteProject(projectId),
    onSuccess: (_data, projectId) => {
      invalidateProjectQueries(queryClient, projectId)
    },
  })
}
