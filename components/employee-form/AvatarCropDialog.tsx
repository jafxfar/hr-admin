'use client'

import { useCallback, useMemo, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cropToDataUrl } from '@/lib/image-crop'

type AvatarCropDialogProps = {
  open: boolean
  imageSrc: string | null
  onClose: () => void
  onSave: (dataUrl: string) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const AvatarCropDialog = ({ open, imageSrc, onClose, onSave }: AvatarCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const canRender = Boolean(imageSrc)
  const minZoom = 1
  const maxZoom = 3

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) return
    onClose()
  }

  const zoomPercent = useMemo(() => Math.round(((zoom - minZoom) / (maxZoom - minZoom)) * 100), [zoom])

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels || isSaving) return
    setIsSaving(true)
    try {
      const dataUrl = await cropToDataUrl(imageSrc, croppedAreaPixels, {
        outputMime: 'image/webp',
        quality: 0.92,
      })
      onSave(dataUrl)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-app-surface-0 border-app-border text-app-text">
        <DialogHeader>
          <DialogTitle className="text-app-text">Обрезать фото</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full overflow-hidden rounded-2xl bg-app-surface-1 border border-app-border aspect-16/10">
            {canRender ? (
              <Cropper
                image={imageSrc ?? undefined}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={(z) => setZoom(clamp(z, minZoom, maxZoom))}
                onCropComplete={handleCropComplete}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-app-text-muted">
                Нет изображения
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-app-text-muted">
              Масштаб
            </div>
            <input
              aria-label="Масштаб"
              type="range"
              min={minZoom}
              max={maxZoom}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
            <div className="w-12 text-right text-xs font-semibold text-app-text-muted tabular-nums">
              {zoomPercent}%
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-4 text-sm font-semibold border border-app-border bg-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={!canRender || !croppedAreaPixels || isSaving}
            onClick={handleSave}
            className="h-10 rounded-full px-5 text-sm font-bold bg-brand-accent text-brand-accent-on-alt disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
          >
            {isSaving ? 'Сохранение…' : 'Выбрать'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

