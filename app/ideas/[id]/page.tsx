'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'

import { HRLayout } from '@/components/hr-layout'
import {
  IdeaCommentsSection,
  IdeaDetailContent,
  IdeaReactionsBar,
} from '@/components/ideas'
import { useIdeaDetailPage } from '@/hooks/use-idea-detail-page'
import Loading from '@/components/ui/loading'

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ideaId = Number(params.id)

  const {
    idea,
    isIdeaLoading,
    isCommentsLoading,
    isReacting,
    isRemoving,
    isSubmitting,
    commentText,
    setCommentText,
    comments,
    visibleComments,
    hasMore,
    coverUrl,
    handleReaction,
    handleSubmitComment,
    loadMoreComments,
  } = useIdeaDetailPage(ideaId)

  if (isIdeaLoading) {
    return (
      <HRLayout title="Идея">
        <Loading />
      </HRLayout>
    )
  }

  if (!idea) {
    return (
      <HRLayout title="Идея">
        <div className="p-8 text-center text-app-text-muted">Идея не найдена</div>
      </HRLayout>
    )
  }

  return (
    <HRLayout
      title={idea.title}
      action={{
        icon: <ArrowLeftIcon size={24} />,
        label: 'Назад',
        onClick: () => router.push('/ideas'),
      }}
    >
      <div className="p-4 max-w-3xl mx-auto space-y-6">
        <IdeaDetailContent idea={idea} coverUrl={coverUrl} />

        <IdeaReactionsBar
          idea={idea}
          isReacting={isReacting}
          isRemoving={isRemoving}
          onReaction={handleReaction}
        />

        <IdeaCommentsSection
          ideaId={ideaId}
          comments={comments}
          visibleComments={visibleComments}
          hasMore={hasMore}
          commentText={commentText}
          isCommentsLoading={isCommentsLoading}
          isSubmitting={isSubmitting}
          onCommentTextChange={setCommentText}
          onSubmitComment={handleSubmitComment}
          onLoadMore={loadMoreComments}
        />
      </div>
    </HRLayout>
  )
}
