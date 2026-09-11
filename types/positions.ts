
export interface Positions {
    id: number
    department_id: number
    title: string
    description: string
    job_instruction_path?: string | null
    job_instruction_is_active?: boolean
    job_instruction_url?: string | null
}

export interface CreatePositionRequest {
    department_id: number
    title: string
    description: string
}

export interface PositionJobInstruction {
    position_id: number
    is_active: boolean
    path: string | null
    url: string | null
}
