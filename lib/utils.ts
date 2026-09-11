import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export function getImageUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  // Убираем /api/v1 из базового URL чтобы получить корень сервера
  const serverRoot = BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${serverRoot}/${path}`
}
