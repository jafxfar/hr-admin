'use client'

import { useRef, useState } from 'react'
import { useEmployeeForm } from '../EmployeeFormContext'
import { useDeleteEmployeeProfilePhotoMutation } from '@/hooks/use-employees'
import { useToast } from '@/hooks/use-toast'
import { stripDataPrefix } from './utils'

type UseProfilePhotoOptions = {
    employeeId?: number
}

export const useProfilePhoto = ({ employeeId }: UseProfilePhotoOptions = {}) => {
    const { formData, initialFormData, updateFormData } = useEmployeeForm()
    const { toast } = useToast()
    const { mutateAsync: deleteProfilePhoto, isPending: isRemovingPhoto } =
        useDeleteEmployeeProfilePhotoMutation()
    const photoInputRef = useRef<HTMLInputElement>(null)
    const serverPhotoRemovedRef = useRef(false)
    const [pendingPhotoSrc, setPendingPhotoSrc] = useState<string | null>(null)
    const [pendingPhotoFilename, setPendingPhotoFilename] = useState<string | null>(null)
    const [isCropOpen, setIsCropOpen] = useState(false)

    const initialHadServerPhoto = Boolean(
        (initialFormData as { _photoPreview?: string })._photoPreview,
    )

    const handlePhotoChange = (file: File) => {
        const reader = new FileReader()
        reader.onload = () => {
            const dataUri = reader.result as string
            setPendingPhotoSrc(dataUri)
            setPendingPhotoFilename(file.name)
            setIsCropOpen(true)
        }
        reader.readAsDataURL(file)
    }

    const handleCropClose = () => {
        setIsCropOpen(false)
        setPendingPhotoSrc(null)
        setPendingPhotoFilename(null)
        if (photoInputRef.current) photoInputRef.current.value = ''
    }

    const handleCropSave = (dataUrl: string) => {
        updateFormData({
            profile_photo_base64: stripDataPrefix(dataUrl),
            profile_photo_filename: pendingPhotoFilename ?? 'avatar.webp',
            _photoPreview: dataUrl,
        } as Parameters<typeof updateFormData>[0])
        handleCropClose()
    }

    const clearLocalPhoto = () => {
        updateFormData({
            profile_photo_base64: undefined,
            profile_photo_filename: undefined,
            _photoPreview: undefined,
        } as Parameters<typeof updateFormData>[0])
        if (photoInputRef.current) photoInputRef.current.value = ''
    }

    const handlePhotoRemove = async () => {
        const shouldDeleteOnServer =
            Boolean(employeeId) && initialHadServerPhoto && !serverPhotoRemovedRef.current

        clearLocalPhoto()

        if (!shouldDeleteOnServer || !employeeId) return

        try {
            await deleteProfilePhoto(employeeId)
            serverPhotoRemovedRef.current = true
        } catch {
            const restorePreview = (initialFormData as { _photoPreview?: string })._photoPreview
            if (restorePreview && !serverPhotoRemovedRef.current) {
                updateFormData({
                    _photoPreview: restorePreview,
                } as Parameters<typeof updateFormData>[0])
            }
            toast({
                variant: 'destructive',
                title: 'Не удалось удалить фото',
                description: 'Попробуйте ещё раз',
            })
        }
    }

    const photoSrc: string | undefined =
        (formData as { _photoPreview?: string })._photoPreview ??
        (formData.profile_photo_base64 ? `data:image/*;base64,${formData.profile_photo_base64}` : undefined)

    return {
        photoInputRef,
        photoSrc,
        isCropOpen,
        pendingPhotoSrc,
        isRemovingPhoto,
        handlePhotoChange,
        handleCropClose,
        handleCropSave,
        handlePhotoRemove,
    }
}
