'use client'

import { useRef } from 'react'
import { FileText } from 'lucide-react'
import { DarkInput } from '@/components/custom-ui'
import { BaseModal, type ModalMode } from './base-modal'
import { DOCUMENT_CATEGORY_OPTIONS, labelCls, type FormDocument } from './helpers'
import { ModalInlineSelect } from './modal-inline-select'
import { DocumentModalFileZone } from './document-modal-file-zone'
import { useDocumentModalState } from './use-document-modal-state'

export function DocumentModal({
    open,
    onClose,
    onSubmit,
    initial,
    mode = 'create',
    confirmLoading,
}: {
    open: boolean
    onClose: () => void
    onSubmit: (d: FormDocument) => void | Promise<void>
    initial?: FormDocument
    mode?: ModalMode
    confirmLoading?: boolean
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const state = useDocumentModalState(open, mode, initial)

    const handleConfirm = async () => {
        if (confirmLoading) return
        if (!state.selectedRow) return

        await onSubmit({
            ...(initial?._serverId ? { _serverId: initial._serverId } : {}),
            ...(initial?._serverPath ? { _serverPath: initial._serverPath } : {}),
            title: state.title,
            document_type_id: state.selectedRow.id,
            type: state.selectedRow.code,
            file_base64: state.fileBase64,
            filename: state.filename,
            _previewUrl: state.previewUrl,
        } as FormDocument)
        if (mode === 'create') {
            state.reset()
            onClose()
        }
    }

    const handleClose = () => {
        state.reset()
        onClose()
    }

    return (
        <BaseModal
            open={open}
            onClose={handleClose}
            icon={FileText}
            title={mode === 'edit' ? 'Редактировать документ' : 'Добавить документ'}
            subtitle="Загрузите файл для этого сотрудника"
            confirmLabel={mode === 'edit' ? 'Сохранить' : 'Добавить'}
            onConfirm={handleConfirm}
            confirmLoading={confirmLoading}
            confirmDisabled={
                state.typesError || !state.selectedRow || state.typesLoading || state.typeOptionsForCategory.length === 0
            }
        >
            {state.typesLoading ? (
                <p className="text-sm text-app-text-muted">Загрузка типов документов…</p>
            ) : state.typesError ? (
                <p className="text-sm text-destructive" role="alert">
                    {state.typesErrorMessage}
                </p>
            ) : state.typeOptionsForCategory.length === 0 ? (
                <p className="text-sm text-destructive">
                    Нет доступных типов документов. Обратитесь к администратору или проверьте справочник в настройках.
                </p>
            ) : null}
            <div className="grid grid-cols-2 gap-[16px]">
                <div>
                    <label className={labelCls}>Категория <span className="text-brand-accent">*</span></label>
                    <ModalInlineSelect
                        value={state.category}
                        onChange={state.handleCategoryChange}
                        options={DOCUMENT_CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                    />
                </div>
                <div>
                    <label className={labelCls}>Вид документа <span className="text-brand-accent">*</span></label>
                    {state.typeOptionsForCategory.length > 0 ? (
                        <ModalInlineSelect
                            value={state.selectedTypeId}
                            onChange={state.setSelectedTypeId}
                            options={state.typeOptionsForCategory}
                            placeholder="Выберите тип"
                            instanceKey={`doc-types-${state.category}-${state.typeOptionsForCategory.map((o) => o.value).join('.')}`}
                        />
                    ) : (
                        <div
                            className="flex h-12 w-full items-center rounded-full bg-app-surface-1 border border-app-border-accent px-4 text-[13px] text-app-text-muted"
                            aria-hidden
                        >
                            —
                        </div>
                    )}
                </div>
                <div className="col-span-2">
                    <label className={labelCls}>Название</label>
                    <DarkInput placeholder="Название файла" value={state.title} onChange={(e) => state.setTitle(e.target.value)} />
                </div>
            </div>

            <DocumentModalFileZone
                fileInputRef={fileInputRef}
                previewUrl={state.previewUrl}
                filename={state.filename}
                onPickFile={state.handleFile}
            />
        </BaseModal>
    )
}
