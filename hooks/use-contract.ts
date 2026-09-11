import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contractApi } from '@/api/contract'
import type { CreateContractRequest } from '@/types/contracts'

export const CONTRACT_QUERY_KEY = ['contract']

export function useContract(id: number) {
    return useQuery({
        queryKey: [...CONTRACT_QUERY_KEY, id],
        queryFn: () => contractApi.getContractById(id),
        enabled: !!id,
    })
}

export function useCreateContractMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'create' as const },
        mutationFn: (data: CreateContractRequest) => contractApi.createContract(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEY })
        },
    })
}

export function useUpdateContractMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'update' as const },
        mutationFn: ({ contract_id, data }: { contract_id: number; data: CreateContractRequest }) => contractApi.updateContract(contract_id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEY })
        },
    })
}

export function useDeleteContractMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { mutationAction: 'delete' as const },
        mutationFn: (contract_id: number) => contractApi.deleteContract(contract_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEY })
        },
    })
}
