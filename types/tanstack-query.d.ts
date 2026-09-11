import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      skipErrorToast?: boolean
      skipSuccessToast?: boolean
      successTitle?: string
      successDescription?: string
      mutationAction?: 'create' | 'update' | 'delete'
    }
  }
}
