export interface Salary {
    id?: number
    amount: number
    ended_at?: string
    started_at: string
    currency?: string
    prepaid_percent?: number
}

export interface CreateSalaryRequest extends Omit<Salary, 'user_id'> {
    user_id: number
}