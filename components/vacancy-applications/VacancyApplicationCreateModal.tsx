'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVacancy4Admin } from '@/hooks/use-vacancy'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'
import type { CreateVacancyApplicationDTO } from '@/types/vacancyApplications'
import { useToast } from '@/hooks/use-toast'
import { isValidEmail } from '@/lib/email'
import { createEmptyResumeForm, type ResumeFormState } from './create-resume/form-state'
import { ResumeStepper } from './create-resume/ResumeStepper'
import { StepPersonalInfo } from './create-resume/StepPersonalInfo'
import { StepEducation } from './create-resume/StepEducation'
import { StepSkills } from './create-resume/StepSkills'
import { StepExperience } from './create-resume/StepExperience'
import { StepAdditional } from './create-resume/StepAdditional'
import { downloadResumeText } from './create-resume/download-resume'
import { RESUME_STEPS } from './create-resume/resume-options'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

type VacancyApplicationCreateModalProps = {
  open: boolean
  isPending: boolean
  defaultVacancyId?: number
  defaultStatusCode?: string
  statuses?: VacancyApplicationStatusItem[]
  onClose: () => void
  onSubmit: (payload: { vacancyId: number; data: CreateVacancyApplicationDTO }) => void
}

const emptyToNull = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const getPhotoExtension = (filename: string) => {
  const normalized = filename.toLowerCase()
  return ALLOWED_PHOTO_EXTENSIONS.find((extension) => normalized.endsWith(extension))
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })

