import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck, ExternalLink, Mail, Phone } from 'lucide-react'
import { DarkTextarea } from '@/components/custom-ui/dark-textarea'
import { Modal, ModalActions, ModalHeader } from '@/components/custom-ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getStatusLabel } from '@/lib/vacancy-application-status'
import type { VacancyApplicationStatusItem } from '@/types/vacancyApplicationBoard'
import {
  VACANCY_APPLICATION_STATUS_LABELS,
  type VacancyApplication,
  type VacancyApplicationResumeData,
} from '@/types/vacancyApplications'

interface VacancyApplicationStatusModalProps {
  open: boolean
  application: VacancyApplication | null
  statuses?: VacancyApplicationStatusItem[]
  isPending: boolean
  onClose: () => void
  onSubmit: (payload: { status: string; hr_comment: string }) => void
}

function getApplicantName(application: VacancyApplication | null) {
  if (!application) return ''
  return [application.last_name, application.first_name, application.middle_name]
    .filter(Boolean)
    .join(' ')
}

const hasResumeContent = (data?: VacancyApplicationResumeData | null) => {
  if (!data) return false
  return Boolean(
    (data.educations && data.educations.length > 0) ||
      (data.pc_skills && data.pc_skills.length > 0) ||
      (data.other_skills && data.other_skills.length > 0) ||
      (data.languages && data.languages.length > 0) ||
      data.driver_license_category ||
      data.car_model ||
      (data.courses && data.courses.length > 0) ||
      (data.work_experiences && data.work_experiences.length > 0) ||
      data.about ||
      data.criminal_record ||
      data.hobbies ||
      data.probation_agreed ||
      data.salary_expectation ||
      (data.recommendations && data.recommendations.length > 0)
  )
}

