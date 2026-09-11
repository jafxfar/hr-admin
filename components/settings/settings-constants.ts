import type { SettingsFeatures } from '@/api/settings'

export type FeatureSwitchConfig = {
  key: keyof SettingsFeatures
  label: string
  description: string
  enabledDescription: string
  disabledDescription: string
}

export const FEATURE_SWITCHES: FeatureSwitchConfig[] = [
  {
    key: 'branches_enabled',
    label: 'Филиалы',
    description: 'Пункт «Филиалы» в меню и страница управления филиалами',
    enabledDescription: 'Филиалы включены',
    disabledDescription: 'Филиалы скрыты',
  },
  {
    key: 'vacancies_enabled',
    label: 'Вакансии',
    description: 'Раздел «Вакансии» в меню, категории вакансий и связанные страницы',
    enabledDescription: 'Вакансии включены',
    disabledDescription: 'Вакансии скрыты',
  },
  {
    key: 'vacancy_applications_enabled',
    label: 'Отклики',
    description: 'Раздел «Отклики» в меню и связанные страницы',
    enabledDescription: 'Отклики включены',
    disabledDescription: 'Отклики скрыты',
  },
  {
    key: 'timesheets_enabled',
    label: 'Табель',
    description: 'Раздел «Табель» в меню и связанные страницы',
    enabledDescription: 'Табель включён',
    disabledDescription: 'Табель скрыт',
  },
  {
    key: 'kpi_enabled',
    label: 'KPI',
    description: 'Раздел «KPI» в меню и связанные страницы',
    enabledDescription: 'KPI включён',
    disabledDescription: 'KPI скрыт',
  },
  {
    key: 'news_enabled',
    label: 'Новости',
    description: 'Раздел «Новости» в меню и связанные страницы',
    enabledDescription: 'Новости включены',
    disabledDescription: 'Новости скрыты',
  },
  {
    key: 'ideas_enabled',
    label: 'Идеи',
    description: 'Раздел «Идеи» в меню и связанные страницы',
    enabledDescription: 'Идеи включены',
    disabledDescription: 'Идеи скрыты',
  },
  {
    key: 'lms_enabled',
    label: 'Обучение',
    description: 'Раздел «Обучение» в меню: отчёт, курсы, категории и учащиеся',
    enabledDescription: 'Обучение включено',
    disabledDescription: 'Обучение скрыто',
  },
  {
    key: 'tasks_enabled',
    label: 'Задачи',
    description: 'Раздел «Задачи» в меню и Kanban-доска задач',
    enabledDescription: 'Задачи включены',
    disabledDescription: 'Задачи скрыты',
  },
]

export type PaletteMode = 'light' | 'dark'

export const toRgbChannels = (hexColor: string) =>
  hexColor
    .replace('#', '')
    .match(/.{1,2}/g)
    ?.map((chunk) => Number.parseInt(chunk, 16))
    .join(' ') ?? '0 0 0'

export const FULL_HEX = /^#[0-9A-F]{6}$/i

export const sanitizeHexTyping = (raw: string) => {
  const upper = raw.trim().toUpperCase()
  let body = upper.startsWith('#') ? upper.slice(1) : upper
  body = body.replace(/[^0-9A-F]/g, '').slice(0, 6)
  return body.length ? `#${body}` : '#'
}

export const colorInputFallback = (hex: string, fallback: string) =>
  FULL_HEX.test(hex) ? hex : fallback
