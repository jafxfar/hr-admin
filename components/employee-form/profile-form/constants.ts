export const POSITION_CHANGE_ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'] as const
export const POSITION_CHANGE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const normalizeOptionalId = (value: number | null | undefined) => {
    if (value == null) return null
    const numericValue = Number(value)
    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null
}

export const getFileExtension = (filename: string) => {
    const lowerName = filename.toLowerCase()
    return lowerName.includes('.') ? `.${lowerName.split('.').pop()}` : ''
}