export function VacancyApplicationStatusModal({
  open,
  application,
  statuses = [],
  isPending,
  onClose,
  onSubmit,
}: VacancyApplicationStatusModalProps) {
  const [status, setStatus] = useState('new')
  const [comment, setComment] = useState('')

  const statusOptions = useMemo(() => {
    if (statuses.length > 0) {
      return statuses
        .filter((s) => s.is_active)
        .sort((a, b) => a.column_sort_order - b.column_sort_order)
        .map((s) => ({ value: s.code, label: s.title }))
    }
    return Object.entries(VACANCY_APPLICATION_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    }))
  }, [statuses])

  useEffect(() => {
    if (!application || !open) return
    setStatus(application.status)
    setComment(application.hr_comment ?? '')
  }, [application, open])

  const handleSubmit = () => {
    if (isPending) return
    onSubmit({
      status,
      hr_comment: comment.trim(),
    })
  }

  const currentStatusLabel = getStatusLabel(
    application?.status ?? status,
    statuses
  )

  const resume = application?.resume_data

  return (
    <Modal open={open} onClose={onClose} panelClassName="select-text max-h-[90vh] overflow-y-auto">
      <ModalHeader
        icon={ClipboardCheck}
        title="Отклик кандидата"
        subtitle={application ? getApplicantName(application) : undefined}
        onClose={onClose}
      />

      <div className="space-y-4">
        {application ? (
          <div className="rounded-2xl border border-app-border-accent bg-app-surface-1 p-4 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs text-app-text-muted">
              <span className="rounded-full bg-app-surface-1 px-2 py-1 font-bold uppercase tracking-wide">
                {currentStatusLabel}
              </span>
              {application.vacancy_title ? (
                <span className="px-2 py-1">{application.vacancy_title}</span>
              ) : null}
            </div>

            {application.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={application.photo_url}
                alt="Фото кандидата"
                className="h-24 w-24 rounded-xl object-cover border border-app-border-accent"
              />
            ) : null}

            <div className="grid gap-2 text-sm">
              {application.email ? (
                <p className="flex items-center gap-2 text-app-text-muted">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${application.email}`} className="text-app-text hover:underline">
                    {application.email}
                  </a>
                </p>
              ) : null}
              {application.phone ? (
                <p className="flex items-center gap-2 text-app-text-muted">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${application.phone}`} className="text-app-text hover:underline">
                    {application.phone}
                  </a>
                </p>
              ) : null}
              {application.telegram ? (
                <p className="text-app-text-muted">
                  Telegram: <span className="text-app-text">{application.telegram}</span>
                </p>
              ) : null}
              {application.city ? (
                <p className="text-app-text-muted">
                  Город: <span className="text-app-text">{application.city}</span>
                </p>
              ) : null}
              {application.birth_date ? (
                <p className="text-app-text-muted">
                  Дата рождения: <span className="text-app-text">{application.birth_date}</span>
                </p>
              ) : null}
              {application.gender ? (
                <p className="text-app-text-muted">
                  Пол: <span className="text-app-text">{application.gender}</span>
                </p>
              ) : null}
              {application.address ? (
                <p className="text-app-text-muted">
                  Адрес: <span className="text-app-text">{application.address}</span>
                </p>
              ) : null}
              {application.marital_status ? (
                <p className="text-app-text-muted">
                  Семейное положение:{' '}
                  <span className="text-app-text">{application.marital_status}</span>
                </p>
              ) : null}
              {application.children_count != null ? (
                <p className="text-app-text-muted">
                  Детей: <span className="text-app-text">{application.children_count}</span>
                </p>
              ) : null}
              {application.has_military_id != null ? (
                <p className="text-app-text-muted">
                  Военный билет:{' '}
                  <span className="text-app-text">
                    {application.has_military_id ? 'Есть' : 'Нет'}
                  </span>
                </p>
              ) : null}
            </div>

            {application.cover_letter ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted mb-1">
                  Сопроводительное письмо
                </p>
                <p className="text-sm text-app-text whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
            ) : null}

            {hasResumeContent(resume) ? (
              <div className="space-y-3 border-t border-app-border-accent pt-3">
                <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
                  Резюме
                </p>
                {resume?.educations && resume.educations.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold text-app-text-muted mb-1">Образование</p>
                    <ul className="space-y-1 text-sm text-app-text">
                      {resume.educations.map((item, index) => (
                        <li key={index}>
                          {[
                            item.education_type,
                            item.institution,
                            item.specialty,
                            [item.start_year, item.end_year].filter(Boolean).join('–'),
                            item.city,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {(resume?.pc_skills?.length ||
                  resume?.other_skills?.length ||
                  resume?.languages?.length) ? (
                  <div className="text-sm text-app-text space-y-1">
                    {resume.pc_skills?.length ? (
                      <p>ПК: {resume.pc_skills.join(', ')}</p>
                    ) : null}
                    {resume.other_skills?.length ? (
                      <p>Навыки: {resume.other_skills.join(', ')}</p>
                    ) : null}
                    {resume.languages?.length ? (
                      <p>Языки: {resume.languages.join(', ')}</p>
                    ) : null}
                    {resume.driver_license_category ? (
                      <p>Права: {resume.driver_license_category}</p>
                    ) : null}
                    {resume.car_model ? <p>Авто: {resume.car_model}</p> : null}
                  </div>
                ) : null}
                {resume?.courses && resume.courses.length > 0 ? (
                  <p className="text-sm text-app-text">
                    Курсы: {resume.courses.map((c) => c.title).filter(Boolean).join('; ')}
                  </p>
                ) : null}
                {resume?.work_experiences && resume.work_experiences.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold text-app-text-muted mb-1">Опыт работы</p>
                    <ul className="space-y-2 text-sm text-app-text">
                      {resume.work_experiences.map((item, index) => (
                        <li key={index}>
                          <p>
                            {[
                              item.position,
                              item.employer,
                              item.city,
                              item.is_current
                                ? `${item.start_year ?? ''}–н.в.`
                                : [item.start_year, item.end_year].filter(Boolean).join('–'),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          {item.description ? (
                            <p className="text-app-text-muted whitespace-pre-wrap">{item.description}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {resume?.about ? (
                  <p className="text-sm text-app-text whitespace-pre-wrap">О себе: {resume.about}</p>
                ) : null}
                {resume?.salary_expectation ? (
                  <p className="text-sm text-app-text">ЗП: {resume.salary_expectation}</p>
                ) : null}
                {resume?.recommendations && resume.recommendations.length > 0 ? (
                  <p className="text-sm text-app-text">
                    Рекомендации: {resume.recommendations.join('; ')}
                  </p>
                ) : null}
              </div>
            ) : null}

            {application.resume_url ? (
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-accent hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Открыть резюме
              </a>
            ) : null}
          </div>
        ) : null}

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted mb-2">Статус</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full h-12 border border-app-border-accent rounded-full px-4 bg-app-surface-1 text-app-text-muted hover:text-app-text hover:bg-app-surface-2 transition-all duration-200 focus:ring-1 focus:ring-brand-accent/30 [&_svg]:text-app-text-muted">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted mb-2">Комментарий HR</p>
          <DarkTextarea
            placeholder="Добавьте комментарий для HR"
            value={comment}
            rows={5}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
      </div>

      <ModalActions
        onCancel={onClose}
        onConfirm={handleSubmit}
        confirmLabel={isPending ? 'Сохранение...' : 'Сохранить'}
      />
    </Modal>
  )
}
