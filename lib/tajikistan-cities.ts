import type { BasicOption } from '@/components/employee-form/profile-form/types'

export type TajikistanCityOption = BasicOption & {
    searchAliases?: string[]
}

const TAJIKISTAN_CITIES: TajikistanCityOption[] = [
    // Столица
    { value: 'dushanbe', label: 'Душанбе' },

    // Согдийская область
    { value: 'khujand', label: 'Худжанд' },
    { value: 'istaravshan', label: 'Истаравшан', searchAliases: ['Ура-Тюбе'] },
    { value: 'isfara', label: 'Исфара' },
    { value: 'kanibadam', label: 'Канибадам' },
    { value: 'panjakent', label: 'Пенджикент' },
    { value: 'gafurov', label: 'Гафуров', searchAliases: ['Чкаловск'] },
    { value: 'buston', label: 'Бустон' },
    { value: 'asht', label: 'Ашт' },
    { value: 'ganchi', label: 'Ганчи' },
    { value: 'zafarobod', label: 'Зафаробод' },
    { value: 'taboshar', label: 'Табошар' },

    // Хатлонская область
    { value: 'bokhtar', label: 'Бохтар', searchAliases: ['Курган-Тюбе', 'Курган Тюбе'] },
    { value: 'kulob', label: 'Куляб' },
    { value: 'danghara', label: 'Дангара' },
    { value: 'levakant', label: 'Левакант', searchAliases: ['Сарбанд'] },
    { value: 'yavan', label: 'Яван' },
    { value: 'vakhsh', label: 'Вахш' },
    { value: 'shahritus', label: 'Шахритус' },
    { value: 'kubodiyon', label: 'Кубодиён' },
    { value: 'farkhor', label: 'Фархор' },
    { value: 'khulbuk', label: 'Хулбук' },
    { value: 'kolkhozobod', label: 'Колхозабад' },
    { value: 'jilikul', label: 'Джиликуль' },

    // ГБАО
    { value: 'khorog', label: 'Хорог' },
    { value: 'murghob', label: 'Мургаб' },

    // РРП
    { value: 'guliston', label: 'Гулистон', searchAliases: ['Кайраккум'] },
    { value: 'vahdat', label: 'Вахдат' },
    { value: 'tursunzoda', label: 'Турсунзода' },
    { value: 'rogun', label: 'Рогун' },
    { value: 'nurek', label: 'Нурек' },
    { value: 'hisor', label: 'Хисар', searchAliases: ['Гиссар'] },
    { value: 'rudaki', label: 'Рудаки' },
    { value: 'varzob', label: 'Варзоб' },
    { value: 'faizabad', label: 'Файзабад' },
]

export const TAJIKISTAN_CITY_OPTIONS: BasicOption[] = TAJIKISTAN_CITIES.map(({ value, label }) => ({
    value,
    label,
}))

export const CITY_LABELS: Record<string, string> = Object.fromEntries(
    TAJIKISTAN_CITIES.map(({ value, label }) => [value, label]),
)

const CITY_ALIASES_BY_VALUE = Object.fromEntries(
    TAJIKISTAN_CITIES.map(({ value, searchAliases }) => [value, searchAliases ?? []]),
) as Record<string, string[]>

export const findCityOptionByQuery = (options: BasicOption[], query: string): BasicOption | null => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return null

    return (
        options.find((opt) => {
            if (opt.label.toLowerCase() === normalized) return true
            if (opt.value.toLowerCase() === normalized) return true
            return CITY_ALIASES_BY_VALUE[opt.value]?.some((alias) => alias.toLowerCase() === normalized) ?? false
        }) ?? null
    )
}

export const filterCityOptions = (options: BasicOption[], query: string): BasicOption[] => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return options

    return options.filter((opt) => {
        if (opt.label.toLowerCase().includes(normalized)) return true
        if (opt.value.toLowerCase().includes(normalized)) return true
        return CITY_ALIASES_BY_VALUE[opt.value]?.some((alias) => alias.toLowerCase().includes(normalized)) ?? false
    })
}

export { TAJIKISTAN_CITIES }
