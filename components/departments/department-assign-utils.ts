import type { Employee } from '@/types/employees'

export const POSITION_CHANGE_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.doc',
  '.docx',
] as const

export const POSITION_CHANGE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const stripDataPrefix = (dataUri: string) => {
  const idx = dataUri.indexOf('base64,')
  return idx !== -1 ? dataUri.slice(idx + 7) : dataUri
}

export const getFileExtension = (filename: string) => {
  const lowerName = filename.toLowerCase()
  return lowerName.includes('.') ? `.${lowerName.split('.').pop()}` : ''
}

export const employeeSelectLabel = (emp: Employee) => {
  const p = emp.properties
  const name = [p?.first_name, p?.last_name].filter(Boolean).join(' ')
  return name ? `${name} (${emp.email})` : emp.email
}

type PositionChangeFileResult = {
  base64: string
  filename: string
  error: string | null
}

export const readPositionChangeBasisFile = (
  file: File,
  onResult: (result: PositionChangeFileResult) => void,
) => {
  const fail = (error: string) => {
    onResult({ base64: '', filename: '', error })
  }

  const ext = getFileExtension(file.name)
  if (
    !POSITION_CHANGE_ALLOWED_EXTENSIONS.includes(
      ext as (typeof POSITION_CHANGE_ALLOWED_EXTENSIONS)[number],
    )
  ) {
    fail('Допустимые форматы: PDF, JPG, PNG, DOC, DOCX')
    return
  }
  if (file.size === 0) {
    fail('Файл пустой')
    return
  }
  if (file.size > POSITION_CHANGE_MAX_FILE_SIZE_BYTES) {
    fail('Размер файла не должен превышать 10MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    onResult({
      base64: stripDataPrefix(String(reader.result ?? '')),
      filename: file.name,
      error: null,
    })
  }
  reader.onerror = () => fail('Не удалось прочитать файл')
  reader.readAsDataURL(file)
}
