export class ApiError extends Error {
  status?: number
  detail?: unknown
  businessExceptionType?: unknown
  businessExceptionCode?: unknown

  constructor(
    message: string,
    options?: {
      status?: number
      detail?: unknown
      businessExceptionType?: unknown
      businessExceptionCode?: unknown
    },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.detail = options?.detail
    this.businessExceptionType = options?.businessExceptionType
    this.businessExceptionCode = options?.businessExceptionCode
  }
}

type FastApiValidationItem = {
  loc?: unknown
  msg?: unknown
}

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка'

const getFieldLabel = (loc: unknown): string | undefined => {
  if (!Array.isArray(loc) || loc.length === 0) {
    return undefined
  }

  const field = loc.filter((part) => part !== 'body' && part !== 'query' && part !== 'path').pop()
  return typeof field === 'string' || typeof field === 'number' ? String(field) : undefined
}

const formatValidationItem = (item: unknown): string | undefined => {
  if (typeof item === 'string' && item.trim()) {
    return item.trim()
  }

  if (!item || typeof item !== 'object') {
    return undefined
  }

  const { loc, msg } = item as FastApiValidationItem
  if (typeof msg !== 'string' || !msg.trim()) {
    return undefined
  }

  const field = getFieldLabel(loc)
  return field ? `${field}: ${msg}` : msg
}

export const parseApiErrorBody = (data: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  if (!data || typeof data !== 'object') {
    return fallback
  }

  const body = data as {
    detail?: unknown
    message?: unknown
    error?: unknown
  }

  const detail = body.detail

  if (typeof detail === 'string' && detail.trim()) {
    return detail.trim()
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map(formatValidationItem)
      .filter((message): message is string => Boolean(message))

    if (messages.length > 0) {
      return messages.join(' • ')
    }
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim()
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error.trim()
  }

  return fallback
}

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  if (typeof error === 'string' && error.trim()) {
    return error.trim()
  }

  if (error instanceof ApiError && error.message.trim()) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (error && typeof error === 'object') {
    const fromBody = parseApiErrorBody(error, '')
    if (fromBody) {
      return fromBody
    }

    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message.trim()
    }
  }

  return fallback
}

export const createApiErrorFromBody = (
  data: unknown,
  status: number,
  fallback = 'An error occurred',
): ApiError => {
  const body =
    data && typeof data === 'object'
      ? (data as {
          businessExceptionType?: unknown
          businessExceptionCode?: unknown
          detail?: unknown
        })
      : undefined

  return new ApiError(parseApiErrorBody(data, fallback), {
    status,
    detail: body?.detail,
    businessExceptionType: body?.businessExceptionType,
    businessExceptionCode: body?.businessExceptionCode,
  })
}
