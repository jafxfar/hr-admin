'use client'

import { FileText, GraduationCap } from 'lucide-react'

import type { Education } from '@/types/education'
import type { FormDocument, DeleteKind } from '../types'
import { PanelCard, SectionHeader } from '@/components/custom-ui'
import { DocumentChip, EducationChip } from '../../EmployeeChips'
import { useEmployeeForm } from '../../EmployeeFormContext'

export function DocumentsSection({
    educations,
    documents,
    onAddClick,
    onRequestDelete,
    onRequestEdit,
}: {
    educations: Education[]
    documents: FormDocument[]
    onAddClick: (kind: Extract<DeleteKind, 'education' | 'document'>) => void
    onRequestDelete: (kind: DeleteKind, index: number) => void
    onRequestEdit: (kind: DeleteKind, index: number) => void
}) {
    const { hasRowError } = useEmployeeForm()

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <SectionHeader
                    title="Документы"
                    description="Образование, удостоверения личности и прочие документы сотрудника."
                />

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PanelCard
                        title="Образование"
                        icon={<GraduationCap size={18} />}
                        onAdd={() => onAddClick('education')}
                        emptyLabel="Образование не добавлено"
                    >
                        {educations.length > 0 ? (
                            <div>
                                {educations.map((edu, i) => (
                                    <EducationChip
                                        key={i}
                                        edu={edu}
                                        hasError={hasRowError('education', i + 1)}
                                        onRemove={() => onRequestDelete('education', i)}
                                        onView={() => onRequestEdit('education', i)}
                                    />
                                ))}
                            </div>
                        ) : undefined}
                    </PanelCard>

                    <PanelCard
                        title="Юридические документы"
                        icon={<FileText size={18} />}
                        onAdd={() => onAddClick('document')}
                        emptyLabel="Документы не загружены"
                    >
                        {documents.length > 0 ? (
                            <div>
                                {documents.map((doc, i) => (
                                    <DocumentChip
                                        key={i}
                                        doc={doc}
                                        hasError={hasRowError('document', i + 1)}
                                        onRemove={() => onRequestDelete('document', i)}
                                        onView={() => onRequestEdit('document', i)}
                                    />
                                ))}
                            </div>
                        ) : undefined}
                    </PanelCard>
                </div>
            </div>
        </div>
    )
}

