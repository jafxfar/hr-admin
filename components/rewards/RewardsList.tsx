import React from 'react'
import { RewardCard } from './RewardCard'
import type { Reward } from '@/types/rewards'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Trophy } from 'lucide-react'

interface RewardsListProps {
  rewards: Reward[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete?: (id: number) => void
  onUnassign?: (reward_id: number, user_id: number) => void
  onAssign?: (reward: Reward) => void
  onEdit?: (reward: Reward) => void
}

export const RewardsList: React.FC<RewardsListProps> = ({
  rewards,
  total,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onUnassign,
  onAssign,
  onEdit,
}) => {
  if (rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-app-text-muted">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-app-surface-2">
          <Trophy className="h-7 w-7 text-amber-400" />
        </div>
        <p className="text-sm">Награды не найдены</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="admin-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward, index) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            index={index}
            onDelete={onDelete}
            onUnassign={onUnassign}
            onAssign={onAssign}
            onEdit={onEdit}
          />
        ))}
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        entityLabel="наград"
        onPageChange={onPageChange}
      />
    </div>
  )
}
