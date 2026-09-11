'use client'

import { useState } from 'react'

import type { WorkExperience } from '@/types/workExperience'
import type { Salary } from '@/types/salary'
import type { Contract } from '@/types/contracts'
import type { Schedule } from '@/types/schedule'
import type { Education } from '@/types/education'
import { useDeleteSalaryMutation, useUpdateSalaryMutation } from '@/hooks/use-salary'
import { useDeleteScheduleMutation, useUpdateScheduleMutation } from '@/hooks/use-schedule'
import { useDeleteContractMutation, useUpdateContractMutation } from '@/hooks/use-contract'
import { useDeleteEducationMutation, useUpdateEducationMutation } from '@/hooks/use-education'
import { useDeleteDocumentMutation, useUpdateDocumentMutation } from '@/hooks/use-documents'
import { useDeleteWorkExperienceMutation, useUpdateEmployeeMutation } from '@/hooks/use-workExperience'

import type { EditingChip, DeleteKind, FormDocument, PendingDelete } from './types'
import { replaceAtIndex } from './utils'
import { buildApiFieldError } from '@/lib/form-field-errors'
import type { FormFieldError } from '@/lib/form-field-errors'

const kindToSection = (kind: DeleteKind): string => {
    if (kind === 'salary') return 'salary'
    if (kind === 'schedule') return 'schedule'
    if (kind === 'work') return 'work'
    if (kind === 'contract') return 'contract'
    if (kind === 'education') return 'education'
    return 'document'
}

