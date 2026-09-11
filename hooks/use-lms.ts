'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LMS_COURSES_QUERY_KEY, LMS_LEADERBOARD_QUERY_KEY, lmsApi } from '@/api/lms'
import {
  normalizeLmsCourses,
  normalizeLmsFullCourse,
  normalizeLmsLeaderboard,
} from '@/lib/lms-normalize'
import type {
  LmsChapterCreate,
  LmsCourseCreate,
  LmsLeaderboardType,
  LmsModuleCreate,
  LmsStepCreate,
} from '@/types/lms'

export const useLmsCourses = () =>
  useQuery({
    queryKey: LMS_COURSES_QUERY_KEY,
    queryFn: lmsApi.getAllCourses,
    select: normalizeLmsCourses,
  })

export const useLmsFullCourse = (courseId: number) =>
  useQuery({
    queryKey: [...LMS_COURSES_QUERY_KEY, 'full', courseId],
    queryFn: () => lmsApi.getFullCourse(courseId),
    select: (data) =>
      normalizeLmsFullCourse(data) ?? {
        id: courseId,
        title: '',
        info: null,
        users_count: null,
        max_points: null,
        max_attempts: null,
        passing_percentage: null,
        badge_url: null,
        image_url: null,
        main_source_url: null,
        modules: [],
      },
    enabled: Number.isFinite(courseId) && courseId > 0,
  })

export const useLmsLeaderboard = (lbType: LmsLeaderboardType, limit = 10) =>
  useQuery({
    queryKey: [...LMS_LEADERBOARD_QUERY_KEY, lbType, limit],
    queryFn: () => lmsApi.getLeaderboardTop(lbType, limit),
    select: normalizeLmsLeaderboard,
  })

export const useCreateLmsCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LmsCourseCreate) => lmsApi.createCourse(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LMS_COURSES_QUERY_KEY })
    },
  })
}

export const useCreateLmsModules = (courseId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (modules: LmsModuleCreate[]) => lmsApi.createModules(courseId, modules),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...LMS_COURSES_QUERY_KEY, 'full', courseId] })
      void queryClient.invalidateQueries({ queryKey: LMS_COURSES_QUERY_KEY })
    },
  })
}

export const useCreateLmsChapter = (courseId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ moduleId, chapter }: { moduleId: number; chapter: LmsChapterCreate }) =>
      lmsApi.createChapter(moduleId, chapter),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...LMS_COURSES_QUERY_KEY, 'full', courseId] })
    },
  })
}

export const useCreateLmsStep = (courseId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chapterId, step }: { chapterId: number; step: LmsStepCreate }) =>
      lmsApi.createStep(chapterId, step),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...LMS_COURSES_QUERY_KEY, 'full', courseId] })
    },
  })
}

export const useRegisterEmployeeToCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, employeeId }: { courseId: number; employeeId: number }) =>
      lmsApi.registerEmployee(courseId, employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LMS_COURSES_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: LMS_LEADERBOARD_QUERY_KEY })
    },
  })
}
