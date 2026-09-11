'use client'

import { useState } from 'react'

import {
  useCreateIdeaCommentMutation,
  useIdea,
  useIdeaComments,
  useRemoveIdeaReactionMutation,
  useSetIdeaReactionMutation,
} from '@/hooks/use-ideas'
import { getPhotoUrl, normalizeComments } from '@/lib/ideas/utils'
import type { ReactionType } from '@/types/idea'

export const VISIBLE_COMMENTS_STEP = 5

export function useIdeaDetailPage(ideaId: number) {
  const { data: idea, isLoading: isIdeaLoading } = useIdea(ideaId)
  const { data: commentsData, isLoading: isCommentsLoading } = useIdeaComments(ideaId)
  const { mutate: setReaction, isPending: isReacting } = useSetIdeaReactionMutation(ideaId)
  const { mutate: removeReaction, isPending: isRemoving } = useRemoveIdeaReactionMutation(ideaId)
  const { mutate: createComment, isPending: isSubmitting } = useCreateIdeaCommentMutation(ideaId)

  const [commentText, setCommentText] = useState('')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COMMENTS_STEP)

  const comments = normalizeComments(commentsData)
  const visibleComments = comments.slice(0, visibleCount)
  const hasMore = comments.length > visibleCount
  const coverUrl = getPhotoUrl(idea?.cover_url)

  const handleReaction = (reaction: ReactionType) => {
    if (!idea) return
    if (idea.my_reaction === reaction) removeReaction()
    else setReaction(reaction)
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    createComment({ body: commentText.trim() }, { onSuccess: () => setCommentText('') })
  }

  const loadMoreComments = () => setVisibleCount((c) => c + VISIBLE_COMMENTS_STEP)

  return {
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
  }
}
