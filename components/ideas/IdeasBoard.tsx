/**
 * Компонент доски идей — макет по index.html:
 * левый сайдбар с фильтром статусов + правый контент с сеткой карточек
 */

'use client'

import { Idea, IdeaStatus } from '@/types/idea'
import { IdeaCard } from './IdeaCard'
import { IdeaBanner } from './IdeaBanner'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface IdeasBoardProps {
 ideas: Idea[]
 total: number
 page: number
 totalPages: number
 activeStatus: IdeaStatus | 'all'
 onPageChange: (page: number) => void
 onStatusChange: (status: IdeaStatus | 'all') => void
 onDelete?: (id: number) => void
 onChangeStatus?: (id: number, status: IdeaStatus) => void
 trendingIdea?: Idea | null
}

const FILTER_TABS: { value: IdeaStatus | 'all'; label: string }[] = [
 { value: 'all', label: 'Все идеи' },
 { value: IdeaStatus.IN_TALK, label: 'Идёт обсуждение' },
 { value: IdeaStatus.ACCEPTED, label: 'Принята' },
 { value: IdeaStatus.REJECTED, label: 'Отклонена' },
 { value: IdeaStatus.CANCELED, label: 'Отменена' },
]

export function IdeasBoard({
 ideas,
 total,
 page,
 totalPages,
 activeStatus,
 onPageChange,
 onStatusChange,
 onDelete,
 onChangeStatus,
 trendingIdea,
}: IdeasBoardProps) {
 const allIdeas = ideas

 const countFor = (status: IdeaStatus | 'all') =>
 status === 'all'
 ? allIdeas.length
 : allIdeas.filter((i) => i.status === status).length

 const filtered =
 activeStatus === 'all'
 ? allIdeas
 : allIdeas.filter((i) => i.status === activeStatus)

 return (
 <div className="admin-card-grid grid grid-cols-12 pt-2">
 {/* ── Left filter sidebar ── */}
 <aside className="col-span-3 flex flex-col gap-3">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-app-text-muted mb-4 flex items-center gap-2">
 <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
 Фильтр по статусу
 </h3>
 <div className="flex flex-col gap-1.5">
 {FILTER_TABS.map((tab) => {
 const isActive = activeStatus === tab.value
 const count = countFor(tab.value)
 return (
 <button
 key={tab.value}
 onClick={() => onStatusChange(tab.value)}
 className={`flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer transition-colors border border-transparent
 ${isActive
 ? 'bg-app-surface-0 text-on-surface font-bold border-app-border shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]'
 : 'hover:bg-app-surface-1 text-app-text-muted'
 }`}
 >
 {tab.label}
 {count > 0 ? (
 <span
 className={`text-xs px-2 py-0.5 rounded-full font-bold
 ${isActive ? 'bg-brand-accent text-brand-accent-on' : 'opacity-60'}`}
 >
 {String(count).padStart(2, '0')}
 </span>
 ) : (
 <span className="text-xs font-medium opacity-40">00</span>
 )}
 </button>
 )
 })}
 </div>
 </div>
 </aside>

 {/* ── Right content area ── */}
 <div className="col-span-9 flex flex-col gap-3">
 {/* Trending banner */}
 {trendingIdea && <IdeaBanner idea={trendingIdea} />}

 {filtered.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 text-center">
 <div className="w-14 h-14 rounded-full bg-app-surface-1 flex items-center justify-center mb-4 border border-app-border">
 <span className="text-2xl">💡</span>
 </div>
 <p className="text-on-surface font-bold mb-1">Идей пока нет</p>
 <p className="text-[13px] text-app-text-muted">Здесь появятся идеи сотрудников</p>
 </div>
 ) : (
 <>
 <div className="admin-card-grid grid grid-cols-2">
 {filtered.map((idea) => (
 <IdeaCard
 key={idea.id}
 idea={idea}
 onDelete={onDelete}
 onChangeStatus={onChangeStatus}
 />
 ))}
 </div>
 <PaginationControls
 page={page}
 totalPages={totalPages}
 total={total}
 entityLabel="идей"
 onPageChange={onPageChange}
 />
 </>
 )}
 </div>
 </div>
 )
}