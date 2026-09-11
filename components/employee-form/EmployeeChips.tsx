import type { ReactNode } from 'react'
import {
    X,
    Banknote,
    Clock,
    Briefcase,
    FileText,
    GraduationCap,
    ExternalLink,
    Image as ImageIcon,
} from 'lucide-react'

import type { Salary } from '@/types/salary'
import type { Schedule } from '@/types/schedule'
import type { Document } from '@/types/documents'
import { useActiveDocumentTypesQuery } from '@/hooks/use-document-types'
import { resolveDocumentTypeTitle } from '@/lib/document-type-display'
import type { Contract } from '@/types/contracts'
import type { Education } from '@/types/education'
import type { WorkExperience } from '@/types/workExperience'


const FILES_BASE = (process.env.NEXT_PUBLIC_FILES_URL ?? 'http://localhost:8000/uploads').replace(/\/$/, '')

function buildFileUrl(serverPath: string): string {
    const clean = serverPath
        .replace(/^\/+/, '')       // strip leading slashes
        .replace(/^uploads\//, '') // strip "uploads/" prefix to avoid duplication
    return `${FILES_BASE}/${clean}`
}

const isImage = (src: string) =>
    src.startsWith('data:image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(src)

const degreeLabel: Record<string, string> = {
    bachelor: 'Бакалавриат',
    master: 'Магистратура',
    phd: 'Докторантура',
    other: 'Другое',
}

type FormDocument = Document & {
    _serverId?: number
    _serverPath?: string
    _previewUrl?: string
}

interface ChipCardProps {
    /** Icon shown on the left side of the chip */
    icon: ReactNode
    /** Primary text */
    title: ReactNode
    /** Secondary / subtitle text */
    subtitle?: ReactNode
    /** Optional accent colour for the left border — passed as inline style since it's dynamic */
    accentColor?: string
    /** Background colour override — passed as inline style since it's dynamic */
    bg?: string
    /** Extra actions rendered between the text block and the remove button */
    actions?: ReactNode
    /** Открыть модальное окно просмотра (клик по основной области чипа) */
    onView?: () => void
    onRemove: () => void
    hasError?: boolean
}

function ChipCard({
    icon,
    title,
    subtitle,
    accentColor,
    bg = 'var(--app-surface-2)',
    actions,
    onView,
    onRemove,
    hasError = false,
}: ChipCardProps) {
    const iconSlot = (
        <div className="w-[36px] h-[36px] rounded-full bg-app-surface-4 flex items-center justify-center shrink-0 overflow-hidden text-app-text-muted">
            {icon}
        </div>
    )
    const textBlock = (
        <div className="flex-1 min-w-0">
            <div className="text-[#ffffff] font-bold text-[13px] overflow-hidden text-ellipsis whitespace-nowrap">
                {title}
            </div>
            {subtitle ? (
                <div className="text-app-text-muted text-xs font-medium mt-[2px] overflow-hidden text-ellipsis">{subtitle}</div>
            ) : null}
        </div>
    )

    return (
        <div
            className={[
                'flex items-center gap-[12px] rounded-[14px] px-[14px] py-[10px] mb-[8px]',
                hasError ? 'border border-red-500/60 bg-red-500/10' : '',
            ].join(' ')}
            style={{
                background: hasError ? undefined : bg,
                ...(accentColor && !hasError ? { borderLeft: `3px solid ${accentColor}` } : {}),
            }}
        >
            {onView ? (
                <button
                    type="button"
                    className="flex flex-1 min-w-0 items-center gap-[12px] bg-transparent border-none p-0 cursor-pointer text-left rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface-2)]"
                    onClick={onView}
                    aria-label="Просмотр записи"
                >
                    {iconSlot}
                    {textBlock}
                </button>
            ) : (
                <>
                    {iconSlot}
                    {textBlock}
                </>
            )}

            {actions}

            <button
                type="button"
                onClick={onRemove}
                className="bg-transparent border-none text-app-text-muted cursor-pointer p-[4px] shrink-0 flex items-center rounded-[8px] hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent/50"
                aria-label="Удалить запись"
            >
                <X size={14} />
            </button>
        </div>
    )
}


export function SalaryChip({ sal, onRemove, onView, hasError }: { sal: Salary; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    return (
        <ChipCard
            icon={<Banknote size={18} />}
            onView={onView}
            hasError={hasError}
            title={
                <>
                    <span className="text-[15px]">{sal.amount.toLocaleString()} {sal.currency}</span>
                    {sal.prepaid_percent != null && (
                        <span className="text-app-text-muted text-xs font-medium ml-[8px]">
                            аванс {sal.prepaid_percent}%
                        </span>
                    )}
                </>
            }
            onRemove={onRemove}
        />
    )
}

export function ScheduleChip({ s, onRemove, onView, hasError }: { s: Schedule; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    const label = `${s.days_per_week} дн / ${s.hours_per_day} ч`
    const sub = (s.details as any)?.note ?? (s.days_per_week === 5 ? 'Пн–Пт' : `${s.days_per_week} дн/нед`)
    return (
        <ChipCard
            onView={onView}
            hasError={hasError}
            bg="var(--app-surface-0)"
            accentColor="var(--brand-accent)"
            icon={<Clock size={18} />}
            title={<span className="text-[14px]">{label}</span>}
            subtitle={<span className="uppercase tracking-[0.06em]">{sub}</span>}
            onRemove={onRemove}
        />
    )
}

export function WorkExpChip({ exp, onRemove, onView, hasError }: { exp: WorkExperience; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    return (
        <ChipCard
            onView={onView}
            hasError={hasError}
            icon={<Briefcase size={18} />}
            title={exp.company}
            subtitle={exp.position || 'Должность не указана'}
            onRemove={onRemove}
        />
    )
}

export function ContractChip({ c, onRemove, onView, hasError }: { c: Contract; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    const typeLabel: Record<string, string> = {
        full_time: 'Полная',
        part_time: 'Частичная',
        contractor: 'Подрядчик',
    }
    return (
        <ChipCard
            onView={onView}
            hasError={hasError}
            icon={<FileText size={18} />}
            title={
                <span className="text-secondary">
                    {typeLabel[c.type] ?? c.type}
                </span>
            }
            subtitle={
                c.started_at
                    ? `${c.started_at}${c.ended_at ? ` → ${c.ended_at}` : ''}`
                    : undefined
            }
            onRemove={onRemove}
        />
    )
}

export function EducationChip({ edu, onRemove, onView, hasError }: { edu: Education; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    return (
        <ChipCard
            onView={onView}
            hasError={hasError}
            icon={<GraduationCap size={18} className="text-brand-accent" />}
            title={edu.institution}
            subtitle={
                (degreeLabel[edu.degree] ?? edu.degree) +
                (edu.specialization ? ` · ${edu.specialization}` : '')
            }
            onRemove={onRemove}
        />
    )
}

export function DocumentChip({ doc, onRemove, onView, hasError }: { doc: FormDocument; onRemove: () => void; onView?: () => void; hasError?: boolean }) {
    const { data: docTypeCatalog } = useActiveDocumentTypesQuery()
    const typeLabel = resolveDocumentTypeTitle(docTypeCatalog?.items, doc)
    const name = doc.filename || doc.title || 'Документ'
    const hasPreview = !!(doc._previewUrl || doc._serverPath)
    const previewSrc = doc._previewUrl || (doc._serverPath ? buildFileUrl(doc._serverPath) : '')

    const iconNode = hasPreview && isImage(previewSrc) ? (
        <img src={previewSrc} alt={name} className="w-full h-full object-cover" />
    ) : (
        <ImageIcon size={18} />
    )

    return (
        <ChipCard
            onView={onView}
            hasError={hasError}
            icon={iconNode}
            title={doc.title || name}
            subtitle={typeLabel + (doc.filename ? ` · ${doc.filename}` : '')}
            actions={
                doc._serverPath ? (
                    <a
                        href={buildFileUrl(doc._serverPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-accent shrink-0 flex items-center p-[4px] rounded-[8px] hover:bg-app-surface-4"
                        aria-label="Открыть файл в новой вкладке"
                        onClick={e => e.stopPropagation()}
                    >
                        <ExternalLink size={14} />
                    </a>
                ) : undefined
            }
            onRemove={onRemove}
        />
    )
}