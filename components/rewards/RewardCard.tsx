'use client'

import React, { useState } from 'react'
import { Trash2, UserPlus, UserMinus, Award, Pencil } from 'lucide-react'
import type { Reward } from '@/types/rewards'
import { getImageUrl } from '@/lib/utils'
import { getIconByName } from '@/lib/lucide-icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface RewardCardProps {
  reward: Reward
  index?: number
  onDelete?: (id: number) => void
  onUnassign?: (reward_id: number, user_id: number) => void
  onAssign?: (reward: Reward) => void
  onEdit?: (reward: Reward) => void
}

const ACCENT_COLORS = [
  { ring: 'hover:ring-brand-accent/30', icon: 'text-brand-accent', iconBg: 'bg-brand-accent/10', badge: 'text-brand-accent' },
  { ring: 'hover:ring-secondary/30', icon: 'text-secondary', iconBg: 'bg-secondary/10', badge: 'text-secondary' },
  { ring: 'hover:ring-brand-accent/30', icon: 'text-brand-accent', iconBg: 'bg-brand-accent/10', badge: 'text-brand-accent' },
]

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  onDelete,
  onUnassign,
  onAssign,
  onEdit,
  index = 0,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]

  const handleDelete = () => {
    onDelete?.(reward.id)
    setShowDeleteDialog(false)
  }

  const imageUrl = getImageUrl(reward.image_url)
  const DynamicIcon = reward.icon_name ? getIconByName(reward.icon_name) : null

  return (
    <>
      <div className={`bg-app-surface-0 p-8 rounded-xl ring-1 ring-app-border ${accent.ring} transition-all flex flex-col h-full group`}>
        {/* Icon / Image */}
        <div className={`w-12 h-12 rounded-lg ${accent.iconBg} flex items-center justify-center mb-6 shrink-0 overflow-hidden`}>
          {imageUrl ? (
            <img src={imageUrl} alt={reward.title} className="w-full h-full object-cover rounded-lg" />
          ) : DynamicIcon ? (
            <DynamicIcon className={`w-6 h-6 ${accent.icon}`} />
          ) : (
            <Award className={`w-6 h-6 ${accent.icon}`} />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-app-text mb-3 leading-snug">{reward.title}</h3>

        {/* Description */}
        <p className="text-app-text-muted text-sm leading-relaxed mb-6 grow">
          {reward.description || 'Описание не указано'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {/* Status badge */}
          {reward.user_id ? (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              Назначена
            </div>
          ) : (
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${accent.badge}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${accent.iconBg}`} />
              Свободна
            </div>
          )}

          {/* Actions — visible on hover */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Edit */}
            <button
              onClick={() => onEdit?.(reward)}
              className="w-8 h-8 rounded-full bg-app-surface-2 text-app-text-muted flex items-center justify-center hover:bg-app-surface-3 hover:text-app-text transition-colors"
              title="Редактировать"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Assign / Unassign */}
            {reward.user_id ? (
              <button
                onClick={() => onUnassign?.(reward.id, reward.user_id!)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-colors"
              >
                <UserMinus className="w-3.5 h-3.5" />
                Отвязать
              </button>
            ) : (
              <button
                onClick={() => onAssign?.(reward)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${accent.iconBg} ${accent.icon} text-xs font-bold hover:opacity-80 transition-opacity`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Назначить
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить награду?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить награду &quot;{reward.title}&quot;? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
