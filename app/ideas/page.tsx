'use client'

import { HRLayout } from '@/components/hr-layout'
import { Suspense, useState } from 'react'
import Loading from '../../components/ui/loading'
import { useIdeas, useDeleteIdeaMutation, useUpdateIdeaMutation, useTrendingIdea } from '@/hooks/use-ideas'
import { IdeasBoard } from '@/components/ideas'
import { IdeaStatus } from '@/types/idea'
import { HeaderSearchInput } from '@/components/hr-header-controls'

export default function IdeasPage() {
  const [page, setPage] = useState(1)
  const [activeStatus, setActiveStatus] = useState<IdeaStatus | 'all'>('all')
  const PAGE_SIZE = 20
  const [search, setSearch] = useState('')
  const { data, isLoading } = useIdeas(page, PAGE_SIZE)
  const { data: trendingIdea } = useTrendingIdea()
  const deleteMutation = useDeleteIdeaMutation()
  const updateMutation = useUpdateIdeaMutation()

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleChangeStatus = (id: number, status: IdeaStatus) => {
    updateMutation.mutate({ idea_id: id, data: { status } })
  }

  const handleStatusChange = (status: IdeaStatus | 'all') => {
    setActiveStatus(status)
    setPage(1)
  }

  return (
    <HRLayout
      title="Идеи"
      topActions={
        <HeaderSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Поиск по идеям..."
          widthClassName="w-64"
        />
      }
    >
      <Suspense fallback={<Loading />}>
        <div className="admin-content-inset">
          {isLoading ? (
            <Loading />
          ) : (
            <IdeasBoard
              ideas={data?.items ?? []}
              total={data?.total ?? 0}
              page={data?.page ?? page}
              totalPages={data?.total_pages ?? 1}
              activeStatus={activeStatus}
              onPageChange={setPage}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              trendingIdea={trendingIdea ?? null}
            />
          )}
        </div>
      </Suspense>
    </HRLayout>
  )
}


