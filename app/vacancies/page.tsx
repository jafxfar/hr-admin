'use client'

import { HRLayout } from '@/components/hr-layout'
import Loading from '../../components/ui/loading'
import {
  VacanciesSearch,
  VacanciesTable,
  VacancyDialog,
} from '@/components/vacancies'
import { useVacanciesPage } from '@/hooks/use-vacancies-page'

export default function VacanciesPage() {
  const p = useVacanciesPage('vacancies')

  return (
    <HRLayout
      title="Вакансии"
      action={p.tabAction}
      topActions={
        <VacanciesSearch value={p.search} onChange={p.setSearch} />
      }
    >
      <div className="admin-content-inset space-y-3" data-marketing="vacancies">
        <div className="space-y-4">
          {p.vacanciesLoading ? (
            <Loading />
          ) : (
            <VacanciesTable
              vacancies={p.filteredVacancies}
              categories={p.categories}
              total={p.vacanciesData?.total ?? 0}
              page={p.vacanciesData?.page ?? p.vacancyPage}
              totalPages={p.vacanciesData?.total_pages ?? 1}
              onPageChange={p.setVacancyPage}
              onEdit={p.handleEditVacancy}
              onDelete={p.handleDeleteVacancy}
            />
          )}
        </div>
      </div>

      <VacancyDialog
        isOpen={p.isVacancyDialogOpen}
        onClose={p.handleCloseVacancyDialog}
        onSubmit={p.handleVacancySubmit}
        isPending={p.createVacancyMutation.isPending || p.updateVacancyMutation.isPending}
        categories={p.categories}
        editingVacancy={p.editingVacancy}
      />
    </HRLayout>
  )
}
