'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const CLOSE_DELAY_MS = 160

export const useSidebarFlyout = () => {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleClose = useCallback(() => {
    clearCloseTimer()
    setOpenSectionId(null)
  }, [clearCloseTimer])

  const handlePanelEnter = useCallback(() => {
    clearCloseTimer()
  }, [clearCloseTimer])

  const handlePanelLeave = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpenSectionId(null)
    }, CLOSE_DELAY_MS)
  }, [clearCloseTimer])

  const handleSectionHover = useCallback(
    (sectionId: string) => {
      clearCloseTimer()
      setOpenSectionId(sectionId)
    },
    [clearCloseTimer],
  )

  const handleSectionToggle = useCallback((sectionId: string) => {
    setOpenSectionId((current) => (current === sectionId ? null : sectionId))
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSectionId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return {
    openSectionId,
    handleClose,
    handlePanelEnter,
    handlePanelLeave,
    handleSectionHover,
    handleSectionToggle,
  }
}
