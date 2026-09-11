'use client'

import type { ChangeEvent } from 'react'
import { Label } from '@/components/ui/label'
import { DarkInput, DarkSearchableSelect } from '@/components/custom-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'
import type { ResumeFormState } from './form-state'
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MILITARY_ID_OPTIONS,
} from './resume-options'
import { RESUME_FIELD_TRIGGER_CLASS } from './field-styles'

type StepPersonalInfoProps = {
  form: ResumeFormState
  onChange: (patch: Partial<ResumeFormState>) => void
  vacancyOptions: { value: string; label: string }[]
  vacancySearch: string
  onVacancySearchChange: (value: string) => void
  isVacanciesLoading: boolean
  statuses: VacancyApplicationStatusItem[]
  disabled?: boolean
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearPhoto: () => void
  isReadingPhoto?: boolean
}

export const StepPersonalInfo = ({
  form,
  onChange,
  vacancyOptions,
  vacancySearch,
  onVacancySearchChange,
  isVacanciesLoading,
  statuses,
  disabled,
  onPhotoChange,
  onClearPhoto,
  isReadingPhoto,
}: StepPersonalInfoProps) => {
  const statusOptions = statuses
    .filter((s) => s.is_active)
    .sort((a, b) => a.column_sort_order - b.column_sort_order)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-app-text">
            Вакансия <span className="text-brand-accent">*</span>
          </Label>
          <DarkSearchableSelect
            value={form.vacancyId}
            onChange={(value) => onChange({ vacancyId: value })}
            options={vacancyOptions}
            searchValue={vacancySearch}
            onSearchChange={onVacancySearchChange}
            isLoading={isVacanciesLoading}
            minSearchLength={0}
            placeholder="Выберите вакансию"
            searchPlaceholder="Поиск по названию вакансии"
            emptyHint="Вакансии не найдены"
            disabled={disabled}
            clearable
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-app-text">
            Статус <span className="text-brand-accent">*</span>
          </Label>
          <Select
            value={form.statusCode}
            onValueChange={(value) => onChange({ statusCode: value })}
            disabled={disabled}
          >
            <SelectTrigger
              className={RESUME_FIELD_TRIGGER_CLASS}
              aria-label="Статус отклика"
            >
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.code} value={status.code}>
                  {status.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-3">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-app-border-accent bg-app-surface-1">
            {form.photoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.photoPreviewUrl}
                alt="Фото кандидата"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-app-text-muted">Фото</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-accent-on-alt shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.15)] hover:bg-brand">
              {isReadingPhoto ? 'Чтение...' : 'Загрузить фото'}
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={disabled || isReadingPhoto}
                onChange={onPhotoChange}
                aria-label="Загрузить фото"
              />
            </label>
            {form.photoFilename ? (
              <button
                type="button"
                onClick={onClearPhoto}
                disabled={disabled}
                className="rounded-full border border-app-border-accent px-3 py-2 text-sm text-app-text-muted hover:bg-app-surface-2 hover:text-app-text"
              >
                Удалить
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="resume-last-name" className="text-sm font-medium text-app-text">
              Фамилия <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              id="resume-last-name"
              value={form.lastName}
              disabled={disabled}
              onChange={(event) => onChange({ lastName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-first-name" className="text-sm font-medium text-app-text">
              Имя <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              id="resume-first-name"
              value={form.firstName}
              disabled={disabled}
              onChange={(event) => onChange({ firstName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-middle-name" className="text-sm font-medium text-app-text">
              Отчество
            </Label>
            <DarkInput
              id="resume-middle-name"
              value={form.middleName}
              disabled={disabled}
              onChange={(event) => onChange({ middleName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-birth-date" className="text-sm font-medium text-app-text">
              Дата рождения
            </Label>
            <DarkInput
              id="resume-birth-date"
              type="date"
              value={form.birthDate}
              disabled={disabled}
              onChange={(event) => onChange({ birthDate: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-app-text">Пол</Label>
            <Select
              value={form.gender || undefined}
              onValueChange={(value) => onChange({ gender: value })}
              disabled={disabled}
            >
              <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-phone" className="text-sm font-medium text-app-text">
              Телефон
            </Label>
            <DarkInput
              id="resume-phone"
              value={form.phone}
              disabled={disabled}
              onChange={(event) => onChange({ phone: event.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="resume-email" className="text-sm font-medium text-app-text">
              E-mail <span className="text-brand-accent">*</span>
            </Label>
            <DarkInput
              id="resume-email"
              type="email"
              value={form.email}
              disabled={disabled}
              onChange={(event) => onChange({ email: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="resume-address" className="text-sm font-medium text-app-text">
            Адрес
          </Label>
          <DarkInput
            id="resume-address"
            value={form.address}
            disabled={disabled}
            onChange={(event) => onChange({ address: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-app-text">Семейное положение</Label>
          <Select
            value={form.maritalStatus || undefined}
            onValueChange={(value) => onChange({ maritalStatus: value })}
            disabled={disabled}
          >
            <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-children" className="text-sm font-medium text-app-text">
            Сколько у вас детей?
          </Label>
          <DarkInput
            id="resume-children"
            inputMode="numeric"
            value={form.childrenCount}
            disabled={disabled}
            onChange={(event) =>
              onChange({ childrenCount: event.target.value.replace(/\D/g, '').slice(0, 2) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-app-text">Наличие воен. билета</Label>
          <Select
            value={form.hasMilitaryId || undefined}
            onValueChange={(value) => onChange({ hasMilitaryId: value })}
            disabled={disabled}
          >
            <SelectTrigger className={RESUME_FIELD_TRIGGER_CLASS}>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {MILITARY_ID_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
