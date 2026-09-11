export const RESUME_STEPS = [
  { id: 1, label: 'Личная информация' },
  { id: 2, label: 'Образование' },
  { id: 3, label: 'Курсы и навыки' },
  { id: 4, label: 'Опыт работы' },
  { id: 5, label: 'Доп. информация' },
] as const

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Муж.' },
  { value: 'female', label: 'Жен.' },
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Холост / Не замужем' },
  { value: 'married', label: 'Женат / Замужем' },
  { value: 'divorced', label: 'Разведён(а)' },
  { value: 'widowed', label: 'Вдовец / Вдова' },
]

export const MILITARY_ID_OPTIONS = [
  { value: 'yes', label: 'Есть' },
  { value: 'no', label: 'Нет' },
]

export const EDUCATION_TYPE_OPTIONS = [
  { value: 'secondary', label: 'Среднее' },
  { value: 'vocational', label: 'Среднее специальное' },
  { value: 'bachelor', label: 'Бакалавриат' },
  { value: 'master', label: 'Магистратура' },
  { value: 'specialist', label: 'Специалитет' },
  { value: 'phd', label: 'Аспирантура / PhD' },
]

export const PC_SKILL_OPTIONS = [
  'MS Office',
  'Excel',
  '1C',
  'Photoshop',
  'AutoCAD',
  'SAP',
  'CRM',
  'PowerPoint',
  'Word',
]

export const OTHER_SKILL_OPTIONS = [
  'Гибкость',
  'Коммуникабельность',
  'Способность к развитию',
  'Усидчивость',
  'Знание юридических документов',
  'Опыт руководства производством',
  'Стрессоустойчивость',
  'Работа в команде',
  'Лидерство',
]

export const LANGUAGE_OPTIONS = [
  'Русский',
  'Таджикский',
  'Английский',
  'Узбекский',
  'Немецкий',
  'Китайский',
]

export const DRIVER_LICENSE_OPTIONS = [
  { value: 'none', label: 'Нет' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'BE', label: 'BE' },
  { value: 'CE', label: 'CE' },
]

export const PROBATION_OPTIONS = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
  { value: 'negotiable', label: 'Обсуждаемо' },
]
