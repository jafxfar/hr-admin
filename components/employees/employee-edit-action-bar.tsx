'use client'

import { useRouter } from 'next/navigation'

type EmployeeEditActionBarProps = {
  percent: number
  isPending: boolean
  onSave: () => void
}

export const EmployeeEditActionBar = ({
  percent,
  isPending,
  onSave,
}: EmployeeEditActionBarProps) => {
  const router = useRouter()

  return (
    <div
      className="fixed bottom-6 right-6 left-6 lg:left-78 flex justify-between items-center px-6 py-4 z-40 border rounded-4xl"
      style={{
        background: 'var(--app-header-bg)',
        backdropFilter: 'blur(24px)',
        borderColor: 'var(--app-border)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}
    >
      <EditProgressIndicator percent={percent} />
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <button
          type="button"
          className="flex-1 lg:flex-none px-10 py-3 rounded-full font-bold transition-all active:scale-95 text-app-text"
          style={{ background: 'var(--app-surface-4)' }}
          onClick={() => router.push('/employees')}
        >
          Отменить
        </button>
        <button
          type="button"
          className="flex-1 lg:flex-none px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all active:scale-95"
          style={{
            background: 'linear-gradient(to right, var(--brand-accent), var(--brand))',
            color: 'var(--brand-accent-on-alt)',
            boxShadow: '0 10px 30px -5px rgb(var(--theme-primary-rgb) / 0.4)',
          }}
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}

const EditProgressIndicator = ({ percent }: { percent: number }) => (
  <div className="hidden lg:flex items-center gap-3">
    <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--app-text-muted)' }}>
      Прогресс заполнения
    </span>
    <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'var(--app-surface-2)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percent}%`, background: 'var(--brand-accent)' }}
      />
    </div>
    <span className="text-xs font-bold" style={{ color: 'var(--brand-accent)' }}>
      {percent}%
    </span>
  </div>
)