export function useProfileChips({
    salaries,
    schedules,
    workExperiences,
    contracts,
    educations,
    documents,
    updateFormData,
    setFieldErrors,
}: {
    salaries: Salary[]
    schedules: Schedule[]
    workExperiences: WorkExperience[]
    contracts: Contract[]
    educations: Education[]
    documents: FormDocument[]
    updateFormData: (data: any) => void
    setFieldErrors: (errors: FormFieldError[]) => void
}) {
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editingChip, setEditingChip] = useState<EditingChip | null>(null)
    const [isSavingEdit, setIsSavingEdit] = useState(false)

    const { mutateAsync: deleteSalaryAsync } = useDeleteSalaryMutation()
    const { mutateAsync: deleteWorkExperienceAsync } = useDeleteWorkExperienceMutation()
    const { mutateAsync: deleteScheduleAsync } = useDeleteScheduleMutation()
    const { mutateAsync: deleteContractAsync } = useDeleteContractMutation()
    const { mutateAsync: deleteEducationAsync } = useDeleteEducationMutation()
    const { mutateAsync: deleteDocumentAsync } = useDeleteDocumentMutation()

    const { mutateAsync: updateSalaryAsync } = useUpdateSalaryMutation()
    const { mutateAsync: updateWorkExperienceAsync } = useUpdateEmployeeMutation()
    const { mutateAsync: updateScheduleAsync } = useUpdateScheduleMutation()
    const { mutateAsync: updateContractAsync } = useUpdateContractMutation()
    const { mutateAsync: updateEducationAsync } = useUpdateEducationMutation()
    const { mutateAsync: updateDocumentAsync } = useUpdateDocumentMutation()

    const requestDelete = (kind: DeleteKind, index: number) => {
        setPendingDelete({ kind, index })
    }

    const closeDeleteModal = () => {
        if (isDeleting) return
        setPendingDelete(null)
    }

    const getDeleteLabel = (kind: DeleteKind): string => {
        if (kind === 'salary') return 'запись о зарплате'
        if (kind === 'schedule') return 'график работы'
        if (kind === 'work') return 'опыт работы'
        if (kind === 'contract') return 'контракт'
        if (kind === 'education') return 'образование'
        return 'документ'
    }

    const removeLocal = (kind: DeleteKind, index: number) => {
        if (kind === 'salary') {
            updateFormData({ salaries: salaries.filter((_, idx) => idx !== index) })
            return
        }
        if (kind === 'schedule') {
            updateFormData({ schedules: schedules.filter((_, idx) => idx !== index) })
            return
        }
        if (kind === 'work') {
            updateFormData({ work_experiences: workExperiences.filter((_, idx) => idx !== index) })
            return
        }
        if (kind === 'contract') {
            updateFormData({ contracts: contracts.filter((_, idx) => idx !== index) })
            return
        }
        if (kind === 'education') {
            updateFormData({ educations: educations.filter((_, idx) => idx !== index) })
            return
        }
        updateFormData({ documents: documents.filter((_, idx) => idx !== index) })
    }

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return

        const { kind, index } = pendingDelete
        setIsDeleting(true)

        try {
            if (kind === 'salary') {
                const item = salaries[index]
                if (item?.id) await deleteSalaryAsync(item.id)
                removeLocal(kind, index)
                setPendingDelete(null)
                return
            }

            if (kind === 'schedule') {
                const item = schedules[index]
                if (item?.id) await deleteScheduleAsync(item.id)
                removeLocal(kind, index)
                setPendingDelete(null)
                return
            }

            if (kind === 'work') {
                const item = workExperiences[index]
                if (item?.id) await deleteWorkExperienceAsync(item.id)
                removeLocal(kind, index)
                setPendingDelete(null)
                return
            }

            if (kind === 'contract') {
                const item = contracts[index]
                if (item?.id) await deleteContractAsync(item.id)
                removeLocal(kind, index)
                setPendingDelete(null)
                return
            }

            if (kind === 'education') {
                const item = educations[index]
                if (item?.id) await deleteEducationAsync(item.id)
                removeLocal(kind, index)
                setPendingDelete(null)
                return
            }

            const item = documents[index] as FormDocument | undefined
            if (item?._serverId) await deleteDocumentAsync(item._serverId)
            removeLocal(kind, index)
            setPendingDelete(null)
        } catch (error) {
            setFieldErrors([
                buildApiFieldError(error, {
                    row: index + 1,
                    section: kindToSection(kind),
                }),
            ])
        } finally {
            setIsDeleting(false)
        }
    }

    const requestEdit = (kind: DeleteKind, index: number) => {
        setEditingChip({ kind, index })
    }

    const closeEditModal = () => {
        if (isSavingEdit) return
        setEditingChip(null)
    }

    const handleSubmitEdit = async (kind: DeleteKind, index: number, nextValue: any) => {
        if (isSavingEdit) return
        setIsSavingEdit(true)
        try {
            if (kind === 'salary') {
                const prev = salaries[index]
                if (prev?.id) await updateSalaryAsync({ salary_id: prev.id, data: nextValue } as any)
                updateFormData({ salaries: replaceAtIndex(salaries, index, { ...prev, ...nextValue }) })
                setEditingChip(null)
                return
            }

            if (kind === 'schedule') {
                const prev = schedules[index]
                if (prev?.id) await updateScheduleAsync({ schedule_id: prev.id, data: nextValue } as any)
                updateFormData({ schedules: replaceAtIndex(schedules, index, { ...prev, ...nextValue }) })
                setEditingChip(null)
                return
            }

            if (kind === 'work') {
                const prev = workExperiences[index]
                if (prev?.id) await updateWorkExperienceAsync({ work_experience_id: prev.id, data: nextValue } as any)
                updateFormData({ work_experiences: replaceAtIndex(workExperiences, index, { ...prev, ...nextValue }) })
                setEditingChip(null)
                return
            }

            if (kind === 'contract') {
                const prev = contracts[index]
                if (prev?.id) await updateContractAsync({ contract_id: prev.id, data: nextValue } as any)
                updateFormData({ contracts: replaceAtIndex(contracts, index, { ...prev, ...nextValue }) })
                setEditingChip(null)
                return
            }

            if (kind === 'education') {
                const prev = educations[index]
                if (prev?.id) await updateEducationAsync({ education_id: prev.id, data: nextValue } as any)
                updateFormData({ educations: replaceAtIndex(educations, index, { ...prev, ...nextValue }) })
                setEditingChip(null)
                return
            }

            const prev = documents[index] as FormDocument
            const docId = (prev as any)?._serverId
            if (docId) await updateDocumentAsync({ documents_id: docId, data: nextValue } as any)
            updateFormData({ documents: replaceAtIndex(documents, index, { ...prev, ...nextValue } as any) })
            setEditingChip(null)
        } catch (error) {
            setFieldErrors([
                buildApiFieldError(error, {
                    row: index + 1,
                    section: kindToSection(kind),
                }),
            ])
        } finally {
            setIsSavingEdit(false)
        }
    }

    return {
        pendingDelete,
        isDeleting,
        editingChip,
        isSavingEdit,
        requestDelete,
        closeDeleteModal,
        getDeleteLabel,
        handleConfirmDelete,
        requestEdit,
        closeEditModal,
        handleSubmitEdit,
    }
}

