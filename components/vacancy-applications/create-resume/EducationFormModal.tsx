'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput } from '@/components/custom-ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResumeEducationItem } from '@/types/vacancyApplications'
import { EDUCATION_TYPE_OPTIONS } from './resume-options'
import { RESUME_FIELD_TRIGGER_CLASS } from './field-styles'

type EducationFormModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (item: ResumeEducationItem) => void
}

const emptyItem = (): ResumeEducationItem => ({
  education_type: '',
  start_year: '',
  end_year: '',
  institution: '',
  specialty: '',
  city: '',
})

export const EducationFormModal = ({ open, onClose, onSubmit }: EducationFormModalProps) => {
  const [item, setItem] = useState<ResumeEducationItem>(emptyItem())

  const handleClose = () => {
    setItem(emptyItem())
    onClose()
  }

  const handleSubmit = () => {
    onSubmit({
      education_type: item.education_type?.trim() || null,
      start_year: item.start_year?.trim() || null,
      end_year: item.end_year?.trim() || null,
      institution: item.institution?.trim() || null,
      specialty: item.specialty?.trim() || null,
      city: item.city?.trim() || null,
    })
    setItem(emptyItem())
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose() }}>
      <DialogContent className="select-text max-w-lg bg-app-surface-0 text-app-text">
        <DialogHeader>
          <DialogTitle>Информация об образовании</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Образование:</Label>
            <Select
              value={item.education_type || undefined}
              onValueChange={(value) => setItem((prev) => ({ ...prev, education_type: value }))}
            >
              <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edu-start">Год поступления:</Label>
              <DarkInput
                id="edu-start"
                value={item.start_year ?? ''}
                inputMode="numeric"
                onChange={(event) =>
                  setItem((prev) => ({
                    ...prev,
                    start_year: event.target.value.replace(/\D/g, '').slice(0, 4),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-end">Год окончания:</Label>
              <DarkInput
                id="edu-end"
                value={item.end_year ?? ''}
                inputMode="numeric"
                onChange={(event) =>
                  setItem((prev) => ({
                    ...prev,
                    end_year: event.target.value.replace(/\D/g, '').slice(0, 4),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edu-institution">Название учебного заведения:</Label>
            <DarkInput
              id="edu-institution"
              value={item.institution ?? ''}
              onChange={(event) =>
                setItem((prev) => ({ ...prev, institution: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-specialty">Специальность:</Label>
            <DarkInput
              id="edu-specialty"
              value={item.specialty ?? ''}
              onChange={(event) =>
                setItem((prev) => ({ ...prev, specialty: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-city">Город:</Label>
            <DarkInput
              id="edu-city"
              value={item.city ?? ''}
              onChange={(event) => setItem((prev) => ({ ...prev, city: event.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.15)] hover:bg-brand"
          >
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
