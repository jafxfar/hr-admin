import type { LoginResponse } from '@/types/auth'
import { persistAuthResponse } from '@/lib/auth-storage'

let refreshInFlight: Promise<boolean> | null = null

export const tryRefreshAccessToken = async (baseUrl: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false

  if (refreshInFlight) {
    return refreshInFlight
  }

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return false

    try {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) return false

      const data = (await response.json()) as LoginResponse
      persistAuthResponse(data)
      return true
    } catch {
      return false
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}
