'use client'

import React, { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { DarkInput } from '@/components/custom-ui'
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
import type { News, CreateNewsRequest } from '@/types/news'

const labelCls = 'text-xs uppercase tracking-widest font-black text-app-text-muted'
const textareaCls =
  'min-h-28 bg-app-surface-1 border-app-border-accent text-app-text placeholder:text-app-text-muted/70 focus-visible:ring-brand-accent/30 focus-visible:ring-2 focus-visible:border-none outline-none rounded-3xl resize-none'

/** Превращает относительный путь /uploads/... в полный URL к серверу */
function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
  const serverRoot = apiBase.replace(/\/api\/v\d+\/?$/, '')
  return `${serverRoot}${url}`
}

interface NewsModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: CreateNewsRequest) => void
  isPending?: boolean
  /** Если передан — режим редактирования */
  newsItem?: News | null
}

export function NewsModal({ open, onClose, onConfirm, isPending, newsItem }: NewsModalProps) {
  const isEdit = Boolean(newsItem)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverBase64, setCoverBase64] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    if (newsItem) {
      setTitle(newsItem.title)
      setBody(newsItem.body)
      setIsPublished(Boolean(newsItem.is_published))
      setCoverImage(resolveMediaUrl(newsItem.cover_url))
      setCoverBase64(null)
      return
    }

    setTitle('')
    setBody('')
    setIsPublished(false)
    setCoverImage(null)
    setCoverBase64(null)
  }, [open, newsItem])

  const isValid = Boolean(title.trim() && body.trim())

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Допустимые форматы: JPEG, PNG, WEBP, GIF')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUri = reader.result as string
      setCoverImage(dataUri)
      setCoverBase64(dataUri.slice(dataUri.indexOf('base64,') + 7))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverBase64(null)
  }

  const handleConfirm = () => {
    if (!isValid) return
    const payload: CreateNewsRequest = {
      title: title.trim(),
      body: body.trim(),
      is_published: isPublished,
      ...(coverBase64 ? { cover_base64: coverBase64 } : {}),
    }
    onConfirm(payload)
  }

  const handleClose = () => {
    onClose()
  }

  const confirmLabel = isPending
    ? isEdit
      ? 'Сохранение...'
      : 'Публикация...'
    : isEdit
      ? 'Сохранить'
      : 'Опубликовать'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            {isEdit ? 'Редактировать новость' : 'Добавить новость'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className={labelCls}>
              Заголовок <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Введите заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>
              Описание <span className="text-brand-accent">*</span>
            </Label>
            <Textarea
              placeholder="Введите текст новости"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={textareaCls}
            />
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Обложка</Label>
            {coverImage ? (
              <div className="relative inline-block w-full">
                <div className="w-full h-40 rounded-[12px] overflow-hidden bg-app-surface-0 border border-app-border-accent">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Удалить обложку"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full">
                <input
                  type="file"
                  id="news-cover-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="news-cover-upload"
                  className="block w-full h-40 rounded-[12px] bg-app-surface-0 border-2 border-dashed border-app-border-accent hover:border-brand-accent/40 transition-colors cursor-pointer"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-app-surface-1 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-app-text-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] text-app-text mb-0.5">
                        Выберите или перетащите файл
                      </p>
                      <p className="text-xs font-medium text-app-text-muted">
                        JPEG, PNG, WEBP, GIF до 5 МБ
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={isPublished}
              aria-label="Отобразить всем сотрудникам"
              onClick={() => setIsPublished((v) => !v)}
              className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                isPublished
                  ? 'bg-brand-accent border-brand-accent'
                  : 'bg-app-surface-0 border-app-border-accent'
              }`}
            >
              {isPublished && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-accent-on-alt"
                  />
                </svg>
              )}
            </button>
            <span
              className="text-[13px] text-app-text select-none cursor-pointer"
              onClick={() => setIsPublished((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsPublished((v) => !v)
                }
              }}
              role="button"
              tabIndex={0}
            >
              Отобразить всем сотрудникам
            </span>
          </div>
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid || isPending}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
