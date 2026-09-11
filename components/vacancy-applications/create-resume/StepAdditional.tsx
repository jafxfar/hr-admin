'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkTextarea } from '@/components/custom-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResumeFormState } from './form-state'
import { PROBATION_OPTIONS } from './resume-options'
import { RESUME_FIELD_TRIGGER_CLASS } from './field-styles'

type StepAdditionalProps = {
  form: ResumeFormState
  onChange: (patch: Partial<ResumeFormState>) => void
  disabled?: boolean
}

export const StepAdditional = ({ form, onChange, disabled }: StepAdditionalProps) => {
  const [recommendationDraft, setRecommendationDraft] = useState('')

  const handleAddRecommendation = () => {
    const value = recommendationDraft.trim()
    if (!value) return
    onChange({ recommendations: [...form.recommendations, value] })
    setRecommendationDraft('')
  }

  const handleRemoveRecommendation = (index: number) => {
    onChange({ recommendations: form.recommendations.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-5 rounded-3xl border border-dashed border-app-border-accent p-5">
      <div className="space-y-2">
        <Label>Расскажите о себе:</Label>
        <DarkTextarea
          rows={4}
          value={form.about}
          onChange={(event) => onChange({ about: event.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="resume-criminal">
            Имеете ли вы судимость. Если да, то по какой статье?:
          </Label>
          <DarkInput
            id="resume-criminal"
            value={form.criminalRecord}
            disabled={disabled}
            onChange={(event) => onChange({ criminalRecord: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-hobbies">Хобби:</Label>
          <DarkInput
            id="resume-hobbies"
            value={form.hobbies}
            disabled={disabled}
            onChange={(event) => onChange({ hobbies: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Согласны ли вы на испытательный срок?</Label>
          <Select
            value={form.probationAgreed || undefined}
            onValueChange={(value) => onChange({ probationAgreed: value })}
            disabled={disabled}
          >
            <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {PROBATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-salary">Вилка ожидаемой заработной платы?</Label>
          <DarkInput
            id="resume-salary"
            value={form.salaryExpectation}
            disabled={disabled}
            onChange={(event) => onChange({ salaryExpectation: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recommendation-draft">
          Для получения рекомендаций укажите бывших коллег и руководителей:
        </Label>
        {form.recommendations.length === 0 && !recommendationDraft ? (
          <DarkInput value="Нет информации" readOnly disabled />
        ) : null}
        {form.recommendations.length > 0 ? (
          <ul className="space-y-2">
            {form.recommendations.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-center justify-between gap-2 rounded-3xl border border-app-border-accent bg-app-surface-1 px-4 py-3 text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  aria-label="Удалить рекомендацию"
                  disabled={disabled}
                  onClick={() => handleRemoveRecommendation(index)}
                  className="text-app-text-muted hover:text-brand-accent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <DarkInput
          id="recommendation-draft"
          value={recommendationDraft}
          disabled={disabled}
          placeholder="ФИО / контакты"
          onChange={(event) => setRecommendationDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAddRecommendation()
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !recommendationDraft.trim()}
            onClick={handleAddRecommendation}
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
