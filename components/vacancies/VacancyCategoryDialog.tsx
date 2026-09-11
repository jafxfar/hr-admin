import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { VacancyCategory, CreateVacancyCategoryRequest } from '@/types/vacancyCategories'
interface VacancyCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateVacancyCategoryRequest) => void
  isPending?: boolean
  editingCategory?: VacancyCategory | null
}

export const VacancyCategoryDialog: React.FC<VacancyCategoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  editingCategory,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setDescription(editingCategory.description)
    } else {
      setName('')
      setDescription('')
    }
  }, [editingCategory, isOpen])

  const isValid = name.trim()

  const handleClose = () => {
    setName('')
    setDescription('')
    onClose()
  }

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-app-surface-0 border border-app-border-accent text-app-text">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-app-text">
            {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name" className="text-xs uppercase tracking-widest font-black text-app-text-muted">
              Название <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              placeholder="Введите название категории"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-desc" className="text-xs uppercase tracking-widest font-black text-app-text-muted">
              Описание
            </Label>
            <DarkTextarea placeholder="Введите описание категории (необязательно)" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="border-t border-app-border-accent pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6 text-sm rounded-full border-app-border-accent bg-transparent text-app-text-muted hover:bg-app-surface-3 hover:text-app-text"
          >
            Отменить
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="h-10 px-6 text-sm rounded-full bg-brand-accent text-brand-accent-on-alt font-bold hover:bg-brand disabled:opacity-40 shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.15)]"
          >
            {isPending ? 'Сохранение...' : editingCategory ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
