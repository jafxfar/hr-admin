'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Modal, ModalHeader, ModalActions } from '@/components/custom-ui'

export interface BaseModalProps {
    open: boolean
    onClose: () => void
    icon?: LucideIcon
    title: string
    subtitle?: string
    confirmLabel: string
    onConfirm: () => void | Promise<void>
    confirmLoading?: boolean
    confirmDisabled?: boolean
    children: ReactNode
}

export function BaseModal({
    open,
    onClose,
    icon,
    title,
    subtitle,
    confirmLabel,
    onConfirm,
    confirmLoading,
    confirmDisabled,
    children,
}: BaseModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalHeader icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
            <div className="flex flex-col gap-[20px]">
                {children}
            </div>
            <ModalActions
                onCancel={onClose}
                onConfirm={onConfirm}
                confirmLabel={confirmLabel}
                confirmDisabled={confirmDisabled}
                confirmLoading={confirmLoading}
            />
        </Modal>
    )
}

export type ModalMode = 'create' | 'edit'
