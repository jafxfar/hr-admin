import { apiClient } from './client'
import { buildBoardFromApplications } from '@/lib/vacancy-board'
import type {
  BoardPositionPatch,
  CreateVacancyApplicationStatusDTO,
  UpdateVacancyApplicationStatusDTO,
  VacancyApplicationBoardFilters,
  VacancyApplicationBoardResponse,
  VacancyApplicationStatusItem,
  VacancyApplicationStatusesResponse,
} from '@/types/vacancyApplicationBoard'
import type {
  CreateVacancyApplicationDTO,
  CreateVacancyApplicationResponse,
  PaginatedVacancyApplications,
  UpdateVacancyApplicationDTO,
} from '@/types/vacancyApplications'

const BOARD_ENROLLS_PAGE_SIZE = 1000

export const vacancyApplicationsApi = {
  getAll: (page = 1, pageSize = 20, q?: string): Promise<PaginatedVacancyApplications> => {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    }
    if (q && q.trim().length > 0) params.q = q

    return apiClient.get<PaginatedVacancyApplications>(
      '/vacancy-applications/admin',
      params
    )
  },

  getEnrolls: (
    page = 1,
    pageSize = BOARD_ENROLLS_PAGE_SIZE,
    filters?: VacancyApplicationBoardFilters
  ): Promise<PaginatedVacancyApplications> => {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
      sort_by: 'board_sort_order',
      sort_order: 'asc',
    }
    if (filters?.vacancyId != null && filters.vacancyId > 0) {
      params.vacancy_id = filters.vacancyId
    }
    if (filters?.q?.trim()) params.q = filters.q.trim()

    return apiClient.get<PaginatedVacancyApplications>(
      '/vacancy-applications/enrolls',
      params
    )
  },

  getStatuses: (includeInactive = false): Promise<VacancyApplicationStatusesResponse> => {
    return apiClient.get<VacancyApplicationStatusesResponse>(
      '/vacancy-applications/statuses',
      { include_inactive: includeInactive ? 'true' : 'false' }
    )
  },

  createStatus: (
    data: CreateVacancyApplicationStatusDTO
  ): Promise<VacancyApplicationStatusItem> => {
    return apiClient.post<VacancyApplicationStatusItem>(
      '/vacancy-applications/statuses',
      data
    )
  },

  updateStatus: (
    code: string,
    data: UpdateVacancyApplicationStatusDTO
  ): Promise<VacancyApplicationStatusItem> => {
    return apiClient.patch<VacancyApplicationStatusItem>(
      `/vacancy-applications/statuses/${encodeURIComponent(code)}`,
      data
    )
  },

  deleteStatus: (code: string): Promise<void> => {
    return apiClient.delete(`/vacancy-applications/statuses/${encodeURIComponent(code)}`)
  },

  getBoard: (vacancyId: number): Promise<VacancyApplicationBoardResponse> => {
    return apiClient.get<VacancyApplicationBoardResponse>(
      `/vacancy-applications/enrolls/${vacancyId}/board`
    )
  },

  getGlobalBoard: async (
    filters?: VacancyApplicationBoardFilters
  ): Promise<VacancyApplicationBoardResponse> => {
    const params: Record<string, string | number> = {}
    if (filters?.vacancyId != null && filters.vacancyId > 0) {
      params.vacancy_id = filters.vacancyId
    }
    if (filters?.q?.trim()) params.q = filters.q.trim()

    try {
      return await apiClient.get<VacancyApplicationBoardResponse>(
        '/vacancy-applications/enrolls/board',
        Object.keys(params).length > 0 ? params : undefined
      )
    } catch {
      // Endpoint may be missing — assemble from enrolls + statuses
    }

    if (filters?.vacancyId != null && filters.vacancyId > 0) {
      const board = await vacancyApplicationsApi.getBoard(filters.vacancyId)
      if (!filters.q?.trim()) return board
      const qLower = filters.q.trim().toLowerCase()
      return {
        ...board,
        columns: board.columns.map((col) => ({
          ...col,
          applications: col.applications.filter((app) => matchesApplicantSearch(app, qLower)),
        })),
      }
    }

    const [statusesRes, enrollsRes] = await Promise.all([
      vacancyApplicationsApi.getStatuses(false),
      vacancyApplicationsApi.getEnrolls(1, BOARD_ENROLLS_PAGE_SIZE, filters),
    ])

    return buildBoardFromApplications(statusesRes.items, enrollsRes.items)
  },

  updateBoardPosition: (
    applicationId: number,
    data: BoardPositionPatch
  ): Promise<{ ok: string }> => {
    return apiClient.patch<{ ok: string }>(
      `/vacancy-applications/enrolls/${applicationId}/board-position`,
      data
    )
  },

  update: (applicationId: number, data: UpdateVacancyApplicationDTO): Promise<{ ok: string }> => {
    return apiClient.patch<{ ok: string }>(`/vacancy-applications/admin/${applicationId}`, data)
  },

  createForVacancy: (
    vacancyId: number,
    data: CreateVacancyApplicationDTO
  ): Promise<CreateVacancyApplicationResponse> => {
    return apiClient.post<CreateVacancyApplicationResponse>(`/vacancies/${vacancyId}/applications`, data)
  },
}

const matchesApplicantSearch = (app: PaginatedVacancyApplications['items'][number], qLower: string) => {
  const haystack = [
    app.first_name,
    app.last_name,
    app.middle_name,
    app.email,
    app.phone,
    app.telegram,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(qLower)
}
