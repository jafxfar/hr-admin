export type ContractType = 'full_time' | 'part_time' | 'contractor'

export interface Contract {
    id?: number
    ended_at?: string
    started_at?: string
    type: ContractType
    details?: Record<string, any>
}

export interface CreateContractRequest extends Omit<Contract, 'user_id'> {
    user_id: number
}