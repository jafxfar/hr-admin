'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DarkInput } from '@/components/custom-ui'
import type { ResumeWorkExperienceItem } from '@/types/vacancyApplications'
import { ExperienceFormModal } from './ExperienceFormModal'

type StepExperienceProps = {
  experiences: ResumeWorkExperienceItem[]
  onChange: (items: ResumeWorkExperienceItem[]) => void
  disabled?: boolean
}

const formatExperience = (item: ResumeWorkExperienceItem) => {
  const years = item.is_current
    ? `${item.start_year ?? ''}–н.в.`
    : [item.start_year, item.end_year].filter(Boolean).join('–')
  const parts = [item.position, item.employer, item.city, years].filter(Boolean)
  return parts.join(' · ') || 'Без названия'
}

export const StepExperience = ({ experiences, onChange, disabled }: StepExperienceProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleAdd = (item: ResumeWorkExperienceItem) => {
    onChange([...experiences, item])
    setModalOpen(false)
  }

  const handleRemove = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-3xl border border-dashed border-app-border-accent p-5">
      <p className="mb-4 text-sm text-app-text">Расскажите нам о своем опыте работы:</p>

      {experiences.length === 0 ? (
        <div className="mb-3">
          <DarkInput value="Нет информации" readOnly disabled />
        </div>
      ) : (
        <ul className="mb-3 space-y-2">
          {experiences.map((item, index) => (
            <li
              key={`${item.employer}-${index}`}
              className="flex items-start justify-between gap-3 rounded-3xl border border-app-border-accent bg-app-surface-1 px-4 py-3 text-sm"
            >
              <div>
                <p className="text-app-text">{formatExperience(item)}</p>
                {item.description ? (
                  <p className="mt-1 text-app-text-muted whitespace-pre-wrap">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Удалить опыт"
                disabled={disabled}
                onClick={() => handleRemove(index)}
                className="shrink-0 text-app-text-muted hover:text-brand-accent disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => setModalOpen(true)}
          className="h-9 gap-1 rounded-full border-brand-accent/50 bg-app-surface-1 text-brand-accent hover:bg-brand-accent/10"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      <ExperienceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  )
}
