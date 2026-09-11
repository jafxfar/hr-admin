import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { positionsApi, type CreatePositionRequest, type UpdatePositionRequest } from '@/api/positions'

export const POSITIONS_QUERY_KEY = ['positions']
export const POSITION_JOB_INSTRUCTION_QUERY_KEY = ['position-job-instruction']

export function usePositions(q = '', page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...POSITIONS_QUERY_KEY, 'all', q, page, pageSize],
        queryFn: () => positionsApi.getAllPositions(q, page, pageSize),
        placeholderData: (prev) => prev,
    })
}

export function useCreatePositionMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreatePositionRequest) => positionsApi.createPosition(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY })
        },
    })
}

export function useUpdatePositionMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ id, data }: { id: number; data: UpdatePositionRequest }) =>
            positionsApi.updatePosition(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY })
        },
    })
}

export function useDeletePositionMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (id: number) => positionsApi.deletePosition(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY })
        },
    })
}

export function usePositionsByDepartment(departmentId: number | null | undefined) {
    return useQuery({
        queryKey: [...POSITIONS_QUERY_KEY, 'by-department', departmentId],
        queryFn: async () => {
            const res = await positionsApi.getPositionsByDepartment(departmentId!)
            return res.items ?? []
        },
        enabled: !!departmentId && departmentId > 0,
    })
}

export function useJobInstruction(positionId: number | null | undefined) {
    return useQuery({
        queryKey: [...POSITION_JOB_INSTRUCTION_QUERY_KEY, positionId],
        queryFn: () => positionsApi.getJobInstruction(positionId!),
        enabled: !!positionId && positionId > 0,
    })
}

export function useUploadJobInstructionMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { skipErrorToast: true, skipSuccessToast: true, mutationAction: 'update' as const },
        mutationFn: ({ positionId, file }: { positionId: number; file: File }) =>
            positionsApi.uploadJobInstruction(positionId, file),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY })
            queryClient.invalidateQueries({
                queryKey: [...POSITION_JOB_INSTRUCTION_QUERY_KEY, variables.positionId],
            })
        },
    })
}

export function useSetJobInstructionStatusMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        meta: { skipErrorToast: true, skipSuccessToast: true, mutationAction: 'update' as const },
        mutationFn: ({ positionId, isActive }: { positionId: number; isActive: boolean }) =>
            positionsApi.setJobInstructionStatus(positionId, isActive),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: POSITIONS_QUERY_KEY })
            queryClient.invalidateQueries({
                queryKey: [...POSITION_JOB_INSTRUCTION_QUERY_KEY, variables.positionId],
            })
        },
    })
}
