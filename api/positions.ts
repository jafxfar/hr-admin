import { apiClient } from './client'
import type { Positions, PositionJobInstruction } from '@/types/positions'
import type { Paginated } from '@/types/pagination'

export interface CreatePositionRequest {
    title: string
    description?: string
}

export interface UpdatePositionRequest {
    title?: string
    description?: string
    is_active?: boolean
}

export const positionsApi = {
    createPosition: (data: CreatePositionRequest): Promise<number> =>
        apiClient.post<number>('/positions/position/create', data),

    getAllPositions: (q = '', page = 1, pageSize = 20): Promise<Paginated<Positions>> => {
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
        if (q) params.set('q', q)
        return apiClient.get<Paginated<Positions>>(`/positions/all?${params.toString()}`)
    },

    getPositionById: (positionId: number): Promise<Positions> =>
        apiClient.get<Positions>(`/positions/position/${positionId}`),

    getPositionsByDepartment: (
        departmentId: number,
        page = 1,
        pageSize = 20,
    ): Promise<Paginated<Positions>> => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize),
        })
        return apiClient.get<Paginated<Positions>>(
            `/positions/by-department/${departmentId}?${params.toString()}`,
        )
    },

    updatePosition: (positionId: number, data: UpdatePositionRequest): Promise<{ ok: boolean }> =>
        apiClient.patch<{ ok: boolean }>(`/positions/position/${positionId}`, data),

    deletePosition: (positionId: number): Promise<void> =>
        apiClient.delete<void>(`/positions/position/${positionId}`),

    getJobInstruction: (positionId: number): Promise<PositionJobInstruction> =>
        apiClient.get<PositionJobInstruction>(
            `/positions/position/${positionId}/job-instruction`,
        ),

    uploadJobInstruction: (positionId: number, file: File): Promise<{ ok: boolean }> => {
        const formData = new FormData()
        formData.append('file', file)
        return apiClient.post<{ ok: boolean }>(
            `/positions/position/${positionId}/job-instruction`,
            formData,
        )
    },

    setJobInstructionStatus: (
        positionId: number,
        isActive: boolean,
    ): Promise<{ ok: boolean }> =>
        apiClient.patch<{ ok: boolean }>(
            `/positions/position/${positionId}/job-instruction/status`,
            { is_active: isActive },
        ),
}
