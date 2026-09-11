import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight, Globe, HelpCircle, ShieldAlert } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col bg-app-bg text-app-text"
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      <header className="w-full border-b border-app-border bg-app-bg/95 px-8 py-6 backdrop-blur-md z-50">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <BrandLogo href="/dashboard" />
          <div className="flex gap-6 items-center">
            <button
              type="button"
              className="flex items-center gap-2 text-app-text-muted transition-colors duration-300 hover:text-brand-accent"
              aria-label="Язык"
            >
              <Globe size={20} />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-app-text-muted transition-colors duration-300 hover:text-brand-accent"
              aria-label="Помощь"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="grow flex items-center justify-center relative px-6 py-12">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQRmwRsNpaJsnanWdiWVAsVLs0P-w0vrsEhIZARj19hwQw7eqBQ_8FKAlSlbCzQxM27UpjmSmmiNio0BuxbDCD9V44O0GMmZnZ3tICCZgf42_7JQFeJxhKS7TFVFWWzX2EDOdjH0q8vXLEW_PsuE_dqsiacPUnGb4B4n7mDCOQrJiFMyS5yc1SR-hyvrzJUmgYWK3b79jaB_OytAsn_5hmf4Er8YtORa1Ww6RsKr4OZsk0TclL3LPBfjbsuvYPnsVBH_WbujKdo-0"
            alt="Фон страницы ограниченного доступа"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgb(var(--theme-primary-rgb) / 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgb(var(--theme-secondary-rgb) / 0.05) 0%, transparent 40%)',
          }}
        />

        <div className="relative z-10 w-full max-w-300 grid md:grid-cols-2 gap-12 items-center">
          <section className="hidden md:flex flex-col gap-8">
            <div className="space-y-4">
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'var(--secondary)', letterSpacing: '0.2em' }}
              >
                Системная авторизация
              </span>
              <h1
                className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1]"
                style={{ color: 'var(--app-text)' }}
              >
                Ограниченный
                <br />
                доступ
              </h1>
              <p className="text-lg max-w-md leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                У текущей учетной записи нет прав для работы в административной панели.
              </p>
            </div>
          </section>

          <section className="w-full max-w-md mx-auto">
            <div
              className={cn(
                'space-y-8 rounded-3xl p-10 lg:p-12 shadow-xl shadow-black/5',
                'border border-app-border bg-app-surface-0 backdrop-blur-xl',
                'dark:border-white/10 dark:bg-black/45 dark:shadow-2xl dark:shadow-black/40',
              )}
            >
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <div className="space-y-3 text-center">
                <h1 className="text-3xl font-extrabold tracking-tighter" style={{ color: 'var(--app-text)' }}>
                  Нет доступа в админ-часть
                </h1>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)' }}>
                  Для вашего аккаунта отключен доступ к административному интерфейсу.
                  <br />
                  Обратитесь к администратору или войдите под другим профилем.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className={cn(
                    'w-full font-bold py-4 flex items-center justify-center gap-3 group transition-all duration-300 rounded-full',
                    'hover:shadow-[0_0_40px_rgb(var(--theme-primary-rgb) / 0.25)] hover:scale-[0.98]',
                  )}
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-accent), var(--brand))',
                    color: 'var(--brand-accent-on-alt)',
                  }}
                >
                  <span>Перейти в доступный раздел</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    'w-full py-3.5 rounded-full border border-app-border',
                    'bg-app-surface-1 text-app-text font-semibold text-sm',
                    'flex items-center justify-center transition-all duration-300',
                    'hover:bg-app-surface-2 hover:shadow-[0_0_20px_rgb(var(--theme-primary-rgb) / 0.08)] hover:scale-[0.98]',
                    'active:scale-[0.98]',
                  )}
                >
                  Войти под другим аккаунтом
                </Link>
              </div>

              <p className="text-xs text-center" style={{ color: 'var(--app-text-muted)' }}>
                Если вы считаете, что это ошибка, обратитесь к системному администратору.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
