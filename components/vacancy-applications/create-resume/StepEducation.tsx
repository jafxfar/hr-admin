'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DarkInput } from '@/components/custom-ui'
import type { ResumeEducationItem } from '@/types/vacancyApplications'
import { EducationFormModal } from './EducationFormModal'
import { EDUCATION_TYPE_OPTIONS } from './resume-options'

type StepEducationProps = {
  educations: ResumeEducationItem[]
  onChange: (items: ResumeEducationItem[]) => void
  disabled?: boolean
}

const formatEducation = (item: ResumeEducationItem) => {
  const typeLabel =
    EDUCATION_TYPE_OPTIONS.find((option) => option.value === item.education_type)?.label ??
    item.education_type
  const years = [item.start_year, item.end_year].filter(Boolean).join('–')
  const parts = [typeLabel, item.institution, item.specialty, years, item.city].filter(Boolean)
  return parts.join(' · ') || 'Без названия'
}

export const StepEducation = ({ educations, onChange, disabled }: StepEducationProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleAdd = (item: ResumeEducationItem) => {
    onChange([...educations, item])
    setModalOpen(false)
  }

  const handleRemove = (index: number) => {
    onChange(educations.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-3xl border border-dashed border-app-border-accent p-5">
      <p className="mb-4 text-sm text-app-text">Расскажите нам о своем образовании:</p>

      {educations.length === 0 ? (
        <div className="mb-3">
          <DarkInput value="Нет информации" readOnly disabled />
        </div>
      ) : (
        <ul className="mb-3 space-y-2">
          {educations.map((item, index) => (
            <li
              key={`${item.institution}-${index}`}
              className="flex items-start justify-between gap-3 rounded-3xl border border-app-border-accent bg-app-surface-1 px-4 py-3 text-sm"
            >
              <span className="text-app-text">{formatEducation(item)}</span>
              <button
                type="button"
                aria-label="Удалить образование"
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

      <EducationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  )
}
