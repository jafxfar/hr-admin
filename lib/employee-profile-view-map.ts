import type {
    Employee,
    EmployeeProfileViewModel,
    PositionHistoryEntry,
    PublicProfileDepartment,
    PublicProfileEducation,
    PublicProfilePosition,
    PublicProfileReward,
    PublicProfileSchedule,
    PublicProfileWorkExperience,
} from '@/types/employees'

const buildFullName = (employee: Employee): string => {
    const p = employee.properties
    if (!p) return ''
    const parts = [p.last_name, p.first_name, p.middle_name].filter((x) => x && String(x).trim())
    return parts.join(' ').trim()
}

const resolvePosition = (employee: Employee): PublicProfilePosition => {
    const pd = employee.position_department?.position
    if (pd && typeof pd === 'object' && pd !== null) {
        return {
            id: pd.id ?? employee.position?.id ?? null,
            title: pd.title ?? employee.position?.title ?? null,
            description: pd.description ?? employee.position?.description ?? null,
            started_at: pd.started_at ?? null,
            ended_at: pd.ended_at ?? null,
            assigned_at: pd.assigned_at ?? null,
        }
    }
    return {
        id: employee.position?.id ?? null,
        title: employee.position?.title ?? (typeof pd === 'string' ? pd : null),
        description: employee.position?.description ?? null,
    }
}

const resolveDepartment = (employee: Employee): PublicProfileDepartment => {
    const root = employee.department
    const pd = employee.position_department?.department
    const parsed =
        typeof pd === 'string'
            ? { name: pd.trim() || null }
            : pd && typeof pd === 'object'
              ? pd
              : null

    return {
        id: parsed?.id ?? root?.id ?? null,
        name: parsed?.name ?? root?.name ?? null,
        head_user: parsed?.head_user ?? null,
    }
}

const resolveBranch = (employee: Employee) => {
    const fromRoot = employee.branch
    if (fromRoot) return fromRoot
    const fromPd = employee.position_department?.branch
    if (fromPd) return fromPd
    const current = employee.position_history?.find((h) => h.is_current) ?? employee.position_history?.[0]
    return current?.branch ?? null
}

const mapEducations = (employee: Employee): PublicProfileEducation[] => {
    const rows = employee.educations ?? employee.education ?? []
    return rows.map((item) => ({
        id: item.id,
        institution: item.institution ?? null,
        degree: item.degree ?? null,
        specialization: item.specialization ?? null,
        started_at: item.started_at ?? null,
        ended_at: item.ended_at ?? null,
    }))
}

const mapWorkExperiences = (employee: Employee): PublicProfileWorkExperience[] => {
    const rows = employee.work_experiences ?? employee.work_experience ?? []
    return rows.map((item) => ({
        id: item.id,
        company: item.company ?? null,
        position: item.position ?? null,
        description: item.description ?? null,
        started_at: item.started_at ?? null,
        ended_at: item.ended_at ?? null,
    }))
}

const mapSchedules = (employee: Employee): PublicProfileSchedule[] => {
    return (employee.schedules ?? []).map((item) => ({
        id: item.id,
        days_per_week: item.days_per_week ?? null,
        hours_per_day: item.hours_per_day ?? null,
        started_at: item.started_at ?? null,
        ended_at: item.ended_at ?? null,
        details: item.details ?? null,
    }))
}

const mapRewards = (employee: Employee): PublicProfileReward[] => {
    const rows = employee.rewards ?? []
    return rows
        .map((raw): PublicProfileReward | null => {
            if (!raw || typeof raw !== 'object') return null
            const item = raw as Record<string, unknown>
            const reward = item.reward
            if (!reward || typeof reward !== 'object') return null
            const r = reward as Record<string, unknown>
            const id = typeof r.id === 'number' ? r.id : null
            const title = typeof r.title === 'string' ? r.title : null
            if (id == null || !title) return null
            return {
                assignment_id: typeof item.assignment_id === 'number' ? item.assignment_id : undefined,
                assigned_at: typeof item.assigned_at === 'string' ? item.assigned_at : null,
                reward: {
                    id,
                    title,
                    description: typeof r.description === 'string' ? r.description : null,
                    image_url: typeof r.image_url === 'string' ? r.image_url : null,
                    created_at: typeof r.created_at === 'string' ? r.created_at : null,
                },
            }
        })
        .filter((item): item is PublicProfileReward => item !== null)
}

export const mapEmployeeToProfileView = (
    employee: Employee,
    positionHistory?: PositionHistoryEntry[],
): EmployeeProfileViewModel => {
    const p = employee.properties
    const fullName = buildFullName(employee)
    const history = positionHistory?.length
        ? positionHistory
        : employee.position_history ?? []

    return {
        id: employee.id,
        email: employee.email,
        full_name: fullName || null,
        first_name: p?.first_name ?? null,
        last_name: p?.last_name ?? null,
        middle_name: p?.middle_name ?? null,
        profile_photo_url: p?.profile_photo_url ?? null,
        branch: resolveBranch(employee),
        position: resolvePosition(employee),
        department: resolveDepartment(employee),
        educations: mapEducations(employee),
        work_experiences: mapWorkExperiences(employee),
        rewards: mapRewards(employee),
        schedules: mapSchedules(employee),
        position_history: history,
        document_checklist: employee.document_checklist,
        is_active: employee.is_active,
    }
}
