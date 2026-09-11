import type { BranchTreeNode } from '@/api/branches'
import type { Department, DepartmentHeadUser } from '@/types/departments'

/** Recursively finds a branch node by id in the nested tree returned by /branches/tree */
export function findBranchInTree(tree: BranchTreeNode[], branchId: number): BranchTreeNode | undefined {
  for (const node of tree) {
    if (node.id === branchId) return node
    const found = findBranchInTree(node.children ?? [], branchId)
    if (found) return found
  }
  return undefined
}

/** Recursively flattens the nested tree returned by /departments/tree into a flat array */
export function flattenTree(departments: Department[], level = 0): Department[] {
  return departments.flatMap((dept) => {
    const { children, ...rest } = dept
    const flat: Department = { ...rest, level: dept.level ?? level }
    return [flat, ...(children ? flattenTree(children, level + 1) : [])]
  })
}

export function getDeptName(dept: Department): string {
  return dept.department_name?.trim() || dept.name?.trim() || 'Без названия'
}

export function getFullName(user: DepartmentHeadUser | null | undefined): string {
  if (!user) return 'Не назначен'
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
  return name.trim() || user.full_name?.trim() || 'Не назначен'
}

export function getInitials(user: DepartmentHeadUser | null | undefined): string {
  if (!user) return '?'
  const first = user.first_name?.[0] ?? ''
  const last = user.last_name?.[0] ?? ''
  return `${first}${last}`.toUpperCase() || user.full_name?.[0]?.toUpperCase() || '?'
}

/** Если `icon` — валидный CSS color (hex / rgb / hsl), используем как фон карточки; иначе игнорируем (имя Lucide-иконки) */
export function cssColorFromDepartmentIcon(icon?: string | null): string | undefined {
  if (!icon?.trim()) return undefined
  const t = icon.trim()
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(t)) return t
  if (/^(rgb|hsl)a?\(/i.test(t)) return t
  return undefined
}

export function isLikelyDarkBackground(cssColor: string): boolean {
  const hex = cssColor.trim().match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }
  if (/^#([0-9a-fA-F]{3})$/i.test(cssColor.trim())) {
    const h = cssColor.trim().slice(1)
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }
  if (/^rgb/i.test(cssColor.trim())) return true
  return true
}
