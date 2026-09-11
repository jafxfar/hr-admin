import type { ResumeFormState } from './form-state'
import {
  EDUCATION_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MILITARY_ID_OPTIONS,
  PROBATION_OPTIONS,
} from './resume-options'

const labelOf = (
  options: { value: string; label: string }[],
  value: string
) => options.find((option) => option.value === value)?.label ?? value

export const downloadResumeText = (form: ResumeFormState) => {
  const lines: string[] = [
    'МОЁ РЕЗЮМЕ',
    '',
    '— Личная информация —',
    `ФИО: ${[form.lastName, form.firstName, form.middleName].filter(Boolean).join(' ')}`,
    `Дата рождения: ${form.birthDate || '—'}`,
    `Пол: ${labelOf(GENDER_OPTIONS, form.gender) || '—'}`,
    `Телефон: ${form.phone || '—'}`,
    `E-mail: ${form.email || '—'}`,
    `Адрес: ${form.address || '—'}`,
    `Семейное положение: ${labelOf(MARITAL_STATUS_OPTIONS, form.maritalStatus) || '—'}`,
    `Детей: ${form.childrenCount || '—'}`,
    `Военный билет: ${labelOf(MILITARY_ID_OPTIONS, form.hasMilitaryId) || '—'}`,
    '',
    '— Образование —',
  ]

  if (form.educations.length === 0) {
    lines.push('Нет информации')
  } else {
    form.educations.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${[
          labelOf(EDUCATION_TYPE_OPTIONS, item.education_type ?? ''),
          item.institution,
          item.specialty,
          [item.start_year, item.end_year].filter(Boolean).join('–'),
          item.city,
        ]
          .filter(Boolean)
          .join(' · ')}`
      )
    })
  }

  lines.push('', '— Курсы и навыки —')
  lines.push(`ПК: ${form.pcSkills.join(', ') || '—'}`)
  lines.push(`Другие навыки: ${form.otherSkills.join(', ') || '—'}`)
  lines.push(`Языки: ${form.languages.join(', ') || '—'}`)
  lines.push(`Водительские права: ${form.driverLicenseCategory || '—'}`)
  lines.push(`Автомобиль: ${form.carModel || '—'}`)
  lines.push(
    `Курсы: ${form.courses.map((c) => c.title).filter(Boolean).join('; ') || '—'}`
  )

  lines.push('', '— Опыт работы —')
  if (form.workExperiences.length === 0) {
    lines.push('Нет информации')
  } else {
    form.workExperiences.forEach((item, index) => {
      const years = item.is_current
        ? `${item.start_year ?? ''}–н.в.`
        : [item.start_year, item.end_year].filter(Boolean).join('–')
      lines.push(
        `${index + 1}. ${[item.position, item.employer, item.city, years].filter(Boolean).join(' · ')}`
      )
      if (item.description) lines.push(`   ${item.description}`)
    })
  }

  lines.push('', '— Доп. информация —')
  lines.push(`О себе: ${form.about || '—'}`)
  lines.push(`Судимость: ${form.criminalRecord || '—'}`)
  lines.push(`Хобби: ${form.hobbies || '—'}`)
  lines.push(
    `Испытательный срок: ${labelOf(PROBATION_OPTIONS, form.probationAgreed) || '—'}`
  )
  lines.push(`Ожидаемая ЗП: ${form.salaryExpectation || '—'}`)
  lines.push(`Рекомендации: ${form.recommendations.join('; ') || '—'}`)

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const name = [form.lastName, form.firstName].filter(Boolean).join('_') || 'resume'
  link.href = url
  link.download = `${name}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
