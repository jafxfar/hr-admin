'use client'

import { dashboardApi } from '@/api/dashboard'
import { businesRoleApi } from '@/api/businessRole'
import { vacancyCategoryApi } from '@/api/vacancyCategories'
import type { VacanciesDashboardResponse } from '@/types/dashboard'
import { VACANCY_TYPE_LABELS, type VacancyType } from '@/types/vacancies'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DashboardChartError,
  DashboardChartLoading,
} from './dashboard-chart-state'
import { DASHBOARD_MONTH_OPTIONS } from './dashboard-month-options'
import { DashboardSection } from './dashboard-section'
import { DashboardStatCard } from './dashboard-stat-card'
import { DashboardToolbarField } from './dashboard-toolbar-field'

type DashboardOption = { value: string; label: string }

function DashboardSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value?: string
  onChange: (value: string) => void
  options: DashboardOption[]
  placeholder?: string
}) {
  const emptyOptionValue = '__empty__'
  const mappedValue = value === '' ? emptyOptionValue : (value ?? '')

  return (
    <Select
      value={mappedValue}
      onValueChange={(nextValue) => onChange(nextValue === emptyOptionValue ? '' : nextValue)}
    >
      <SelectTrigger className="w-full h-10 border border-app-border-accent rounded-full px-4 bg-app-surface-0 text-app-text-muted hover:text-app-text hover:bg-[rgb(var(--theme-primary-rgb)/0.08)] transition-all duration-200 focus:ring-1 focus:ring-[rgb(var(--theme-primary-rgb)/0.3)] [&_svg]:text-app-text-muted">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${option.label}`}
            value={option.value === '' ? emptyOptionValue : option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function triBool(s: string): boolean | undefined {
  if (s === '') return undefined
  return s === 'true'
}

const BOOL_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
]

export function VacanciesDashboardSection() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [type, setType] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [businessRoleId, setBusinessRoleId] = useState<string>('')
  const [isPublished, setIsPublished] = useState<string>('')
  const [isClosed, setIsClosed] = useState<string>('')

  const [data, setData] = useState<VacanciesDashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Все категории' },
  ])
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Все роли' },
  ])

  useEffect(() => {
    vacancyCategoryApi.getVacancyCategoryById(1, 20).then((res) => {
      setCategoryOptions([
        { value: '', label: 'Все категории' },
        ...res.items.map((c) => ({ value: String(c.id), label: c.name })),
      ])
    })
    businesRoleApi.getBusinessRole(1, 20).then((res) => {
      setRoleOptions([
        { value: '', label: 'Все роли' },
        ...res.items.map((r) => ({ value: String(r.id), label: r.name })),
      ])
    })
  }, [])

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await dashboardApi.getVacancies({
        year,
        month,
        type: type || undefined,
        category_id: categoryId ? Number(categoryId) : undefined,
        business_role_id: businessRoleId ? Number(businessRoleId) : undefined,
        is_published: triBool(isPublished),
        is_closed: triBool(isClosed),
      })
      setData(res)
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: string }).message)
          : 'Не удалось загрузить данные'
      setError(msg)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [year, month, type, categoryId, businessRoleId, isPublished, isClosed])

  useEffect(() => {
    void load()
  }, [load])

  const typeOptions = useMemo(() => {
    const entries = Object.entries(VACANCY_TYPE_LABELS) as [VacancyType, string][]
    return [{ value: '', label: 'Все типы' }, ...entries.map(([k, v]) => ({ value: k, label: v }))]
  }, [])

  const yearOptions = useMemo(() => {
    const y = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => {
      const val = y - 2 + i
      return { value: String(val), label: String(val) }
    })
  }, [])

  return (
    <div className="space-y-4">
      <h2
        className="text-xl font-bold text-app-text"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Вакансии
      </h2>
      <div className="flex flex-wrap items-end gap-3">
        <DashboardToolbarField label="Год" className="min-w-[120px]">
          <DashboardSelect value={String(year)} onChange={(v) => setYear(Number(v))} options={yearOptions} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Месяц" className="min-w-[140px]">
          <DashboardSelect value={String(month)} onChange={(v) => setMonth(Number(v))} options={DASHBOARD_MONTH_OPTIONS} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Тип" className="min-w-[150px]">
          <DashboardSelect value={type} onChange={setType} options={typeOptions} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Категория" className="min-w-[160px]">
          <DashboardSelect value={categoryId} onChange={setCategoryId} options={categoryOptions} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Бизнес-роль" className="min-w-[160px]">
          <DashboardSelect value={businessRoleId} onChange={setBusinessRoleId} options={roleOptions} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Опубликовано" className="min-w-[130px]">
          <DashboardSelect value={isPublished} onChange={setIsPublished} options={BOOL_OPTIONS} />
        </DashboardToolbarField>
        <DashboardToolbarField label="Закрыта" className="min-w-[120px]">
          <DashboardSelect value={isClosed} onChange={setIsClosed} options={BOOL_OPTIONS} />
        </DashboardToolbarField>
      </div>

      <DashboardSection
        title="Сводка"
        description="Показатели по вакансиям с учётом фильтров. Период задаётся годом и месяцем."
      >
          {isLoading && <DashboardChartLoading className="h-[200px]" />}

          {!isLoading && error && <DashboardChartError message={error} />}

          {!isLoading && !error && data && (
            <div className="admin-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <DashboardStatCard label="Всего вакансий" value={String(data.total_vacancies)} />
              <DashboardStatCard label="Открытые" value={String(data.open_vacancies)} />
              <DashboardStatCard label="Закрытые" value={String(data.closed_vacancies)} />
              <DashboardStatCard label="Закрыто за год" value={String(data.closed_this_year)} />
              <DashboardStatCard label="Закрыто за месяц" value={String(data.closed_in_month)} variant="accent" />
            </div>
          )}
      </DashboardSection>
    </div>
  )
}
