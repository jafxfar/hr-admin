'use client'

import { HRLayout } from '@/components/hr-layout'
import {
  VacancyCategoryDialog,
  VacancyCategoriesTable,
} from '@/components/vacancies'
import { useVacanciesPage } from '@/hooks/use-vacancies-page'

export default function VacancyCategoriesPage() {
  const p = useVacanciesPage('categories')

  return (
    <HRLayout title="Категории вакансий" action={p.tabAction}>
      <div className="admin-content-inset space-y-3">
        <VacancyCategoriesTable
          categories={p.categories}
          total={p.categoriesData?.total ?? 0}
          page={p.categoriesData?.page ?? p.categoryPage}
          totalPages={p.categoriesData?.total_pages ?? 1}
          onPageChange={p.setCategoryPage}
          isLoading={p.categoriesLoading}
          onEdit={p.handleEditCategory}
          onDelete={p.handleDeleteCategory}
        />
      </div>

      <VacancyCategoryDialog
        isOpen={p.isCategoryDialogOpen}
        onClose={p.handleCloseCategoryDialog}
        onSubmit={p.handleCategorySubmit}
        isPending={p.createCategoryMutation.isPending || p.updateCategoryMutation.isPending}
        editingCategory={p.editingCategory}
      />
    </HRLayout>
  )
}
