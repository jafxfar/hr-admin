export interface CalendarDay {
  day: number
  dayName: string
  isWeekend: boolean
}

export const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const

const DAY_NAMES_LOWER = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'] as const
const DAY_NAMES_TITLE = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const

export const getDaysInMonth = (
  date: Date,
  dayNameStyle: 'lower' | 'title' = 'lower',
): CalendarDay[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const count = new Date(year, month + 1, 0).getDate()
  const dayNames = dayNameStyle === 'title' ? DAY_NAMES_TITLE : DAY_NAMES_LOWER

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(year, month, i + 1)
    const dow = d.getDay()
    return {
      day: i + 1,
      dayName: dayNames[dow],
      isWeekend: dow === 0 || dow === 6,
    }
  })
}

export const startOfCurrentMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export const formatMonthTitle = (date: Date) =>
  `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
