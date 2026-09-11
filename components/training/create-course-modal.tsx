'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Modal, ModalActions, ModalHeader } from '@/components/custom-ui/modal'
import { useCreateLmsCourse } from '@/hooks/use-lms'
import { useToast } from '@/hooks/use-toast'

type CreateCourseModalProps = {
  open: boolean
  onClose: () => void
  onCreated: (courseId: number) => void
}

const fieldClassName =
  'h-10 w-full rounded-full border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 text-sm text-app-text placeholder:text-app-text-muted/60 outline-none focus:border-brand-accent/40 focus:ring-2 focus:ring-brand-accent/15'

export const CreateCourseModal = ({ open, onClose, onCreated }: CreateCourseModalProps) => {
  const { toast } = useToast()
  const createCourse = useCreateLmsCourse()
  const [title, setTitle] = useState('')
  const [info, setInfo] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleClose = () => {
    if (createCourse.isPending) return
    setTitle('')
    setInfo('')
    setImageUrl('')
    onClose()
  }

  const handleConfirm = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    createCourse.mutate(
      {
        title: trimmedTitle,
        info: info.trim() || null,
        image_url: imageUrl.trim() || null,
      },
      {
        onSuccess: (courseId) => {
          toast({ title: 'Курс создан' })
          handleClose()
          onCreated(courseId)
        },
        onError: () => {
          toast({ title: 'Не удалось создать курс', variant: 'destructive' })
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader icon={BookOpen} title="Новый курс" subtitle="Основная информация" onClose={handleClose} />
      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Название</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, Онбординг"
            className={fieldClassName}
            aria-label="Название курса"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Описание</span>
          <textarea
            value={info}
            onChange={(event) => setInfo(event.target.value)}
            placeholder="Кратко о курсе"
            rows={3}
            className="w-full rounded-2xl border border-app-border-accent bg-[rgb(var(--theme-primary-rgb)/0.08)] px-4 py-3 text-sm text-app-text placeholder:text-app-text-muted/60 outline-none focus:border-brand-accent/40 focus:ring-2 focus:ring-brand-accent/15"
            aria-label="Описание курса"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-app-text-muted">Обложка (URL)</span>
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://"
            className={fieldClassName}
            aria-label="URL обложки"
          />
        </label>
      </div>
      <ModalActions
        onCancel={handleClose}
        onConfirm={handleConfirm}
        confirmLabel="Создать"
        confirmDisabled={!title.trim()}
        confirmLoading={createCourse.isPending}
      />
    </Modal>
  )
}
