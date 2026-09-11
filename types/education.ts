export type EducationDegree = 'bachelor' | 'master' | 'phd' | 'other'

export interface Education {
    id?: number;
    institution: string;
    degree: EducationDegree;
    specialization: string;
    started_at: string;
    ended_at: string;
}

export interface CreateEducationRequest {
    user_id: number;
    institution: string;
    degree: EducationDegree;
    specialization: string;
    started_at: string;
    ended_at: string;
}
