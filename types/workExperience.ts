export interface WorkExperience {
    id?: number
    company: string
    ended_at: string
    position?: string
    started_at: string
    description?: string
}

export interface CreateWorkExperienceRequest extends WorkExperience {
    user_id: number
}
