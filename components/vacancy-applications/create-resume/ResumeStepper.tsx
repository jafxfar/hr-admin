'use client'

import { RESUME_STEPS } from './resume-options'

type ResumeStepperProps = {
  currentStep: number
}

export const ResumeStepper = ({ currentStep }: ResumeStepperProps) => {
  return (
    <nav aria-label="Шаги резюме" className="w-full overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-0 px-1">
        {RESUME_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isPast = step.id < currentStep
          const isLast = index === RESUME_STEPS.length - 1

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isActive
                      ? 'bg-brand-accent text-brand-accent-on-alt'
                      : isPast
                        ? 'bg-app-surface-3 text-app-text'
                        : 'bg-app-surface-2 text-app-text-muted',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {step.id}
                </span>
                <span
                  className={[
                    'whitespace-nowrap text-sm',
                    isActive ? 'font-bold text-app-text' : 'text-app-text-muted',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>
              {!isLast ? (
                <div
                  className={[
                    'mx-3 h-px w-8 sm:w-12',
                    isPast || isActive ? 'bg-app-border-accent' : 'border-t border-dashed border-app-border-accent',
                  ].join(' ')}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
