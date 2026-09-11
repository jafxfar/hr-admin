'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { HRLayout } from '@/components/hr-layout'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VacancyApplicationsBoard } from '@/components/vacancy-applications/board'
import {
  VacancyApplicationCreateModal,
  VacancyApplicationStatusCreateDialog,
  VacancyApplicationStatusModal,
} from '@/components/vacancy-applications'
import {
  useCreateVacancyApplicationMutation,
  useUpdateVacancyApplicationMutation,
} from '@/hooks/use-vacancy-applications'
import {
  useCreateVacancyApplicationStatusMutation,
  useDeleteVacancyApplicationStatusMutation,
  useUpdateVacancyApplicationStatusMutation,
  useVacancyApplicationBoard,
  useVacancyApplicationStatuses,
  useUpdateBoardPositionMutation,
} from '@/hooks/use-vacancy-application-board'
import { useVacancy4Admin } from '@/hooks/use-vacancy'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorMessage } from '@/lib/api-error'
import { mutationOpts } from '@/lib/mutation-options'
import type {
  CreateVacancyApplicationStatusDTO,
  UpdateVacancyApplicationStatusDTO,
  VacancyApplicationStatusItem,
} from '@/types/vacancyApplicationBoard'
import type {
  CreateVacancyApplicationDTO,
  VacancyApplication,
} from '@/types/vacancyApplications'
import { HeaderActionButton, HeaderFilterSelect, HeaderSearchInput, HeaderToolbarRow } from '@/components/hr-header-controls'

const VACANCIES_PAGE_SIZE = 20
const ALL_VACANCIES_VALUE = 'all'

