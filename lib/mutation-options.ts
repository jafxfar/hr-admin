import type { MutationAction } from '@/lib/mutation-toast'

export type AppMutationMeta = {
  skipErrorToast?: boolean
  skipSuccessToast?: boolean
  successTitle?: string
  successDescription?: string
  mutationAction?: MutationAction
}

export type MutationCallOptions = {
  meta?: AppMutationMeta
  onSuccess?: (...args: any[]) => unknown
  onError?: (...args: any[]) => unknown
  onSettled?: (...args: any[]) => unknown
  onMutate?: (...args: any[]) => unknown
}

/** Typed helper for mutate/mutateAsync options that include mutation meta. */
export const mutationOpts = (options: MutationCallOptions): any => options

export const silentMutationOpts = mutationOpts({
  meta: { skipSuccessToast: true, skipErrorToast: true },
})
