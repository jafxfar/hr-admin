export const hexToRgbChannels = (hexColor: string) => {
  const normalized = hexColor.replace('#', '')
  if (normalized.length !== 6) {
    return '0 0 0'
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)

  return `${red} ${green} ${blue}`
}

export const getContrastColor = (hexColor: string) => {
  const normalized = hexColor.replace('#', '')
  if (normalized.length !== 6) {
    return '#ffffff'
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.55 ? '#1a1a1a' : '#ffffff'
}
