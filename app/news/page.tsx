'use client'

import { useState } from 'react'
import { HRLayout } from '@/components/hr-layout'
import Loading from '@/components/ui/loading'
import { NewsTable, NewsModal } from '@/components/news'
import { useNews, useCreateNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } from '@/hooks/use-news'
import type { News, CreateNewsRequest } from '@/types/news'
import { HeaderSearchInput } from '@/components/hr-header-controls'

export default function NewsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const PAGE_SIZE = 20

  const [modalOpen, setModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)

  const { data, isLoading } = useNews(page, PAGE_SIZE)
  const createNewsMutation = useCreateNewsMutation()
  const updateNewsMutation = useUpdateNewsMutation()
  const deleteNewsMutation = useDeleteNewsMutation()

  const news = data?.items ?? []
  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenCreate = () => {
    setEditingNews(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingNews(null)
  }

  const handleConfirm = (data: CreateNewsRequest) => {
    if (editingNews) {
      updateNewsMutation.mutate(
        { news_id: editingNews.id, data },
        { onSuccess: handleClose }
      )
    } else {
      createNewsMutation.mutate(data, { onSuccess: handleClose })
    }
  }

  const handleDelete = (newsItem: News) => {
    deleteNewsMutation.mutate(newsItem.id)
  }

  const isPending = createNewsMutation.isPending || updateNewsMutation.isPending

  return (
    <HRLayout
      title="Новости"
      action={{ label: 'Добавить новость', onClick: handleOpenCreate }}
      topActions={
        <HeaderSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Поиск по названию новости"
          widthClassName="w-72"
        />
      }
    >
      <div className="admin-content-inset space-y-3">
        {isLoading ? (
          <Loading />
        ) : (
          <NewsTable
            news={filteredNews}
            total={data?.total ?? 0}
            page={data?.page ?? page}
            totalPages={data?.total_pages ?? 1}
            onPageChange={setPage}
            onDelete={handleDelete}
            onEdit={handleOpenEdit}
          />
        )}
      </div>

      <NewsModal
        open={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isPending={isPending}
        newsItem={editingNews}
      />
    </HRLayout>
  )
}


