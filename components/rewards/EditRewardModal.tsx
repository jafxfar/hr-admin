'use client'

import React, { useRef, useState, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DarkInput } from '@/components/custom-ui'
import { IconPicker } from './IconPicker'
import { useUpdateRewardMutation } from '@/hooks/use-rewards'
import { getIconByName } from '@/lib/lucide-icons'
import type { Reward } from '@/types/rewards'

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'

interface EditRewardModalProps {
  open: boolean
  onClose: () => void
  reward: Reward | null
}

export const EditRewardModal: React.FC<EditRewardModalProps> = ({ open, onClose, reward }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string>('Trophy')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateMutation = useUpdateRewardMutation()

  useEffect(() => {
    if (!reward) return
    setTitle(reward.title)
    setDescription(reward.description ?? '')
    setSelectedIcon(reward.icon_name ?? 'Trophy')
    setImageBase64(null)
    setImagePreview(null)
  }, [reward])

  const PreviewIcon = getIconByName(selectedIcon)
  const isValid = Boolean(title.trim())

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUri = reader.result as string
      setImagePreview(dataUri)
      setImageBase64(dataUri.split(',')[1] ?? dataUri)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!reward || !isValid) return
    updateMutation.mutate(
      {
        rewards_id: reward.id,
        data: {
          title,
          description,
          image_base64: imageBase64 ?? undefined,
          icon_name: imageBase64 ? undefined : (selectedIcon ?? undefined),
        },
      },
      { onSuccess: onClose },
    )
  }

  if (!reward) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            Редактировать награду
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className={labelCls}>
              Название <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Название награды"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Описание</Label>
            <Textarea
              placeholder="Описание награды..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={textareaCls}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Иконка</Label>
            {imagePreview ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={imagePreview} alt="icon" className="w-14 h-14 rounded-2xl object-cover border border-app-border-accent" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setImageBase64(null)
                    }}
                    aria-label="Удалить изображение"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-app-text-muted">Загруженное изображение</span>
              </div>
            ) : (
              <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-app-text-muted hover:text-app-text transition-colors underline underline-offset-2"
            >
              Загрузить своё изображение
            </button>
          </div>

          <div className="rounded-2xl border border-app-border-accent bg-app-surface-0 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-app-text-muted">
              Предпросмотр
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-accent">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                ) : PreviewIcon ? (
                  <PreviewIcon className="h-6 w-6 text-brand-accent-on" />
                ) : null}
              </div>
              <div>
                <p className="font-bold text-app-text">{title || 'Название награды'}</p>
                <p className="mt-0.5 text-sm text-app-text-muted">
                  {description || 'Описание появится здесь...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isValid || updateMutation.isPending}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
