'use client'

import { useState } from 'react'

import type { WorkExperience } from '@/types/workExperience'
import type { Salary } from '@/types/salary'
import type { Contract } from '@/types/contracts'
import type { Schedule } from '@/types/schedule'
import type { Education } from '@/types/education'

import { useEmployeeForm } from '../EmployeeFormContext'
import { AvatarCropDialog } from '../AvatarCropDialog'

import { normalizeOptionalId } from './constants'
import { ProfileFormModals } from './profile-form-modals'
import { ContactsSection } from './sections/contacts-section'
import { DocumentsSection } from './sections/documents-section'
import { EmergencyContactsSection } from './sections/emergency-contacts-section'
import { PersonalIdentitySection } from './sections/personal-identity-section'
import { PositionSection } from './sections/position-section'
import { RoleStatusSection } from './sections/role-status-section'
import { TerminationSection } from './sections/termination-section'
import { WorkConditionsSection } from './sections/work-conditions-section'
import type { DeleteKind, FormDocument } from './types'
import { usePositionChangeBasis } from './use-position-change-basis'
import { useProfileChips } from './use-profile-chips'
import { useProfilePhoto } from './use-profile-photo'
import { employeeFormFieldsScopeStyle } from './styles'

export function ProfileForm({ isNew = false, employeeId }: { isNew?: boolean; employeeId?: number }) {
    const { formData, initialFormData, updateFormData, setFieldErrors } = useEmployeeForm()
    const [openModal, setOpenModal] = useState<DeleteKind | null>(null)

    const photo = useProfilePhoto({ employeeId: isNew ? undefined : employeeId })

    const salaries = (formData.salaries ?? []) as Salary[]
    const workExperiences = (formData.work_experiences ?? []) as WorkExperience[]
    const contracts = (formData.contracts ?? []) as Contract[]
    const schedules = (formData.schedules ?? []) as Schedule[]
    const educations = (formData.educations ?? []) as Education[]
    const documents = (formData.documents ?? []) as FormDocument[]

    const addSalary = (s: Salary) => updateFormData({ salaries: [...salaries, s] })
    const addWorkExperience = (w: WorkExperience) => updateFormData({ work_experiences: [...workExperiences, w] })
    const addContract = (c: Contract) => updateFormData({ contracts: [...contracts, c] })
    const addSchedule = (s: Schedule) => updateFormData({ schedules: [...schedules, s] })
    const addEducation = (e: Education) => updateFormData({ educations: [...educations, e] })
    const addDocument = (d: FormDocument) => updateFormData({ documents: [...documents, d] })

    const chips = useProfileChips({
        salaries,
        schedules,
        workExperiences,
        contracts,
        educations,
        documents,
        updateFormData,
        setFieldErrors,
    })

    const hasPositionOrDepartmentChange =
        !isNew &&
        (normalizeOptionalId(formData.department_id) !== normalizeOptionalId(initialFormData.department_id) ||
            normalizeOptionalId(formData.position_id) !== normalizeOptionalId(initialFormData.position_id))

    const positionChange = usePositionChangeBasis(hasPositionOrDepartmentChange)

    return (
        <div className="employee-profile-form space-y-12" style={employeeFormFieldsScopeStyle}>
            <div className="space-y-12">
                <PersonalIdentitySection
                    photoInputRef={photo.photoInputRef}
                    photoSrc={photo.photoSrc}
                    onPhotoSelect={photo.handlePhotoChange}
                    onPhotoRemove={() => void photo.handlePhotoRemove()}
                    isRemovingPhoto={photo.isRemovingPhoto}
                />
                <ContactsSection isNew={isNew} />
                <RoleStatusSection />
                {!isNew ? <TerminationSection /> : null}
                <EmergencyContactsSection />
            </div>

            <div className="space-y-12 max-w-6xl mx-auto">
                <PositionSection
                    hasPositionOrDepartmentChange={hasPositionOrDepartmentChange}
                    positionChangeBasisInputRef={positionChange.positionChangeBasisInputRef}
                    positionChangeFileError={positionChange.positionChangeFileError}
                    onBasisFile={positionChange.handlePositionChangeBasisFile}
                />
                <WorkConditionsSection
                    schedules={schedules}
                    salaries={salaries}
                    workExperiences={workExperiences}
                    contracts={contracts}
                    onAddClick={(kind) => setOpenModal(kind)}
                    onRequestDelete={chips.requestDelete}
                    onRequestEdit={chips.requestEdit}
                />
            </div>

            <DocumentsSection
                educations={educations}
                documents={documents}
                onAddClick={(kind) => setOpenModal(kind)}
                onRequestDelete={chips.requestDelete}
                onRequestEdit={chips.requestEdit}
            />

            <ProfileFormModals
                openModal={openModal}
                onCloseCreateModal={() => setOpenModal(null)}
                salaries={salaries}
                schedules={schedules}
                workExperiences={workExperiences}
                contracts={contracts}
                educations={educations}
                documents={documents}
                onAddSalary={addSalary}
                onAddSchedule={addSchedule}
                onAddWorkExperience={addWorkExperience}
                onAddContract={addContract}
                onAddEducation={addEducation}
                onAddDocument={addDocument}
                chips={chips}
            />

            <AvatarCropDialog
                open={photo.isCropOpen}
                imageSrc={photo.pendingPhotoSrc}
                onClose={photo.handleCropClose}
                onSave={photo.handleCropSave}
            />
        </div>
    )
}
