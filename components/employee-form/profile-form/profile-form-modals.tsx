'use client'

import type { Contract } from '@/types/contracts'
import type { Education } from '@/types/education'
import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import type { WorkExperience } from '@/types/workExperience'
import { Modal, ModalHeader, ModalActions } from '@/components/custom-ui/modal'
import {
    SalaryModal,
    ScheduleModal,
    WorkExpModal,
    ContractModal,
    EducationModal,
    DocumentModal,
} from '../employee-modals'
import type { DeleteKind, FormDocument } from './types'
import type { useProfileChips } from './use-profile-chips'

type ChipsApi = ReturnType<typeof useProfileChips>

export function ProfileFormModals({
    openModal,
    onCloseCreateModal,
    salaries,
    schedules,
    workExperiences,
    contracts,
    educations,
    documents,
    onAddSalary,
    onAddSchedule,
    onAddWorkExperience,
    onAddContract,
    onAddEducation,
    onAddDocument,
    chips,
}: {
    openModal: DeleteKind | null
    onCloseCreateModal: () => void
    salaries: Salary[]
    schedules: Schedule[]
    workExperiences: WorkExperience[]
    contracts: Contract[]
    educations: Education[]
    documents: FormDocument[]
    onAddSalary: (s: Salary) => void
    onAddSchedule: (s: Schedule) => void
    onAddWorkExperience: (w: WorkExperience) => void
    onAddContract: (c: Contract) => void
    onAddEducation: (e: Education) => void
    onAddDocument: (d: FormDocument) => void
    chips: ChipsApi
}) {
    return (
        <>
            <SalaryModal open={openModal === 'salary'} onClose={onCloseCreateModal} onSubmit={onAddSalary} mode="create" />
            <ScheduleModal open={openModal === 'schedule'} onClose={onCloseCreateModal} onSubmit={onAddSchedule} mode="create" />
            <WorkExpModal open={openModal === 'work'} onClose={onCloseCreateModal} onSubmit={onAddWorkExperience} mode="create" />
            <ContractModal open={openModal === 'contract'} onClose={onCloseCreateModal} onSubmit={onAddContract} mode="create" />
            <EducationModal open={openModal === 'education'} onClose={onCloseCreateModal} onSubmit={onAddEducation} mode="create" />
            <DocumentModal open={openModal === 'document'} onClose={onCloseCreateModal} onSubmit={onAddDocument} mode="create" />

            <SalaryModal
                open={chips.editingChip?.kind === 'salary'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'salary' ? salaries[chips.editingChip.index] : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('salary', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />
            <ScheduleModal
                open={chips.editingChip?.kind === 'schedule'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'schedule' ? schedules[chips.editingChip.index] : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('schedule', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />
            <WorkExpModal
                open={chips.editingChip?.kind === 'work'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'work' ? workExperiences[chips.editingChip.index] : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('work', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />
            <ContractModal
                open={chips.editingChip?.kind === 'contract'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'contract' ? contracts[chips.editingChip.index] : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('contract', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />
            <EducationModal
                open={chips.editingChip?.kind === 'education'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'education' ? educations[chips.editingChip.index] : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('education', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />
            <DocumentModal
                key={
                    chips.editingChip?.kind === 'document'
                        ? `document-edit-${chips.editingChip.index}`
                        : 'document-edit-closed'
                }
                open={chips.editingChip?.kind === 'document'}
                onClose={chips.closeEditModal}
                initial={chips.editingChip?.kind === 'document' ? (documents[chips.editingChip.index] as FormDocument) : undefined}
                onSubmit={(next) => chips.handleSubmitEdit('document', chips.editingChip?.index ?? 0, next)}
                mode="edit"
                confirmLoading={chips.isSavingEdit}
            />

            <Modal open={chips.pendingDelete !== null} onClose={chips.closeDeleteModal}>
                <ModalHeader
                    title="Подтвердите удаление"
                    subtitle={
                        chips.pendingDelete
                            ? `Вы действительно хотите удалить ${chips.getDeleteLabel(chips.pendingDelete.kind)}?`
                            : undefined
                    }
                    onClose={chips.closeDeleteModal}
                />
                <div className="text-app-text-muted text-[13px] leading-relaxed">Запись будет удалена. Это действие нельзя отменить.</div>
                <ModalActions
                    onCancel={chips.closeDeleteModal}
                    onConfirm={chips.handleConfirmDelete}
                    confirmLabel="Удалить"
                    confirmDisabled={chips.pendingDelete === null}
                    confirmLoading={chips.isDeleting}
                    confirmLoadingLabel="Удаление…"
                />
            </Modal>
        </>
    )
}
