'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import type { ResumeWorkExperienceItem } from '@/types/vacancyApplications'

type ExperienceFormModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (item: ResumeWorkExperienceItem) => void
}

const emptyItem = (): ResumeWorkExperienceItem => ({
  position: '',
  employer: '',
  city: '',
  start_year: '',
  end_year: '',
  leave_reason: '',
  is_current: false,
  description: '',
})

export const ExperienceFormModal = ({ open, onClose, onSubmit }: ExperienceFormModalProps) => {
  const [item, setItem] = useState<ResumeWorkExperienceItem>(emptyItem())

  const handleClose = () => {
    setItem(emptyItem())
    onClose()
  }

  const handleSubmit = () => {
    onSubmit({
      position: item.position?.trim() || null,
      employer: item.employer?.trim() || null,
      city: item.city?.trim() || null,
      start_year: item.start_year?.trim() || null,
      end_year: item.is_current ? null : item.end_year?.trim() || null,
      leave_reason: item.leave_reason?.trim() || null,
      is_current: Boolean(item.is_current),
      description: item.description?.trim() || null,
    })
    setItem(emptyItem())
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose() }}>
      <DialogContent className="select-text max-h-[90vh] max-w-lg overflow-y-auto bg-app-surface-0 text-app-text">
        <DialogHeader>
          <DialogTitle>Информация об опыте</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="exp-position">Должность</Label>
            <DarkInput
              id="exp-position"
              value={item.position ?? ''}
              onChange={(event) => setItem((prev) => ({ ...prev, position: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-employer">Работодатель</Label>
            <DarkInput
              id="exp-employer"
              value={item.employer ?? ''}
              onChange={(event) => setItem((prev) => ({ ...prev, employer: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="exp-city">Город</Label>
              <DarkInput
                id="exp-city"
                value={item.city ?? ''}
                onChange={(event) => setItem((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-start">Год начала</Label>
              <DarkInput
                id="exp-start"
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
              <Label htmlFor="exp-end">Год окончания</Label>
              <DarkInput
                id="exp-end"
                value={item.end_year ?? ''}
                disabled={item.is_current}
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
            <Label htmlFor="exp-leave">Причина ухода</Label>
            <DarkInput
              id="exp-leave"
              value={item.leave_reason ?? ''}
              disabled={item.is_current}
              onChange={(event) =>
                setItem((prev) => ({ ...prev, leave_reason: event.target.value }))
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-app-text">
            <Checkbox
              checked={Boolean(item.is_current)}
              onCheckedChange={(checked) =>
                setItem((prev) => ({
                  ...prev,
                  is_current: checked === true,
                  end_year: checked === true ? '' : prev.end_year,
                }))
              }
              aria-label="В настоящее время я работаю здесь"
            />
            В настоящее время я работаю здесь
          </label>
          <div className="space-y-2">
            <Label>Напишите о своем опыте работы:</Label>
            <DarkTextarea
              rows={4}
              value={item.description ?? ''}
              onChange={(event) =>
                setItem((prev) => ({ ...prev, description: event.target.value }))
              }
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
