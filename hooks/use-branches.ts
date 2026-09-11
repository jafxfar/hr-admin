import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { branchesApi, BRANCHES_QUERY_KEY, type CreateBranchPayload, type UpdateBranchPayload } from '@/api/branches'

export function useBranchesTree(enabled = true) {
  return useQuery({
    queryKey: [...BRANCHES_QUERY_KEY, 'tree'],
    queryFn: () => branchesApi.getBranchesTree(),
    enabled,
  })
}

export function useBranchesList(
  q = '',
  page = 1,
  pageSize = 20,
  includeInactive = false,
  enabled = true,
) {
  return useQuery({
    queryKey: [...BRANCHES_QUERY_KEY, 'all', q, page, pageSize, includeInactive],
    queryFn: () => branchesApi.listBranches(q, page, pageSize, includeInactive),
    enabled,
    staleTime: 30_000,
  })
}

export function useCreateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'create' as const },
    mutationFn: (data: CreateBranchPayload) => branchesApi.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY] })
    },
  })
}

export function useUpdateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'update' as const },
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchPayload }) => branchesApi.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY] })
    },
  })
}

export function useDeleteBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { mutationAction: 'delete' as const },
    mutationFn: (id: number) => branchesApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...BRANCHES_QUERY_KEY] })
    },
  })
}