export function VacancyApplicationCreateModal({
  open,
  isPending,
  defaultVacancyId,
  defaultStatusCode,
  statuses = [],
  onClose,
  onSubmit,
}: VacancyApplicationCreateModalProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<ResumeFormState>(createEmptyResumeForm)
  const [vacancySearch, setVacancySearch] = useState('')
  const [isReadingPhoto, setIsReadingPhoto] = useState(false)
  const { toast } = useToast()

  const { data: vacanciesData, isLoading: isVacanciesLoading } = useVacancy4Admin(1, 50, vacancySearch)
  const vacancies = vacanciesData?.items ?? []

  const vacancyOptions = useMemo(
    () =>
      vacancies.map((vacancy) => ({
        value: String(vacancy.id),
        label: vacancy.title,
      })),
    [vacancies]
  )

  const statusOptions = useMemo(
    () =>
      statuses
        .filter((s) => s.is_active)
        .sort((a, b) => a.column_sort_order - b.column_sort_order),
    [statuses]
  )

  const handleFormChange = (patch: Partial<ResumeFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  useEffect(() => {
    if (open && defaultVacancyId) {
      setForm((prev) => ({ ...prev, vacancyId: String(defaultVacancyId) }))
    }
  }, [open, defaultVacancyId])

  useEffect(() => {
    if (!open) return
    if (defaultStatusCode && statusOptions.some((s) => s.code === defaultStatusCode)) {
      setForm((prev) => ({ ...prev, statusCode: defaultStatusCode }))
      return
    }
    const defaultStatus = statusOptions.find((s) => s.is_default)
    setForm((prev) => ({
      ...prev,
      statusCode: defaultStatus?.code ?? statusOptions[0]?.code ?? '',
    }))
  }, [open, defaultStatusCode, statusOptions])

  useEffect(() => {
    if (!open) {
      setStep(1)
      setForm(createEmptyResumeForm())
      setVacancySearch('')
      setIsReadingPhoto(false)
    }
  }, [open])

  const getValidationErrors = () => {
    const errors: string[] = []
    if (!form.vacancyId) errors.push('Выберите вакансию')
    if (!form.statusCode) errors.push('Выберите статус')
    if (!form.lastName.trim()) errors.push('Фамилия обязательна')
    if (!form.firstName.trim()) errors.push('Имя обязательно')
    if (!form.email.trim()) errors.push('Email обязателен')
    if (form.email.trim() && !isValidEmail(form.email)) errors.push('Введите корректный email')
    return errors
  }

  const handleClose = () => {
    if (isPending || isReadingPhoto) return
    onClose()
  }

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    handleFormChange({ photoBase64: null, photoFilename: null, photoPreviewUrl: null })

    if (!file) return

    if (!getPhotoExtension(file.name)) {
      const message = 'Фото должно быть в формате JPG, PNG или WEBP'
      toast({ variant: 'destructive', title: 'Ошибка', description: message })
      event.target.value = ''
      return
    }

    if (file.size > MAX_PHOTO_BYTES) {
      const message = 'Размер фото не должен превышать 5 MB'
      toast({ variant: 'destructive', title: 'Ошибка', description: message })
      event.target.value = ''
      return
    }

    try {
      setIsReadingPhoto(true)
      const fileDataUrl = await readFileAsDataUrl(file)
      handleFormChange({
        photoBase64: fileDataUrl,
        photoFilename: file.name,
        photoPreviewUrl: fileDataUrl,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось прочитать фото'
      toast({ variant: 'destructive', title: 'Ошибка', description: message })
      event.target.value = ''
    } finally {
      setIsReadingPhoto(false)
    }
  }

  const handleClearPhoto = () => {
    handleFormChange({ photoBase64: null, photoFilename: null, photoPreviewUrl: null })
  }

  const handleNext = () => {
    if (step === 1) {
      const validationErrors = getValidationErrors()
      if (validationErrors.length > 0) {
        const description = validationErrors.join(' • ')
        toast({ variant: 'destructive', title: 'Проверьте форму', description })
        return
      }
    }
    setStep((prev) => Math.min(prev + 1, RESUME_STEPS.length))
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleDownload = () => {
    downloadResumeText(form)
  }

  const handleSubmit = () => {
    const validationErrors = getValidationErrors()
    if (validationErrors.length > 0) {
      const description = validationErrors.join(' • ')
      setStep(1)
      toast({ variant: 'destructive', title: 'Проверьте форму', description })
      return
    }

    const childrenCount = form.childrenCount.trim()
      ? Number(form.childrenCount)
      : null

    const data: CreateVacancyApplicationDTO = {
      last_name: form.lastName.trim(),
      first_name: form.firstName.trim(),
      middle_name: emptyToNull(form.middleName),
      email: form.email.trim(),
      phone: emptyToNull(form.phone),
      telegram: emptyToNull(form.telegram),
      city: emptyToNull(form.city),
      birth_date: emptyToNull(form.birthDate),
      gender: emptyToNull(form.gender),
      address: emptyToNull(form.address),
      marital_status: emptyToNull(form.maritalStatus),
      children_count: Number.isFinite(childrenCount as number) ? childrenCount : null,
      has_military_id:
        form.hasMilitaryId === 'yes' ? true : form.hasMilitaryId === 'no' ? false : null,
      photo_base64: form.photoBase64,
      photo_filename: form.photoFilename,
      status_code: form.statusCode,
      resume_data: {
        educations: form.educations,
        pc_skills: form.pcSkills,
        other_skills: form.otherSkills,
        languages: form.languages,
        driver_license_category: emptyToNull(form.driverLicenseCategory),
        car_model: emptyToNull(form.carModel),
        courses: form.courses,
        work_experiences: form.workExperiences,
        about: emptyToNull(form.about),
        criminal_record: emptyToNull(form.criminalRecord),
        hobbies: emptyToNull(form.hobbies),
        probation_agreed: emptyToNull(form.probationAgreed),
        salary_expectation: emptyToNull(form.salaryExpectation),
        recommendations: form.recommendations,
      },
    }

    onSubmit({
      vacancyId: Number(form.vacancyId),
      data,
    })
  }

  const isBusy = isPending || isReadingPhoto

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose()
      }}
    >
      <DialogContent
        showCloseButton
        className="select-text flex h-[100dvh] w-[100vw] max-w-none translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:max-w-none"
      >
        <DialogHeader className="shrink-0 border-b border-app-border-accent px-6 py-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-app-text">
            Моё резюме
          </DialogTitle>
        </DialogHeader>

        <div className="shrink-0 border-b border-app-border-accent px-6 py-4">
          <ResumeStepper currentStep={step} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <StepPersonalInfo
              form={form}
              onChange={handleFormChange}
              vacancyOptions={vacancyOptions}
              vacancySearch={vacancySearch}
              onVacancySearchChange={setVacancySearch}
              isVacanciesLoading={isVacanciesLoading}
              statuses={statuses}
              disabled={isBusy}
              onPhotoChange={handlePhotoChange}
              onClearPhoto={handleClearPhoto}
              isReadingPhoto={isReadingPhoto}
            />
          ) : null}
          {step === 2 ? (
            <StepEducation
              educations={form.educations}
              onChange={(educations) => handleFormChange({ educations })}
              disabled={isBusy}
            />
          ) : null}
          {step === 3 ? (
            <StepSkills form={form} onChange={handleFormChange} disabled={isBusy} />
          ) : null}
          {step === 4 ? (
            <StepExperience
              experiences={form.workExperiences}
              onChange={(workExperiences) => handleFormChange({ workExperiences })}
              disabled={isBusy}
            />
          ) : null}
          {step === 5 ? (
            <StepAdditional form={form} onChange={handleFormChange} disabled={isBusy} />
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-app-border-accent px-6 py-4">
          <div>
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={handlePrev}
                className="h-10 rounded-full border-app-border-accent bg-app-surface-1 px-5 text-sm text-app-text hover:bg-app-surface-2"
              >
                &lt; Предыдущий
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {step === RESUME_STEPS.length ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={handleDownload}
                  className="h-10 gap-2 rounded-full border-app-border-accent bg-app-surface-1 px-5 text-sm text-app-text hover:bg-app-surface-2"
                >
                  <Download className="h-4 w-4" />
                  Скачать
                </Button>
                <Button
                  type="button"
                  disabled={isBusy}
                  onClick={handleSubmit}
                  className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.15)] hover:bg-brand disabled:opacity-40"
                >
                  {isPending ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                disabled={isBusy}
                onClick={handleNext}
                className="h-10 rounded-full bg-brand-accent px-6 text-sm font-bold text-brand-accent-on-alt shadow-[0_0_20px_rgb(var(--theme-primary-rgb)/0.15)] hover:bg-brand disabled:opacity-40"
              >
                Следующий &gt;
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
