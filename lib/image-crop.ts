type CreateImageOptions = {
  crossOrigin?: HTMLImageElement['crossOrigin']
}

export type PixelCropRect = { x: number; y: number; width: number; height: number }

const createImage = (src: string, options: CreateImageOptions = {}) => {
  const image = new Image()
  image.addEventListener('load', () => undefined)
  if (options.crossOrigin) image.crossOrigin = options.crossOrigin
  image.src = src
  return image
}

const waitForImage = (image: HTMLImageElement) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    if (image.complete && image.naturalWidth > 0) return resolve(image)
    const handleLoad = () => resolve(image)
    const handleError = () => reject(new Error('Failed to load image'))
    image.addEventListener('load', handleLoad, { once: true })
    image.addEventListener('error', handleError, { once: true })
  })

const getMimeFromDataUrl = (dataUrl: string) => {
  const match = /^data:([^;]+);base64,/.exec(dataUrl)
  return match?.[1] ?? null
}

export type CropToDataUrlOptions = {
  outputMime?: 'image/jpeg' | 'image/png' | 'image/webp'
  quality?: number
  background?: string
}

export const cropToDataUrl = async (
  imageSrc: string,
  pixelCrop: PixelCropRect,
  options: CropToDataUrlOptions = {},
) => {
  const image = await waitForImage(createImage(imageSrc))
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const safeX = Math.max(0, Math.floor(pixelCrop.x))
  const safeY = Math.max(0, Math.floor(pixelCrop.y))
  const safeW = Math.max(1, Math.floor(pixelCrop.width))
  const safeH = Math.max(1, Math.floor(pixelCrop.height))

  canvas.width = safeW
  canvas.height = safeH

  if (options.background) {
    ctx.fillStyle = options.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(image, safeX, safeY, safeW, safeH, 0, 0, safeW, safeH)

  const inferredMime =
    options.outputMime ??
    (getMimeFromDataUrl(imageSrc) as CropToDataUrlOptions['outputMime'] | null) ??
    'image/webp'

  const quality = typeof options.quality === 'number' ? options.quality : 0.92
  const dataUrl = canvas.toDataURL(inferredMime, quality)
  return dataUrl
}

