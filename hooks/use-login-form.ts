'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLoginMutation } from '@/hooks/use-login'
import { employeesApi } from '@/api/employee'
import { getApiErrorMessage } from '@/lib/api-error'
import { getSystemRoleName } from '@/lib/employee-profile-normalize'

export const useLoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [showPassword, setShowPassword] = useState(false)
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: login, isPending } = useLoginMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    login(
      { login: loginValue, password },
      {
        onSuccess: async () => {
          try {
            const me = await employeesApi.getMeEmployee()
            const role = getSystemRoleName(me)?.toLowerCase() ?? ''
            const canAccessAdminUi = role === 'superadmin' || me.can_access_admin_ui === true
            if (!canAccessAdminUi) {
              router.push('/unauthorized')
            } else {
              router.push(callbackUrl)
            }
          } catch {
            router.push(callbackUrl)
          }
        },
        onError: (err: unknown) =>
          setError(getApiErrorMessage(err, 'Ошибка входа. Проверьте данные.')),
      },
    )
  }

  const handleTogglePassword = () => setShowPassword((value) => !value)

  return {
    showPassword,
    loginValue,
    password,
    error,
    isPending,
    setLoginValue,
    setPassword,
    handleSubmit,
    handleTogglePassword,
  }
}
