import type { LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

const iconsMap = LucideIcons as Record<string, unknown>

// Lucide v0.440+ exports icons as forwardRef objects (typeof === 'object'),
// not plain functions. We detect them by checking for a non-null object
// with a string displayName that matches the key (PascalCase, no 'Icon' suffix).
function isIconComponent(key: string, value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v['displayName'] === 'string' && v['displayName'] === key
}

/**
 * All valid Lucide icon names (PascalCase, no "Icon" alias suffix).
 * Computed once at module load.
 */
export const ALL_ICON_NAMES: string[] = Object.keys(iconsMap).filter(
  (k) => /^[A-Z]/.test(k) && !k.endsWith('Icon') && isIconComponent(k, iconsMap[k]),
)

/**
 * Dynamically resolves a Lucide icon component by its PascalCase name.
 * e.g. getIconByName("Trophy") → Trophy icon component
 * Returns null if the name is not a valid Lucide icon.
 */
export function getIconByName(name: string | null | undefined): LucideIcon | null {
  if (!name) return null
  const icon = iconsMap[name]
  if (icon && (typeof icon === 'function' || typeof icon === 'object')) {
    return icon as LucideIcon
  }
  return null
}

/**
 * A curated list of popular icon names to show before the user types.
 */
export const POPULAR_ICON_NAMES: string[] = [
  'Trophy',
  'Star',
  'Award',
  'Medal',
  'Crown',
  'Rocket',
  'Zap',
  'Flame',
  'Diamond',
  'Sparkles',
  'Heart',
  'Lightbulb',
  'Target',
  'TrendingUp',
  'BadgeCheck',
  'Gift',
  'Handshake',
  'ThumbsUp',
  'Shield',
  'Globe',
]
