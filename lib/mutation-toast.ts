import { getApiErrorMessage } from '@/lib/api-error'

export type MutationAction = 'create' | 'update' | 'delete'

const SUCCESS_TITLES: Record<MutationAction, string> = {
  create: 'Создано',
  update: 'Изменено',
  delete: 'Удалено',
}

const SUCCESS_DESCRIPTIONS: Record<MutationAction, string> = {
  create: 'Запись успешно создана',
  update: 'Изменения сохранены',
  delete: 'Запись удалена',
}

export const getDefaultSuccessTitle = (action?: MutationAction): string => {
  if (action && SUCCESS_TITLES[action]) {
    return SUCCESS_TITLES[action]
  }
  return 'Операция выполнена'
}

export const getDefaultSuccessDescription = (action?: MutationAction): string | undefined => {
  if (action && SUCCESS_DESCRIPTIONS[action]) {
    return SUCCESS_DESCRIPTIONS[action]
  }
  return 'Действие выполнено успешно'
}

export const getDefaultErrorToast = (error: unknown) => ({
  title: 'Ошибка',
  description: getApiErrorMessage(error),
})
