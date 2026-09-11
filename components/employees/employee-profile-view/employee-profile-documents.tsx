'use client'

import { FileText } from 'lucide-react'
import { buildFileUrl } from '@/lib/files'
import { formatProfileDateTime } from '@/lib/employee-profile-format'
import type { Employee } from '@/types/employees'
import type { EmployeeDocumentChecklistItem } from '@/types/employees'
import type { EmployeeDocument } from '@/types/documents'
import { EmployeeProfileSection } from './employee-profile-section'

const resolveHref = (doc: EmployeeDocument): string => {
    if (doc.file_url) return doc.file_url
    if (doc.path) return buildFileUrl(doc.path)
    return ''
}

const categoryLabel: Record<string, string> = {
    main: 'Основные',
    contracts: 'Контракты и акты',
}

function ChecklistItemCard({ item }: { item: EmployeeDocumentChecklistItem }) {
    const category = categoryLabel[item.document_type.category] ?? item.document_type.category

    return (
        <li className="rounded-2xl border border-app-border-accent/50 bg-app-surface-2/50 px-3.5 py-3 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="text-sm font-medium text-app-text">{item.document_type.title}</div>
                <span className="rounded-full bg-app-surface-4 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-app-text-muted">
                    {category}
                </span>
            </div>
            <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
                <span
                    className={`rounded-full px-2 py-0.5 ${
                        item.received ? 'bg-brand-accent/15 text-brand-accent' : 'bg-app-surface-4 text-app-text-muted'
                    }`}
                >
                    {item.received ? 'Получено' : 'Не получено'}
                </span>
                {item.manually_received ? (
                    <span className="rounded-full bg-hr-lilac/15 px-2 py-0.5 text-hr-lilac">Отмечено вручную</span>
                ) : null}
                {item.document_type.allow_received_without_file ? (
                    <span className="rounded-full bg-app-surface-4 px-2 py-0.5 text-app-text-muted">Без файла допустимо</span>
                ) : null}
            </div>
            {item.uploaded_documents?.length ? (
                <ul className="list-none space-y-1 pl-0">
                    {item.uploaded_documents.map((doc) => {
                        const href = resolveHref(doc)
                        const linkText = doc.title?.trim() || doc.type || 'Файл'
                        return (
                            <li key={doc.id}>
                                {href ? (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-sm text-brand-accent hover:underline"
                                    >
                                        {linkText}
                                    </a>
                                ) : (
                                    <span className="text-sm text-app-text-muted">{linkText}</span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <span className="text-xs text-app-text-muted">Файлы не загружены</span>
            )}
        </li>
    )
}

export function EmployeeProfileDocuments({
    employee,
    checklistItems,
}: {
    employee: Employee
    checklistItems: EmployeeDocumentChecklistItem[]
}) {
    const uploadedDocuments = employee.documents ?? []
    const isEmpty = checklistItems.length === 0 && uploadedDocuments.length === 0

    return (
        <EmployeeProfileSection
            title="Документы"
            description="Полный чеклист документов и загруженные файлы."
            isEmpty={isEmpty}
            emptyMessage="Документы отсутствуют."
        >
            <div className="space-y-10">
                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        Чеклист документов
                    </h3>
                    {checklistItems.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {checklistItems.map((item) => (
                                <ChecklistItemCard key={item.document_type.id} item={item} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-app-text-muted">Чеклист пуст.</p>
                    )}
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-app-text-muted">
                        Загруженные файлы
                    </h3>
                    {uploadedDocuments.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-app-border/40">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-app-surface-2 text-xs font-bold uppercase tracking-widest text-app-text-muted">
                                    <tr>
                                        <th className="px-4 py-3">Название</th>
                                        <th className="px-4 py-3">Тип</th>
                                        <th className="px-4 py-3">Дата</th>
                                        <th className="px-4 py-3">Файл</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedDocuments.map((doc) => {
                                        const href = resolveHref(doc)
                                        return (
                                            <tr key={doc.id} className="border-t border-app-border/30">
                                                <td className="px-4 py-3 font-medium text-app-text">{doc.title || '—'}</td>
                                                <td className="px-4 py-3 text-app-text-muted">{doc.type || '—'}</td>
                                                <td className="px-4 py-3 text-app-text-muted">
                                                    {formatProfileDateTime(doc.created_at) ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {href ? (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-brand-accent hover:underline"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Открыть
                                                        </a>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-app-text-muted">Загруженные файлы отсутствуют.</p>
                    )}
                </div>
            </div>
        </EmployeeProfileSection>
    )
}
