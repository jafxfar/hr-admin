'use client'

import { useState } from 'react'
import { useNews, useSetReactionMutation, useRemoveReactionMutation, useCreateCommentMutation } from '@/hooks/use-news'
import type { ReactionType } from '@/types/news'

export function useNewsDetailPage(newsId: number) {
  const { data: paginatedNews, isLoading: isNewsLoading } = useNews(1, 20)
  const newsItem = paginatedNews?.items?.find((n) => n.id === newsId)

  const { mutate: setReaction, isPending: isReacting } = useSetReactionMutation(newsId)
  const { mutate: removeReaction, isPending: isRemoving } = useRemoveReactionMutation(newsId)

  const [commentText, setCommentText] = useState('')
  const { mutate: createComment, isPending: isSubmitting } = useCreateCommentMutation(newsId)

  const handleReaction = (reaction: ReactionType) => {
    if (!newsItem) return
    if (newsItem.my_reaction === reaction) {
      removeReaction()
    } else {
      setReaction(reaction)
    }
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    createComment(
      { body: commentText.trim() },
      {
        onSuccess: () => setCommentText(''),
      },
    )
  }

  return {
    newsItem,
    isNewsLoading,
    commentText,
    setCommentText,
    isReacting,
    isRemoving,
    isSubmitting,
    handleReaction,
    handleSubmitComment,
  }
}
