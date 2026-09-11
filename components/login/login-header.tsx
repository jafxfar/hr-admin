'use client'

import { Globe, HelpCircle } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export const LoginHeader = () => (
  <header className="flex w-full items-center justify-between gap-4">
    <BrandLogo inverted />
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="text-app-text-muted transition-colors duration-300 hover:text-app-text"
        aria-label="Язык"
      >
        <Globe size={20} />
      </button>
      <button
        type="button"
        className="text-app-text-muted transition-colors duration-300 hover:text-app-text"
        aria-label="Помощь"
      >
        <HelpCircle size={20} />
      </button>
    </div>
  </header>
)
