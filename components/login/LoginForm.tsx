'use client'

import { useLoginForm } from '@/hooks/use-login-form'
import { LoginCredentialsForm } from './login-credentials-form'
import { LoginSplitLayout } from './login-split-layout'

export const LoginForm = () => {
  const {
    showPassword,
    loginValue,
    password,
    error,
    isPending,
    setLoginValue,
    setPassword,
    handleSubmit,
    handleTogglePassword,
  } = useLoginForm()

  return (
    <LoginSplitLayout
      title="Вход"
      subtitle="Защищённый вход для управления платформой Artemis HR."
    >
      <LoginCredentialsForm
        showPassword={showPassword}
        loginValue={loginValue}
        password={password}
        error={error}
        isPending={isPending}
        onLoginChange={setLoginValue}
        onPasswordChange={setPassword}
        onTogglePassword={handleTogglePassword}
        onSubmit={handleSubmit}
      />
    </LoginSplitLayout>
  )
}
