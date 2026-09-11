'use client'

import { useState } from 'react'
import { useVacancy4Admin, useCreateVacancyMutation, useUpdateVacancyMutation, useDeleteVacancyMutation } from '@/hooks/use-vacancy'
import {
  useVacancyCategories,
  useCreateVacancyCategoriesMutation,
  useUpdateVacancyCategoriesMutation,
  useDeleteVacancyCategoryMutation,
} from '@/hooks/use-vacancyCategory'
import type { CreateVacancyRequest } from '@/types/vacancies'
import type { Vacancy } from '@/types/vacancies'
import type { VacancyCategory, CreateVacancyCategoryRequest } from '@/types/vacancyCategories'

const PAGE_SIZE = 20

export type VacanciesPageMode = 'vacancies' | 'categories'

export function useVacanciesPage(mode: VacanciesPageMode = 'vacancies') {
  const [search, setSearch] = useState('')
  const [vacancyPage, setVacancyPage] = useState(1)
  const [categoryPage, setCategoryPage] = useState(1)

  const [isVacancyDialogOpen, setIsVacancyDialogOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null)

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<VacancyCategory | null>(null)

  const { data: vacanciesData, isLoading: vacanciesLoading } = useVacancy4Admin(vacancyPage, PAGE_SIZE)
  const { data: categoriesData, isLoading: categoriesLoading } = useVacancyCategories(categoryPage, PAGE_SIZE)
  const createVacancyMutation = useCreateVacancyMutation()
  const updateVacancyMutation = useUpdateVacancyMutation()
  const deleteVacancyMutation = useDeleteVacancyMutation()
  const createCategoryMutation = useCreateVacancyCategoriesMutation()
  const updateCategoryMutation = useUpdateVacancyCategoriesMutation()
  const deleteCategoryMutation = useDeleteVacancyCategoryMutation()

  const vacancies = vacanciesData?.items ?? []
  const categories = categoriesData?.items ?? []

  const filteredVacancies = vacancies.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleVacancySubmit = (data: CreateVacancyRequest) => {
    if (editingVacancy) {
      updateVacancyMutation.mutate(
        { vacancy_id: editingVacancy.id, data },
        {
          onSuccess: () => {
            setIsVacancyDialogOpen(false)
            setEditingVacancy(null)
          },
        },
      )
    } else {
      createVacancyMutation.mutate(data, {
        onSuccess: () => setIsVacancyDialogOpen(false),
      })
    }
  }

  const handleEditVacancy = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy)
    setIsVacancyDialogOpen(true)
  }

  const handleCloseVacancyDialog = () => {
    setIsVacancyDialogOpen(false)
    setEditingVacancy(null)
  }

  const handleCategorySubmit = (data: CreateVacancyCategoryRequest) => {
    if (editingCategory) {
      updateCategoryMutation.mutate(
        { category_id: editingCategory.id, data },
        {
          onSuccess: () => {
            setIsCategoryDialogOpen(false)
            setEditingCategory(null)
          },
        },
      )
    } else {
      createCategoryMutation.mutate(data, {
        onSuccess: () => setIsCategoryDialogOpen(false),
      })
    }
  }

  const handleEditCategory = (category: VacancyCategory) => {
    setEditingCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteVacancy = (vacancy: Vacancy) => {
    deleteVacancyMutation.mutate(vacancy.id)
  }

  const handleDeleteCategory = (category: VacancyCategory) => {
    deleteCategoryMutation.mutate(category.id)
  }

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false)
    setEditingCategory(null)
  }

  const openCreateVacancy = () => {
    setEditingVacancy(null)
    setIsVacancyDialogOpen(true)
  }

  const openCreateCategory = () => {
    setIsCategoryDialogOpen(true)
  }

  const tabAction =
    mode === 'vacancies'
      ? { label: 'Добавить вакансию', onClick: openCreateVacancy }
      : { label: 'Добавить категорию', onClick: openCreateCategory }

  return {
    mode,
    search,
    setSearch,
    vacancyPage,
    setVacancyPage,
    categoryPage,
    setCategoryPage,
    vacanciesData,
    categoriesData,
    vacanciesLoading,
    categoriesLoading,
    filteredVacancies,
    categories,
    isVacancyDialogOpen,
    editingVacancy,
    isCategoryDialogOpen,
    editingCategory,
    createVacancyMutation,
    updateVacancyMutation,
    createCategoryMutation,
    updateCategoryMutation,
    tabAction,
    handleVacancySubmit,
    handleEditVacancy,
    handleCloseVacancyDialog,
    handleCategorySubmit,
    handleEditCategory,
    handleDeleteVacancy,
    handleDeleteCategory,
    handleCloseCategoryDialog,
    openCreateCategory,
  }
}
