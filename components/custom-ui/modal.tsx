'use client'

import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Modal({
    open,
    onClose,
    children,
    panelClassName,
}: {
    open: boolean
    onClose: () => void
    children: ReactNode
    /** Overrides default max-width / padding for wide layouts */
    panelClassName?: string
}) {
    if (!open) return null
    if (typeof document === 'undefined') return null
    return createPortal(
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[100] flex items-center justify-center p-[24px]"
            onClick={onClose}
        >
            <div
                className={cn(
                    'bg-app-surface-0 text-app-text rounded-[24px] p-[40px] w-full max-w-[540px] relative border border-app-border-accent shadow-[0_40px_80px_rgba(0,0,0,0.6)]',
                    panelClassName,
                )}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body,
    )
}

export function ModalHeader({
    icon: Icon,
    title,
    subtitle,
    onClose,
    className,
}: {
    icon?: LucideIcon
    title: string
    subtitle?: string
    onClose: () => void
    className?: string
}) {
    return (
        <div className={cn('flex justify-between items-start mb-[32px]', className)}>
            <div className="flex items-center gap-[14px]">
                {Icon && (
                    <div className="w-[40px] h-[40px] rounded-full bg-secondary/15 flex items-center justify-center text-app-text-muted">
                        <Icon size={18} />
                    </div>
                )}
                <div>
                    <h3 className="text-app-text font-bold text-[20px] m-0">{title}</h3>
                    {subtitle && (
                        <p className="text-app-text-muted text-xs font-bold uppercase tracking-[0.1em] mt-[3px]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="bg-transparent border-none text-app-text-muted cursor-pointer p-[4px] flex items-center hover:text-app-text transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    )
}

export function ModalActions({
    onCancel,
    onConfirm,
    confirmLabel,
    confirmDisabled,
    confirmLoading,
    confirmLoadingLabel = 'Сохранение…',
}: {
    onCancel: () => void
    onConfirm: () => void
    confirmLabel: string
    confirmDisabled?: boolean
    confirmLoading?: boolean
    confirmLoadingLabel?: string
}) {
    return (
        <div className="flex gap-[12px] mt-[32px]">
            <button
                type="button"
                onClick={onCancel}
                disabled={confirmLoading}
                className="flex-1 py-[14px] px-[24px] rounded-full bg-app-surface-4 border-none text-app-text text-[14px] font-semibold cursor-pointer"
            >
                Отмена
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled || confirmLoading}
                className={[
                    'flex-[2] py-[14px] px-[24px] rounded-full border-none text-[13px] font-black tracking-[0.08em] uppercase transition-opacity',
                    confirmDisabled || confirmLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
                    'bg-brand-accent text-brand-accent-on-alt',
                ].join(' ')}
            >
                {confirmLoading ? confirmLoadingLabel : confirmLabel}
            </button>
        </div>
    )
}
