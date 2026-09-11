'use client'

import { Paperclip, FolderOpen } from 'lucide-react'
import type { RefObject } from 'react'
import { isImage, labelCls } from './helpers'

export function DocumentModalFileZone({
    fileInputRef,
    previewUrl,
    filename,
    onPickFile,
}: {
    fileInputRef: RefObject<HTMLInputElement | null>
    previewUrl: string
    filename: string
    onPickFile: (file: File) => void
}) {
    return (
        <div>
            <label className={labelCls}>Файл</label>
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) onPickFile(f)
                }}
            />

            {previewUrl ? (
                <div className="bg-app-surface-0 rounded-[16px] overflow-hidden">
                    {isImage(previewUrl) ? (
                        <img src={previewUrl} alt={filename} className="w-full max-h-[160px] object-contain p-[8px]" />
                    ) : (
                        <div className="flex items-center gap-[12px] px-[16px] py-[14px]">
                            <Paperclip size={22} className="text-app-text-muted shrink-0" />
                            <span className="text-app-text-muted text-[13px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{filename}</span>
                        </div>
                    )}
                    <div className="border-t border-[rgba(67,73,51,0.3)] px-[16px] py-[8px] flex justify-end">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-transparent border-none text-app-text-muted text-[12px] cursor-pointer"
                        >
                            Заменить файл
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-app-border-accent rounded-[16px] p-[28px] text-center cursor-pointer transition-colors duration-200 hover:border-brand-accent"
                >
                    <div className="flex justify-center mb-[8px] text-app-border-accent">
                        <FolderOpen size={28} />
                    </div>
                    <p className="text-app-text-muted text-[13px]">Выберите или перетащите файл</p>
                    <p className="text-app-border-accent text-xs font-medium mt-[4px]">JPEG, PNG, PDF или DOCX до 5 МБ</p>
                </div>
            )}
        </div>
    )
}
