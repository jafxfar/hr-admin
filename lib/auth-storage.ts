import type { LoginResponse } from '@/types/auth'

export const persistAuthResponse = (response: LoginResponse) => {
    if (typeof window === 'undefined') return
    const access = response.access_token ?? response.accessToken ?? ''
    const refresh = response.refresh_token ?? response.refreshToken ?? ''
    if (access) {
        localStorage.setItem('accessToken', access)
    }
    if (refresh) {
        localStorage.setItem('refreshToken', refresh)
    }
}

export const clearAuthStorage = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}
