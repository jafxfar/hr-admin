'use client'

import { useEffect, useRef, useState } from 'react'
import { useEmployeeForm } from '../EmployeeFormContext'
import {
    getFileExtension,
    POSITION_CHANGE_ALLOWED_EXTENSIONS,
    POSITION_CHANGE_MAX_FILE_SIZE_BYTES,
} from './constants'
import { stripDataPrefix } from './utils'

export const usePositionChangeBasis = (hasPositionOrDepartmentChange: boolean) => {
    const { formData, updateFormData } = useEmployeeForm()
    const positionChangeBasisInputRef = useRef<HTMLInputElement>(null)
    const [positionChangeFileError, setPositionChangeFileError] = useState<string | null>(null)

    useEffect(() => {
        if (hasPositionOrDepartmentChange) return
        if (
            !formData.position_change_reason_text &&
            !formData.position_change_basis_file_base64 &&
            !formData.position_change_basis_filename &&
            !formData.position_change_basis_type
        ) {
            return
        }
        updateFormData({
            position_change_reason_text: '',
            position_change_basis_file_base64: '',
            position_change_basis_filename: '',
            position_change_basis_type: '',
        })
        setPositionChangeFileError(null)
        if (positionChangeBasisInputRef.current) positionChangeBasisInputRef.current.value = ''
    }, [
        formData.position_change_basis_file_base64,
        formData.position_change_basis_filename,
        formData.position_change_basis_type,
        formData.position_change_reason_text,
        hasPositionOrDepartmentChange,
        updateFormData,
    ])

    const handlePositionChangeBasisFile = (file: File) => {
        const ext = getFileExtension(file.name)
        if (!POSITION_CHANGE_ALLOWED_EXTENSIONS.includes(ext as (typeof POSITION_CHANGE_ALLOWED_EXTENSIONS)[number])) {
            setPositionChangeFileError('Допустимые форматы: PDF, JPG, PNG, DOC, DOCX')
            updateFormData({
                position_change_basis_file_base64: '',
                position_change_basis_filename: '',
            })
            return
        }

        if (file.size === 0) {
            setPositionChangeFileError('Файл пустой')
            updateFormData({
                position_change_basis_file_base64: '',
                position_change_basis_filename: '',
            })
            return
        }

        if (file.size > POSITION_CHANGE_MAX_FILE_SIZE_BYTES) {
            setPositionChangeFileError('Размер файла не должен превышать 10MB')
            updateFormData({
                position_change_basis_file_base64: '',
                position_change_basis_filename: '',
            })
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            updateFormData({
                position_change_basis_file_base64: stripDataPrefix(String(reader.result ?? '')),
                position_change_basis_filename: file.name,
            })
            setPositionChangeFileError(null)
        }
        reader.onerror = () => {
            setPositionChangeFileError('Не удалось прочитать файл')
            updateFormData({
                position_change_basis_file_base64: '',
                position_change_basis_filename: '',
            })
        }
        reader.readAsDataURL(file)
    }

    return {
        positionChangeBasisInputRef,
        positionChangeFileError,
        handlePositionChangeBasisFile,
    }
}
