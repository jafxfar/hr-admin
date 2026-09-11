'use client'

import { HRLayout } from '@/components/hr-layout'
import { RewardsSearch, RewardsList } from '@/components/rewards'
import { Suspense, useState } from 'react'
import Loading from '../../components/ui/loading'
import { useRewards, useDeleteRewardMutation, useUnAssignRewardMutation } from '@/hooks/use-rewards'
import { CreateRewardModal } from '@/components/rewards/CreateRewardModal'
import { AssignRewardModal } from '@/components/rewards/AssignRewardModal'
import { EditRewardModal } from '@/components/rewards/EditRewardModal'
import { Award, Gauge, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Reward } from '@/types/rewards'

export default function RewardsPage() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  const [search, setSearch] = useState('')

  // ── Modal state ──
  const [createOpen, setCreateOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignPreselectedId, setAssignPreselectedId] = useState<number | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editReward, setEditReward] = useState<Reward | null>(null)

  const { data, isLoading } = useRewards(page, PAGE_SIZE)
  const deleteMutation = useDeleteRewardMutation()
  const unassignMutation = useUnAssignRewardMutation()

  const filtered = (data?.items ?? []).filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: number) => deleteMutation.mutate(id)

  const handleUnassign = (reward_id: number, user_id: number) =>
    unassignMutation.mutate({ reward_id, user_id })

  const handleAssign = (reward: Reward) => {
    setAssignPreselectedId(reward.id)
    setAssignOpen(true)
  }

  const handleEdit = (reward: Reward) => {
    setEditReward(reward)
    setEditOpen(true)
  }

  return (
    <Suspense fallback={<Loading />}>
      <HRLayout
        title="Награды"
        action={{
          label: 'Добавить награду',
          onClick: () => setCreateOpen(true),
        }}
        topActions={<RewardsSearch value={search} onChange={setSearch} />}
      >
        <div className="admin-content-inset space-y-3">

          <section className="admin-card-grid grid grid-cols-1 md:grid-cols-3">
            <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
              <StatHeader label="Всего наград выдано" icon={Award} />
              <p className="mt-4 text-4xl font-black">1 284</p>
              <p className="mt-2 text-xs text-app-text-muted">
                +12% по сравнению с прошлым кварталом
              </p>
            </div>
            <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
              <StatHeader label="Топ категория" icon={Sparkles} />
              <p className="mt-4 text-4xl font-black">Инновации</p>
            </div>
            <div className="rounded-3xl border border-app-border bg-app-surface-0 p-5 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.45)]">
              <StatHeader label="Индекс признания" icon={Gauge} />
              <p className="mt-4 text-4xl font-black">94%</p>
            </div>
          </section>

          {/* ── Active Rewards ── */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-app-text">Активные награды</h2>
                <p className="text-app-text-muted mt-2 text-sm">Редакционные определения корпоративного превосходства</p>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <RewardsList
                rewards={filtered}
                total={data?.total ?? 0}
                page={data?.page ?? page}
                totalPages={data?.total_pages ?? 1}
                onPageChange={setPage}
                onDelete={handleDelete}
                onUnassign={handleUnassign}
                onAssign={handleAssign}
                onEdit={handleEdit}
              />
            )}
          </section>

        </div>
      </HRLayout>

      {/* ── Modals ── */}
      <CreateRewardModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <AssignRewardModal
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setAssignPreselectedId(null) }}
        preselectedRewardId={assignPreselectedId}
      />

      <EditRewardModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditReward(null) }}
        reward={editReward}
      />
    </Suspense>
  )
}

const StatHeader = ({
  label,
  icon: Icon,
}: {
  label: string
  icon: LucideIcon
}) => (
  <div className="flex items-center justify-between">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-app-text-muted">{label}</p>
    <Icon className="h-4 w-4 text-brand-accent" />
  </div>
)

