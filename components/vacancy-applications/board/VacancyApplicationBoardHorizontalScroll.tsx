'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface VacancyApplicationBoardHorizontalScrollProps {
  children: ReactNode
  className?: string
}

export const VacancyApplicationBoardHorizontalScroll = ({
  children,
  className,
}: VacancyApplicationBoardHorizontalScrollProps) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState({ scrollLeft: 0, scrollWidth: 0, clientWidth: 0 })
  const [trackWidth, setTrackWidth] = useState(0)
  const [isDraggingThumb, setIsDraggingThumb] = useState(false)

  const updateMetrics = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    setMetrics({
      scrollLeft: viewport.scrollLeft,
      scrollWidth: viewport.scrollWidth,
      clientWidth: viewport.clientWidth,
    })
    if (trackRef.current) {
      setTrackWidth(trackRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    updateMetrics()
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport) return

    const observer = new ResizeObserver(updateMetrics)
    observer.observe(viewport)
    if (content) observer.observe(content)

    return () => observer.disconnect()
  }, [updateMetrics, children])

  useLayoutEffect(() => {
    updateMetrics()
  }, [updateMetrics])

  useEffect(() => {
    if (!isDraggingThumb) return

    const handlePointerMove = (event: PointerEvent) => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return

      const rect = track.getBoundingClientRect()
      const maxScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 0)
      const thumbWidth = Math.max(32, rect.width * (viewport.clientWidth / viewport.scrollWidth))
      const travel = Math.max(rect.width - thumbWidth, 1)
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left - thumbWidth / 2) / travel))
      viewport.scrollLeft = ratio * maxScroll
    }

    const handlePointerUp = () => setIsDraggingThumb(false)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDraggingThumb])

  const canScroll = metrics.scrollWidth > metrics.clientWidth + 2

  useEffect(() => {
    if (!canScroll) return
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(updateMetrics)
    observer.observe(track)
    updateMetrics()
    return () => observer.disconnect()
  }, [updateMetrics, canScroll])

  const maxScroll = Math.max(metrics.scrollWidth - metrics.clientWidth, 0)
  const thumbRatio = canScroll
    ? Math.min(1, metrics.clientWidth / metrics.scrollWidth)
    : 1
  const thumbWidthPx = Math.max(32, trackWidth * thumbRatio)
  const thumbTravel = Math.max(trackWidth - thumbWidthPx, 0)
  const thumbLeftPx = maxScroll > 0 ? (metrics.scrollLeft / maxScroll) * thumbTravel : 0
  const scrollPercent = maxScroll > 0 ? Math.round((metrics.scrollLeft / maxScroll) * 100) : 0

  const scrollToRatio = (ratio: number) => {
    const viewport = viewportRef.current
    if (!viewport || !canScroll) return
    const clamped = Math.min(1, Math.max(0, ratio))
    viewport.scrollLeft = clamped * maxScroll
  }

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || !canScroll) return
    const rect = track.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const ratio = (clickX - thumbWidthPx / 2) / Math.max(rect.width - thumbWidthPx, 1)
    scrollToRatio(ratio)
  }

  const handleThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingThumb(true)
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport || !canScroll) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      viewport.scrollLeft += event.deltaX
      return
    }
    if (event.shiftKey && event.deltaY !== 0) {
      event.preventDefault()
      viewport.scrollLeft += event.deltaY
    }
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div
        ref={viewportRef}
        onScroll={updateMetrics}
        onWheel={handleWheel}
        className="kanban-scroll-viewport min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain"
        aria-label="Колонки статусов"
      >
        <div
          ref={contentRef}
          className="flex h-full min-h-0 w-max min-w-full items-stretch gap-3 pr-2"
        >
          {children}
        </div>
      </div>

      {canScroll ? (
        <div className="mt-auto shrink-0 px-2 pt-2 pb-1">
          <div
            ref={trackRef}
            role="scrollbar"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={scrollPercent}
            onClick={handleTrackClick}
            className="group relative mx-auto h-2.5 max-w-full cursor-pointer rounded-full bg-app-surface-1"
          >
            <div
              role="presentation"
              onPointerDown={handleThumbPointerDown}
              className={cn(
                'absolute top-0 h-full rounded-full bg-brand-accent shadow-[0_0_10px_rgb(var(--theme-primary-rgb)/0.4)] transition-[left] duration-75',
                'group-hover:bg-brand',
                isDraggingThumb ? 'cursor-grabbing' : 'cursor-grab'
              )}
              style={{
                width: thumbWidthPx,
                left: thumbLeftPx,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