export default function VacancyApplicationsPage() {
  const [vacancyFilter, setVacancyFilter] = useState(ALL_VACANCIES_VALUE)
  const [applicantSearch, setApplicantSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<VacancyApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createDefaultStatusCode, setCreateDefaultStatusCode] = useState<string | undefined>()
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<VacancyApplicationStatusItem | null>(null)
  const [statusToDelete, setStatusToDelete] = useState<VacancyApplicationStatusItem | null>(null)
  const [statusFormError, setStatusFormError] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(applicantSearch.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [applicantSearch])

  const boardFilters = useMemo(
    () => ({
      vacancyId:
        vacancyFilter === ALL_VACANCIES_VALUE ? null : Number(vacancyFilter),
      q: debouncedSearch || undefined,
    }),
    [vacancyFilter, debouncedSearch]
  )

  const defaultVacancyIdForCreate =
    vacancyFilter === ALL_VACANCIES_VALUE ? undefined : Number(vacancyFilter)

  const { data: vacanciesData } = useVacancy4Admin(1, VACANCIES_PAGE_SIZE)
  const { data: statusesData } = useVacancyApplicationStatuses()
  const { data: boardData, isLoading: boardLoading } = useVacancyApplicationBoard(boardFilters)
  const updateMutation = useUpdateVacancyApplicationMutation()
  const createMutation = useCreateVacancyApplicationMutation()
  const moveMutation = useUpdateBoardPositionMutation(boardFilters)
  const createStatusMutation = useCreateVacancyApplicationStatusMutation()
  const updateStatusMutation = useUpdateVacancyApplicationStatusMutation()
  const deleteStatusMutation = useDeleteVacancyApplicationStatusMutation()
  const { toast } = useToast()

  const isStatusFormPending = createStatusMutation.isPending || updateStatusMutation.isPending

  const vacancies = vacanciesData?.items ?? []
  const statuses = statusesData?.items ?? []

  const handleManageApplication = (application: VacancyApplication) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (updateMutation.isPending) return
    setIsModalOpen(false)
    setSelectedApplication(null)
  }

  const handleSubmit = ({ status, hr_comment }: { status: string; hr_comment: string }) => {
    if (!selectedApplication) return

    updateMutation.mutate(
      {
        applicationId: selectedApplication.id,
        data: { status, hr_comment },
      },
      mutationOpts({
        meta: { successTitle: 'Отклик обновлён' },
        onSuccess: () => {
          handleCloseModal()
        },
      }),
    )
  }

  const handleOpenCreateModal = (statusCode?: string) => {
    setCreateDefaultStatusCode(statusCode)
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    if (createMutation.isPending) return
    setIsCreateModalOpen(false)
    setCreateDefaultStatusCode(undefined)
  }

  const handleCreateApplication = ({
    vacancyId,
    data,
  }: {
    vacancyId: number
    data: CreateVacancyApplicationDTO
  }) => {
    createMutation.mutate(
      { vacancyId, data },
      mutationOpts({
        meta: { successTitle: 'Кандидат добавлен в отклики' },
        onSuccess: () => {
          setIsCreateModalOpen(false)
          setVacancyFilter(String(vacancyId))
        },
      }),
    )
  }

  const handleOpenCreateStatus = () => {
    setEditingStatus(null)
    setStatusFormError(null)
    setIsStatusFormOpen(true)
  }

  const handleOpenEditStatus = (status: VacancyApplicationStatusItem) => {
    setEditingStatus(status)
    setStatusFormError(null)
    setIsStatusFormOpen(true)
  }

  const handleCloseStatusForm = () => {
    if (isStatusFormPending) return
    setIsStatusFormOpen(false)
    setEditingStatus(null)
    setStatusFormError(null)
  }

  const handleCreateStatus = (data: CreateVacancyApplicationStatusDTO) => {
    setStatusFormError(null)
    createStatusMutation.mutate(
      data,
      mutationOpts({
        meta: { successTitle: 'Колонка создана', skipErrorToast: true },
        onSuccess: () => {
          handleCloseStatusForm()
        },
        onError: (error: unknown) => {
          setStatusFormError(getApiErrorMessage(error, 'Не удалось создать колонку'))
        },
      }),
    )
  }

  const handleUpdateStatus = (code: string, data: UpdateVacancyApplicationStatusDTO) => {
    setStatusFormError(null)
    updateStatusMutation.mutate(
      { code, data },
      mutationOpts({
        meta: { successTitle: 'Колонка обновлена', skipErrorToast: true },
        onSuccess: () => {
          handleCloseStatusForm()
        },
        onError: (error: unknown) => {
          setStatusFormError(getApiErrorMessage(error, 'Не удалось обновить колонку'))
        },
      }),
    )
  }

  const handleRequestDeleteStatus = (status: VacancyApplicationStatusItem) => {
    if (status.is_default) {
      toast({
        variant: 'destructive',
        title: 'Нельзя удалить колонку',
        description: 'Статус по умолчанию нельзя удалить',
      })
      return
    }
    setStatusToDelete(status)
  }

  const handleConfirmDeleteStatus = () => {
    if (!statusToDelete) return
    deleteStatusMutation.mutate(
      statusToDelete.code,
      mutationOpts({
        meta: { successTitle: 'Колонка удалена' },
        onSuccess: () => {
          setStatusToDelete(null)
        },
      }),
    )
  }

  const handleMoveCard = (
    applicationId: number,
    statusCode: string,
    position: number,
    closesVacancy: boolean,
    globalInsertIndex: number
  ) => {
    moveMutation.mutate(
      {
        applicationId,
        data: { status_code: statusCode, position },
        closesVacancy,
        globalInsertIndex,
      },
      {
        onSuccess: () => {
          if (closesVacancy) {
            toast({
              title: 'Вакансия закрыта',
              description: 'Отклик принят — вакансия помечена как закрытая',
            })
          }
        },
      }
    )
  }

  return (
    <HRLayout
      title="Отклики на вакансии"
      topActions={
        <HeaderToolbarRow>
          <HeaderSearchInput
            value={applicantSearch}
            onChange={setApplicantSearch}
            placeholder="Поиск по кандидату"
            widthClassName="min-w-[12rem] flex-1 max-w-xs"
          />
          <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
            <HeaderFilterSelect
              className="w-full min-w-56 max-w-md sm:w-72"
              active={vacancyFilter !== ALL_VACANCIES_VALUE}
            >
              <SelectValue placeholder="Все вакансии" />
            </HeaderFilterSelect>
            <SelectContent>
              <SelectItem value={ALL_VACANCIES_VALUE}>Все вакансии</SelectItem>
              {vacancies.map((vacancy) => (
                <SelectItem key={vacancy.id} value={String(vacancy.id)}>
                  {vacancy.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <HeaderActionButton onClick={() => handleOpenCreateModal()} icon={<Plus size={16} />}>
            Добавить отклик
          </HeaderActionButton>
        </HeaderToolbarRow>
      }
    >
      <div className="vacancy-applications-board flex h-full min-h-0 flex-1 flex-col overflow-hidden p-4 pt-3 select-none">
        <VacancyApplicationsBoard
          board={boardData}
          isLoading={boardLoading}
          isMoving={moveMutation.isPending}
          isAddApplicantDisabled={createMutation.isPending}
          onOpenCard={handleManageApplication}
          onMoveCard={handleMoveCard}
          onAddApplicant={handleOpenCreateModal}
          onAddColumn={handleOpenCreateStatus}
          onEditStatus={handleOpenEditStatus}
          onDeleteStatus={handleRequestDeleteStatus}
        />
      </div>

      <VacancyApplicationStatusModal
        open={isModalOpen}
        application={selectedApplication}
        statuses={statuses}
        isPending={updateMutation.isPending}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <VacancyApplicationCreateModal
        open={isCreateModalOpen}
        isPending={createMutation.isPending}
        defaultVacancyId={defaultVacancyIdForCreate}
        defaultStatusCode={createDefaultStatusCode}
        statuses={statuses}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateApplication}
      />

      <VacancyApplicationStatusCreateDialog
        isOpen={isStatusFormOpen}
        isPending={isStatusFormPending}
        errorMessage={statusFormError}
        editingStatus={editingStatus}
        onClose={handleCloseStatusForm}
        onSubmitCreate={handleCreateStatus}
        onSubmitUpdate={handleUpdateStatus}
      />

      <AlertDialog
        open={statusToDelete != null}
        onOpenChange={(open) => {
          if (!open && !deleteStatusMutation.isPending) setStatusToDelete(null)
        }}
      >
        <AlertDialogContent className="select-text border border-app-border-accent bg-app-surface-0 text-app-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить колонку?</AlertDialogTitle>
            <AlertDialogDescription className="text-app-text-muted">
              {statusToDelete
                ? `Колонка «${statusToDelete.title}» будет удалена. Удаление возможно только если в ней нет откликов.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteStatusMutation.isPending}
              className="rounded-full border-app-border-accent"
            >
              Отменить
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteStatus}
              disabled={deleteStatusMutation.isPending}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {deleteStatusMutation.isPending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </HRLayout>
  )
}
