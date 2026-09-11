'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput } from '@/components/custom-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResumeCourseItem } from '@/types/vacancyApplications'
import type { ResumeFormState } from './form-state'
import { SearchableMultiSelect } from './SearchableMultiSelect'
import {
  DRIVER_LICENSE_OPTIONS,
  LANGUAGE_OPTIONS,
  OTHER_SKILL_OPTIONS,
  PC_SKILL_OPTIONS,
} from './resume-options'
import { RESUME_FIELD_TRIGGER_CLASS } from './field-styles'

type StepSkillsProps = {
  form: ResumeFormState
  onChange: (patch: Partial<ResumeFormState>) => void
  disabled?: boolean
}

export const StepSkills = ({ form, onChange, disabled }: StepSkillsProps) => {
  const [courseDraft, setCourseDraft] = useState('')

  const handleAddCourse = () => {
    const title = courseDraft.trim()
    if (!title) return
    onChange({ courses: [...form.courses, { title }] })
    setCourseDraft('')
  }

  const handleRemoveCourse = (index: number) => {
    onChange({ courses: form.courses.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-5 rounded-3xl border border-dashed border-app-border-accent p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Навыки работы с программами на ПК:</Label>
          <SearchableMultiSelect
            value={form.pcSkills}
            onChange={(pcSkills) => onChange({ pcSkills })}
            options={PC_SKILL_OPTIONS}
            placeholder="Выберите навыки"
            disabled={disabled}
            ariaLabel="Навыки ПК"
          />
        </div>
        <div className="space-y-2">
          <Label>Еще какие навыки у вас есть?</Label>
          <SearchableMultiSelect
            value={form.otherSkills}
            onChange={(otherSkills) => onChange({ otherSkills })}
            options={OTHER_SKILL_OPTIONS}
            placeholder="Выберите навыки"
            disabled={disabled}
            ariaLabel="Другие навыки"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Знание языков:</Label>
          <SearchableMultiSelect
            value={form.languages}
            onChange={(languages) => onChange({ languages })}
            options={LANGUAGE_OPTIONS}
            placeholder="Выберите языки"
            disabled={disabled}
            ariaLabel="Языки"
          />
        </div>
        <div className="space-y-2">
          <Label>Категория водительских прав:</Label>
          <Select
            value={form.driverLicenseCategory || undefined}
            onValueChange={(value) => onChange({ driverLicenseCategory: value })}
            disabled={disabled}
          >
            <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {DRIVER_LICENSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-model">Модель автомобиля:</Label>
          <DarkInput
            id="car-model"
            value={form.carModel}
            disabled={disabled}
            onChange={(event) => onChange({ carModel: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course-draft">Курсы, которые вы проходили:</Label>
        {form.courses.length === 0 && !courseDraft ? (
          <DarkInput value="Нет информации" readOnly disabled />
        ) : null}
        {form.courses.length > 0 ? (
          <ul className="space-y-2">
            {form.courses.map((course: ResumeCourseItem, index) => (
              <li
                key={`${course.title}-${index}`}
                className="flex items-center justify-between gap-2 rounded-3xl border border-app-border-accent bg-app-surface-1 px-4 py-3 text-sm"
              >
                <span>{course.title}</span>
                <button
                  type="button"
                  aria-label="Удалить курс"
                  disabled={disabled}
                  onClick={() => handleRemoveCourse(index)}
                  className="text-app-text-muted hover:text-brand-accent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <DarkInput
          id="course-draft"
          value={courseDraft}
          disabled={disabled}
          placeholder="Название курса"
          onChange={(event) => setCourseDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAddCourse()
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !courseDraft.trim()}
            onClick={handleAddCourse}
            className="h-9 gap-1 rounded-full border-brand-accent/50 bg-app-surface-1 text-brand-accent hover:bg-brand-accent/10"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  )
}
