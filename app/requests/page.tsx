'use client'

import { useState, useMemo } from 'react'
import { HRLayout } from '@/components/hr-layout'
import { RequestsFilters, RequestsTable } from '@/components/requests'
import { useRequests } from '@/hooks/use-requests'
import Loading from '@/components/ui/loading'
import { RequestType, RequestStatus } from '@/types/request'

export default function RequestsPage() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  const { data, isLoading } = useRequests(page, PAGE_SIZE)

  const requests = data?.items ?? []

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<RequestType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!r.title?.toLowerCase().includes(q) && !r.body?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [requests, search, typeFilter, statusFilter])

  return (
    <HRLayout
      title="Заявки"
      topActions={
        <RequestsFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      }
    >
      <div className="admin-content-inset space-y-3">
        {isLoading ? (
          <Loading />
        ) : (
          <RequestsTable
            requests={filtered}
            total={data?.total ?? 0}
            page={data?.page ?? page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={setPage}
          />
        )}
      </div>
    </HRLayout>
  )
}

