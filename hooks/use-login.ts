import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/api/auth'
import type { LoginRequest, LoginResponse } from '@/types/auth'
import { persistAuthResponse } from '@/lib/auth-storage'

export function useLoginMutation() {
    return useMutation({
        meta: { skipErrorToast: true, skipSuccessToast: true },
        mutationFn: (data: LoginRequest) => loginApi.login(data),
        onSuccess: (response: LoginResponse) => {
            persistAuthResponse(response)
        },
    })
}

export { useLoginForm } from './use-login-form'
