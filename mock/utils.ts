export const parseEndpoint = (endpoint: string) => {
  const [path, queryString] = endpoint.split('?')
  const params = new URLSearchParams(queryString ?? '')
  return { path, params }
}

export const getIntParam = (params: URLSearchParams, key: string, fallback: number) => {
  const raw = params.get(key)
  if (raw === null || raw === '') return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

export const getBoolParam = (params: URLSearchParams, key: string, fallback = false) => {
  const raw = params.get(key)
  if (raw === null) return fallback
  return raw === 'true' || raw === '1'
}

export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / safePageSize))
  const start = (safePage - 1) * safePageSize

  return {
    items: items.slice(start, start + safePageSize),
    total,
    page: safePage,
    page_size: safePageSize,
    total_pages: totalPages,
  }
}

export const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))
