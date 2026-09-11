'use client'

import { useParams, useRouter } from 'next/navigation'
import { HRLayout } from '@/components/hr-layout'
import { NewsCommentsSection, NewsDetailContent, NewsReactionsBar } from '@/components/news'
import { useNewsDetailPage } from '@/hooks/use-news-detail-page'
import Loading from '@/components/ui/loading'
import {  ArrowLeftIcon } from 'lucide-react'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = Number(params.id)

  const {
    newsItem,
    isNewsLoading,
    commentText,
    setCommentText,
    isReacting,
    isRemoving,
    isSubmitting,
    handleReaction,
    handleSubmitComment,
  } = useNewsDetailPage(newsId)

  if (isNewsLoading) {
    return (
      <HRLayout title="Новость">
        <Loading />
      </HRLayout>
    )
  }

  if (!newsItem) {
    return (
      <HRLayout title="Новость">
        <div className="p-8 text-center text-[#6B7280]">Новость не найдена</div>
      </HRLayout>
    )
  }

  return (
    <HRLayout
      title={newsItem.title}
      action={{
        icon: <ArrowLeftIcon size={24} />,
        label: 'Назад',
        onClick: () => router.push('/news'),
      }}
    >
      <div className="p-4 max-w-3xl mx-auto space-y-6">
        <NewsDetailContent newsItem={newsItem} />

        <NewsReactionsBar
          newsItem={newsItem}
          isReacting={isReacting}
          isRemoving={isRemoving}
          onReaction={handleReaction}
        />

        <NewsCommentsSection
          newsId={newsId}
          commentText={commentText}
          isSubmitting={isSubmitting}
          onCommentTextChange={setCommentText}
          onSubmitComment={handleSubmitComment}
        />
      </div>
    </HRLayout>
  )
}
