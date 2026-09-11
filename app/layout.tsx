import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthGuardWrapper } from '@/components/auth-guard-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { UiSettingsSync } from '@/components/ui-settings-sync'
import { NotificationsRealtimeProvider } from '@/components/notifications-realtime-provider'
import { manrope } from '@/lib/fonts'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HR - Административная панель',
  description: 'HR система для управления сотрудниками, вакансиями, отпусками и другими процессами',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={manrope.variable}>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <UiSettingsSync />
            <AuthGuardWrapper>
              <NotificationsRealtimeProvider>
                {children}
              </NotificationsRealtimeProvider>
            </AuthGuardWrapper>
          </QueryProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
