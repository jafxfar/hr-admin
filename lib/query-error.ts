import { ApiError } from '@/lib/api-error'

type QueryError = {
    status?: number
}

export function isForbiddenError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false
    }

    return (error as QueryError).status === 403
}

export function isUnauthorizedError(error: unknown): boolean {
    if (error instanceof ApiError) {
        return error.status === 401
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
        return true
    }

    return false
}

export function isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
        return true
    }

    if (!(error instanceof Error)) {
        return false
    }

    const message = error.message.toLowerCase()
    return (
        message.includes('failed to fetch') ||
        message.includes('network') ||
        message.includes('load failed') ||
        message.includes('empty_response')
    )
}
