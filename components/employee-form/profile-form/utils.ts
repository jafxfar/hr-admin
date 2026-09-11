export function stripDataPrefix(dataUri: string): string {
    const idx = dataUri.indexOf('base64,')
    return idx !== -1 ? dataUri.slice(idx + 7) : dataUri
}

export const replaceAtIndex = <T,>(items: T[], index: number, next: T) =>
    items.map((item, idx) => (idx === index ? next : item))

