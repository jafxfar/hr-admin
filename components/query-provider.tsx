'use client'

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { isForbiddenError } from '@/lib/query-error'
import {
  getDefaultErrorToast,
  getDefaultSuccessDescription,
  getDefaultSuccessTitle,
} from '@/lib/mutation-toast'
import { toast } from '@/hooks/use-toast'

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                mutationCache: new MutationCache({
                    onSuccess: (_data, _variables, _context, mutation) => {
                        if (mutation.meta?.skipSuccessToast) {
                            return
                        }

                        const action = mutation.meta?.mutationAction
                        toast({
                            title: mutation.meta?.successTitle ?? getDefaultSuccessTitle(action),
                            description:
                                mutation.meta?.successDescription ?? getDefaultSuccessDescription(action),
                        })
                    },
                    onError: (error, _variables, _context, mutation) => {
                        if (mutation.meta?.skipErrorToast) {
                            return
                        }

                        const { title, description } = getDefaultErrorToast(error)
                        toast({
                            variant: 'destructive',
                            title,
                            description,
                        })
                    },
                }),
                defaultOptions: {
                    queries: {
                        retry: (failureCount, error) => {
                            if (isForbiddenError(error)) {
                                return false
                            }

                            return failureCount < 3
                        },
                    },
                },
            }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
