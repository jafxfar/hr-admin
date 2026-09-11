'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { loginApi } from '@/api/auth'
import { getLastActivityAt, notifyActivity, subscribeActivity } from '@/lib/activity-tracker'
import { clearAuthStorage, persistAuthResponse } from '@/lib/auth-storage'
import { SessionTimeoutDialog } from '@/components/session-timeout-dialog'

const parsePositiveIntOrFallback = (value: string | undefined, fallback: number) => {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return fallback
  if (parsed <= 0) return fallback
  return parsed
}

const IDLE_TIMEOUT_MINUTES = parsePositiveIntOrFallback(
  process.env.NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MINUTES,
  30,
)
const LOGOUT_COUNTDOWN_S = parsePositiveIntOrFallback(
  process.env.NEXT_PUBLIC_SESSION_LOGOUT_COUNTDOWN_SECONDS,
  60,
)
const POLL_SECONDS = parsePositiveIntOrFallback(
  process.env.NEXT_PUBLIC_SESSION_IDLE_POLL_SECONDS,
  30,
)

const IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MINUTES * 60 * 1000
const POLL_MS = POLL_SECONDS * 1000

type SessionTimeoutProviderProps = {
  children: React.ReactNode
}

export const SessionTimeoutProvider = ({ children }: SessionTimeoutProviderProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [countdown, setCountdown] = useState(LOGOUT_COUNTDOWN_S)
  const [isContinuing, setIsContinuing] = useState(false)
  const isWarningOpenRef = useRef(false)
  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/')

  const handleLogout = useCallback(() => {
    clearAuthStorage()
    setIsWarningOpen(false)
    setCountdown(LOGOUT_COUNTDOWN_S)
    router.push('/login')
  }, [router])

  const handleLogoutRef = useRef(handleLogout)
  handleLogoutRef.current = handleLogout

  useEffect(() => {
    isWarningOpenRef.current = isWarningOpen
  }, [isWarningOpen])

  useEffect(() => {
    if (isLoginPage) {
      setIsWarningOpen(false)
      setCountdown(LOGOUT_COUNTDOWN_S)
    }
  }, [isLoginPage])

  useEffect(() => {
    return subscribeActivity(() => {
      if (!isWarningOpenRef.current) return
      setIsWarningOpen(false)
      setCountdown(LOGOUT_COUNTDOWN_S)
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isLoginPage) return

    const tick = () => {
      if (!localStorage.getItem('accessToken')) return
      if (isWarningOpenRef.current) return
      const idle = Date.now() - getLastActivityAt()
      if (idle >= IDLE_TIMEOUT_MS) {
        setIsWarningOpen(true)
        setCountdown(LOGOUT_COUNTDOWN_S)
      }
    }

    const id = setInterval(tick, POLL_MS)
    tick()
    return () => clearInterval(id)
  }, [isLoginPage])

  useEffect(() => {
    if (!isWarningOpen) return undefined
    let seconds = LOGOUT_COUNTDOWN_S
    setCountdown(seconds)
    const id = setInterval(() => {
      seconds -= 1
      setCountdown(seconds)
      if (seconds <= 0) {
        clearInterval(id)
        handleLogoutRef.current()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [isWarningOpen])

  const handleContinue = useCallback(async () => {
    if (typeof window === 'undefined') return
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      handleLogoutRef.current()
      return
    }
    setIsContinuing(true)
    try {
      const res = await loginApi.refresh(refreshToken)
      persistAuthResponse(res)
      notifyActivity()
      setIsWarningOpen(false)
      setCountdown(LOGOUT_COUNTDOWN_S)
    } catch {
      handleLogoutRef.current()
    } finally {
      setIsContinuing(false)
    }
  }, [])

  return (
    <>
      {children}
      <SessionTimeoutDialog
        open={isWarningOpen}
        countdownSeconds={countdown}
        isContinuing={isContinuing}
        onContinue={handleContinue}
        onLogout={handleLogout}
      />
    </>
  )
}
