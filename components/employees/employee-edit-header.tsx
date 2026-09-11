'use client'

import { Info } from 'lucide-react'

type EmployeeEditHeaderProps = {
  employeeId: number
  fullName: string
}

export const EmployeeEditHeader = ({ employeeId, fullName }: EmployeeEditHeaderProps) => (
  <div className="mb-12 relative">
    <h2
      className="text-6xl font-black tracking-tighter leading-tight"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--app-text)' }}
    >
      Редактировать
      <br />
      <span style={{ color: 'var(--brand-accent)' }}>{fullName || 'Сотрудника'}</span>
    </h2>
    <div className="absolute top-0 right-0">
      <div
        className="flex items-center gap-4 p-4 rounded-3xl"
        style={{ background: 'var(--app-surface-3)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'rgb(var(--theme-secondary-rgb) / 0.1)', color: 'var(--secondary)' }}
        >
          <Info size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
            ID системы
          </p>
          <p
            className="text-lg font-bold text-app-text"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            #{employeeId}
          </p>
        </div>
      </div>
    </div>
  </div>
)
