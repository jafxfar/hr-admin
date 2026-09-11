import type { CreateContractRequest, Contract } from "@/types/contracts";
import { apiClient } from './client'

export const contractApi = {

    getContractById: (user_id: number): Promise<Contract[]> => {
        return apiClient.get<Contract[]>(`/contracts/by-user/${user_id}`);
    },

    createContract: (data: CreateContractRequest): Promise<number> => {
        return apiClient.post<number>('/contracts/create', data);
    },

    updateContract: (contract_id: number, data: Contract): Promise<{ id: number }> => {
        return apiClient.put<{ id: number }>(`/contracts/${contract_id}`, data);
    },

    deleteContract: (contract_id: number): Promise<void> => {
        return apiClient.delete<void>(`/contracts/${contract_id}`);
    },
}
