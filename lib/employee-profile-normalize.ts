import type { Employee } from '@/types/employees'

/** API may return `role` as legacy string or as `{ name, ... }` */
export type SystemRoleField = Employee['role']

const asPositiveIntId = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return Math.trunc(value)
    }
    if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
        const n = Number(value.trim())
        if (Number.isFinite(n) && n > 0) return n
    }
    return undefined
}

/**
 * Parse JSON strings possibly double-encoded from DB/driver.
 * Stops when the value is not a string or does not look like JSON.
 */
export const parseJsonLoose = (value: unknown): unknown => {
    let current: unknown = value
    for (let i = 0; i < 3; i++) {
        if (typeof current !== 'string') {
            return current
        }
        const trimmed = current.trim()
        if (!trimmed) {
            return current
        }
        if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
            return current
        }
        try {
            current = JSON.parse(trimmed) as unknown
        } catch {
            return current
        }
    }
    return current
}

export const getSystemRoleName = (employee: { role?: SystemRoleField } | null | undefined): string | undefined => {
    const role = employee?.role
    if (role == null) {
        return undefined
    }
    if (typeof role === 'string') {
        const trimmed = role.trim()
        return trimmed || undefined
    }
    if (typeof role === 'object' && 'name' in role) {
        const name = (role as { name?: unknown }).name
        if (typeof name === 'string') {
            const trimmed = name.trim()
            return trimmed || undefined
        }
    }
    return undefined
}

export const getBusinessRoleLabel = (employee: { business_role?: unknown } | null | undefined): string | undefined => {
    const br = employee?.business_role
    if (br == null) return undefined
    if (typeof br === 'string') {
        const trimmed = br.trim()
        return trimmed || undefined
    }
    if (typeof br === 'object' && br !== null && 'name' in br) {
        const name = (br as { name?: unknown }).name
        if (typeof name === 'string') {
            const trimmed = name.trim()
            return trimmed || undefined
        }
    }
    return undefined
}

type PositionDepartmentSlice = Pick<Employee, 'position_department'>

export const getPositionDepartmentIds = (
    employee: PositionDepartmentSlice | null | undefined,
): { position_id?: number; department_id?: number; department_name?: string } => {
    const pd = employee?.position_department
    if (!pd) {
        return {}
    }

    const positionParsed = parseJsonLoose(pd.position)
    const departmentRaw = pd.department
    const departmentParsed =
        typeof departmentRaw === 'string' ? parseJsonLoose(departmentRaw) : departmentRaw

    const positionId =
        positionParsed && typeof positionParsed === 'object'
            ? asPositiveIntId((positionParsed as { id?: unknown }).id)
            : undefined

    const departmentId =
        departmentParsed && typeof departmentParsed === 'object'
            ? asPositiveIntId((departmentParsed as { id?: unknown }).id)
            : undefined

    const departmentNameRaw =
        departmentParsed && typeof departmentParsed === 'object'
            ? (departmentParsed as { name?: unknown }).name
            : undefined
    const departmentName =
        typeof departmentNameRaw === 'string' ? departmentNameRaw.trim() || undefined : undefined

    return {
        ...(positionId !== undefined ? { position_id: positionId } : {}),
        ...(departmentId !== undefined ? { department_id: departmentId } : {}),
        ...(departmentName !== undefined ? { department_name: departmentName } : {}),
    }
}
