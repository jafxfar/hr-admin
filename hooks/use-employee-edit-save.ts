'use client'

import { useRouter } from 'next/navigation'
import { useEmployeeForm } from '@/components/employee-form'
import { useCreateEducationMutation, useUpdateEducationMutation } from '@/hooks/use-education'
import { useCreateScheduleMutation, useUpdateScheduleMutation } from '@/hooks/use-schedule'
import { useCreateSalaryMutation, useUpdateSalaryMutation } from '@/hooks/use-salary'
import { useCreateContractMutation, useUpdateContractMutation } from '@/hooks/use-contract'
import {
  useCreateEmployeeMutation as useCreateWorkExperienceMutation,
  useUpdateEmployeeMutation as useUpdateWorkExperienceMutation,
} from '@/hooks/use-workExperience'
import { useCreateDocumentMutation } from '@/hooks/use-documents'
import { useUpdateEmployeeMutation, useTerminateEmployeeMutation, useMe } from '@/hooks/use-employees'
import { useToast } from '@/hooks/use-toast'
import { useSettingsFeatures } from '@/hooks/use-settings-features'
import { saveEmployeeEditRelated } from '@/components/employees/employee-edit-save-related'
import { validateEmployeeEdit } from '@/components/employees/employee-edit-validation'
import { formatFieldError, isRowSaveError, buildApiFieldError } from '@/lib/form-field-errors'
import type { UpdateEmployeeRequest } from '@/types/employees'
import type { CreateEducationRequest } from '@/types/education'
import type { CreateScheduleRequest } from '@/types/schedule'
import type { CreateSalaryRequest } from '@/types/salary'
import type { CreateContractRequest } from '@/types/contracts'
import type { CreateWorkExperienceRequest } from '@/types/workExperience'
import type { CreateDocumentRequest } from '@/types/documents'

import { silentMutationOpts } from '@/lib/mutation-options'

export const useEmployeeEditSave = (employeeId: number) => {
  const router = useRouter()
  const { toast } = useToast()
  const { formData, initialFormData, setFieldErrors, clearFieldErrors } = useEmployeeForm()
  const { data: settingsFeatures } = useSettingsFeatures()
  const branchesEnabled = settingsFeatures?.features?.branches_enabled !== false

  const { data: me } = useMe()
  const { mutateAsync: updateEmployee, isPending: isPendingEmployee } = useUpdateEmployeeMutation(employeeId)
  const { mutateAsync: terminateEmployee, isPending: isPendingTerminate } = useTerminateEmployeeMutation(employeeId)
  const { mutateAsync: createEducation, isPending: isPendingCreateEdu } = useCreateEducationMutation()
  const { mutateAsync: updateEducation, isPending: isPendingUpdateEdu } = useUpdateEducationMutation()
  const { mutateAsync: createSchedule, isPending: isPendingCreateSched } = useCreateScheduleMutation()
  const { mutateAsync: updateSchedule, isPending: isPendingUpdateSched } = useUpdateScheduleMutation()
  const { mutateAsync: createSalary, isPending: isPendingCreateSal } = useCreateSalaryMutation()
  const { mutateAsync: updateSalary, isPending: isPendingUpdateSal } = useUpdateSalaryMutation()
  const { mutateAsync: createContract, isPending: isPendingCreateContract } = useCreateContractMutation()
  const { mutateAsync: updateContract, isPending: isPendingUpdateContract } = useUpdateContractMutation()
  const { mutateAsync: createWorkExperience, isPending: isPendingCreateWE } = useCreateWorkExperienceMutation()
  const { mutateAsync: updateWorkExperience, isPending: isPendingUpdateWE } = useUpdateWorkExperienceMutation()
  const { mutateAsync: createDocument, isPending: isPendingCreateDoc } = useCreateDocumentMutation()

  const isPending =
    isPendingEmployee ||
    isPendingCreateEdu ||
    isPendingUpdateEdu ||
    isPendingCreateSched ||
    isPendingUpdateSched ||
    isPendingCreateSal ||
    isPendingUpdateSal ||
    isPendingCreateContract ||
    isPendingUpdateContract ||
    isPendingCreateWE ||
    isPendingUpdateWE ||
    isPendingCreateDoc ||
    isPendingTerminate

  const handleSave = async () => {
    const errors = validateEmployeeEdit({ formData, initialFormData, branchesEnabled })

    if (errors.length > 0) {
      setFieldErrors(errors)
      toast({
        variant: 'destructive',
        title: 'Заполните обязательные поля',
        description: formatFieldError(errors[0]),
      })
      return
    }

    clearFieldErrors()

    try {
      await saveEmployeeEditRelated(employeeId, formData, initialFormData, branchesEnabled, {
        updateEmployee: (payload: UpdateEmployeeRequest) =>
          updateEmployee(payload, silentMutationOpts),
        createEducation: (data: CreateEducationRequest) =>
          createEducation(data, silentMutationOpts),
        updateEducation: (args) => updateEducation(args, silentMutationOpts),
        createSchedule: (data: CreateScheduleRequest) =>
          createSchedule(data, silentMutationOpts),
        updateSchedule: (args) => updateSchedule(args, silentMutationOpts),
        createSalary: (data: CreateSalaryRequest) => createSalary(data, silentMutationOpts),
        updateSalary: (args) => updateSalary(args, silentMutationOpts),
        createContract: (data: CreateContractRequest) =>
          createContract(data, silentMutationOpts),
        updateContract: (args) => updateContract(args, silentMutationOpts),
        createWorkExperience: (data: CreateWorkExperienceRequest) =>
          createWorkExperience(data, silentMutationOpts),
        updateWorkExperience: (args) => updateWorkExperience(args, silentMutationOpts),
        createDocument: (data: CreateDocumentRequest) =>
          createDocument(data, silentMutationOpts),
      })

      const terminationDate = (formData.termination_date ?? '').trim()
      const terminationReason = (formData.termination_reason ?? '').trim()
      const initialTerminationDate = (initialFormData.termination_date ?? '').trim()
      const initialTerminationReason = (initialFormData.termination_reason ?? '').trim()
      const terminationChanged =
        terminationDate !== initialTerminationDate || terminationReason !== initialTerminationReason
      const isFirstTermination = !initialFormData.is_terminated && Boolean(terminationDate)

      if (terminationDate && terminationChanged) {
        if (!me?.id) {
          throw new Error('Не удалось определить текущего пользователя')
        }
        await terminateEmployee(
          {
            termination_date: terminationDate,
            reason: terminationReason,
            decided_by_user_id: me.id,
          },
          silentMutationOpts,
        )
      }

      if (isFirstTermination) {
        toast({ title: 'Сотрудник уволен и перенесён в архив' })
      } else {
        toast({ title: 'Данные сотрудника обновлены' })
      }
      router.push('/employees')
    } catch (error) {
      if (isRowSaveError(error)) {
        setFieldErrors([error.fieldError])
        toast({
          variant: 'destructive',
          title: 'Ошибка сохранения',
          description: formatFieldError(error.fieldError),
        })
        return
      }

      const fieldError = buildApiFieldError(error)
      setFieldErrors([fieldError])
      toast({
        variant: 'destructive',
        title: 'Ошибка сохранения',
        description: formatFieldError(fieldError),
      })
    }
  }

  return { handleSave, isPending }
}
