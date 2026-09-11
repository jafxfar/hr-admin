'use client'

import { Plus, UserCircle2, Users } from 'lucide-react'
import type { CSSProperties } from 'react'
import {
 Handle,
 Position,
 NodeToolbar,
 type NodeTypes,
} from 'reactflow'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buildFileUrl } from '@/lib/files'
import {
 cssColorFromDepartmentIcon,
 getDeptName,
 getFullName,
 getInitials,
 isLikelyDarkBackground,
} from '@/lib/org-structure-utils'
import type { Department } from '@/types/departments'

export interface DepartmentNodeData {
 dept: Department
 isSelected: boolean
 childCount: number
 onSelect: (dept: Department) => void
 onAddChild: () => void
}

function DepartmentNode({ data }: { data: DepartmentNodeData }) {
 const { dept, isSelected, childCount, onSelect, onAddChild } = data
 const isRoot = (dept.level ?? 0) === 0
 const headUser = dept.head_user ?? null
 const fullName = getFullName(headUser)
 const initials = getInitials(headUser)
 const hasHead = !!headUser
 const headPhotoUrl = headUser?.profile_photo_url && headUser.exists !== false
 ? buildFileUrl(headUser.profile_photo_url)
 : undefined
 const serverBgColor = cssColorFromDepartmentIcon(dept.icon)
 const cardBackgroundStyle: CSSProperties | undefined = serverBgColor
 ? { backgroundColor: serverBgColor }
 : isRoot
 ? { background: 'rgb(var(--theme-primary-rgb) / 0.12)' }
 : undefined
 const titleClass =
 serverBgColor != null
 ? isLikelyDarkBackground(serverBgColor)
 ? 'text-white'
 : 'text-app-text'
 : isRoot
 ? 'text-brand-accent'
 : 'text-app-text'

 return (
 <div className="relative group">
 <NodeToolbar
 position={Position.Bottom}
 offset={6}
 isVisible={true}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
 >
 <button
 onClick={(e) => { e.stopPropagation(); onAddChild() }}
 title="Добавить подотдел"
 style={{
 width: 28,
 height: 28,
 borderRadius: '50%',
 background: 'var(--brand-accent)',
 color: 'var(--app-surface-0)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 boxShadow: '0 0 14px rgb(var(--theme-primary-rgb) / 0.5)',
 border: '2px solid var(--app-surface-0)',
 cursor: 'pointer',
 transition: 'transform 0.15s',
 }}
 onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
 onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
 >
 <Plus style={{ width: 14, height: 14 }} />
 </button>
 </NodeToolbar>

 {!isRoot && (
 <Handle
 type="target"
 position={Position.Top}
 style={{ background: 'var(--brand-accent)', width: 8, height: 8, border: '2px solid var(--app-surface-0)' }}
 />
 )}

 <div
 onClick={() => onSelect(dept)}
 style={cardBackgroundStyle}
 className={`
 w-55 rounded-2xl p-4 cursor-pointer transition-all duration-200
 ${serverBgColor != null
 ? isRoot
 ? 'border-2 border-brand-accent shadow-[0_0_24px_rgb(var(--theme-primary-rgb) / 0.25)]'
 : isSelected
 ? 'border-2 border-brand-accent shadow-[0_0_18px_rgb(var(--theme-primary-rgb) / 0.18)]'
 : 'border border-app-surface-3 hover:border-brand-accent/50'
 : isRoot
 ? 'border-2 border-brand-accent shadow-[0_0_24px_rgb(var(--theme-primary-rgb) / 0.25)]'
 : isSelected
 ? 'bg-app-surface-3 border-2 border-brand-accent shadow-[0_0_18px_rgb(var(--theme-primary-rgb) / 0.18)]'
 : 'bg-app-surface-3 border border-app-surface-3 hover:border-brand-accent/50 hover:bg-app-surface-2'
 }
 `}
 >
 <div className="flex items-center justify-between mb-3">
 <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full
 ${isRoot ? 'bg-brand-accent text-app-surface-0' : 'bg-app-surface-3 text-app-text-muted'}`}>
 </span>
 {isSelected && !isRoot && (
 <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_6px_rgb(var(--theme-primary-rgb) / 0.8)]" />
 )}
 </div>

 <h3 className={`font-bold leading-snug mb-1 line-clamp-2 ${titleClass}`}>
 {getDeptName(dept)}
 </h3>

 {dept.description && (
 <p className="text-xs font-medium text-app-text-muted mb-3 line-clamp-1">{dept.description}</p>
 )}

 <div className="flex items-center gap-2 p-2 rounded-2xl bg-app-surface-0 mt-2">
 <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0
 ${isRoot ? 'bg-brand-accent text-app-surface-0' : 'bg-app-surface-3 text-app-text'}`}>
 {hasHead ? (
 <Avatar className="w-full vf- h-full">
 <AvatarImage src={headPhotoUrl ?? '/default-avatar.png'} alt={fullName} className="object-cover" />
 <AvatarFallback className={`text-xs font-bold ${isRoot ? 'bg-brand-accent text-app-surface-0' : 'bg-app-surface-3 text-app-text'}`}>
 {initials}
 </AvatarFallback>
 </Avatar>
 ) : (
 <UserCircle2 className="w-4 h-4 text-app-text-muted" />
 )}
 </div>

 <div className="flex flex-col min-w-0 flex-1">
 <span className="text-[6px] font-bold uppercase tracking-widest text-app-text-muted">Руководитель</span>
 <span className={`text-xs font-bold leading-tight line-clamp-3 ${hasHead ? 'text-app-text' : 'text-app-text-muted'}`}>
 {fullName}
 </span>
 </div>

 <div className="flex flex-col items-end shrink-0">
 <span className="text-xs font-black uppercase tracking-widest text-app-text-muted" aria-label="Сотрудники">
 <Users className="w-2.5 h-2.5" />
 </span>
 <span className="text-xs font-black text-brand-accent">{childCount}</span>
 </div>
 </div>
 </div>


 <Handle
 type="source"
 position={Position.Bottom}
 style={{ background: 'var(--brand-accent)', width: 8, height: 8, border: '2px solid var(--app-surface-0)' }}
 />
 </div>
 )
}

export const nodeTypes: NodeTypes = { department: DepartmentNode }