import type { EmployeeFormData } from '@/components/employee-form/EmployeeFormContext'
import type { CreateContractRequest } from '@/types/contracts'
import type { CreateDocumentRequest } from '@/types/documents'
import type { CreateEducationRequest } from '@/types/education'
import type { CreateSalaryRequest } from '@/types/salary'
import type { CreateScheduleRequest } from '@/types/schedule'
import type { CreateWorkExperienceRequest } from '@/types/workExperience'
import { buildApiFieldError, RowSaveError } from '@/lib/form-field-errors'
import {
  type FormDocument,
  isSame,
  normalizeContract,
  normalizeEducation,
  normalizeSalary,
  normalizeSchedule,
  normalizeWorkExperience,
} from './employee-edit-utils'
import type { EmployeeEditMutations } from './employee-edit-mutations'

const wrapRowSave = async (
  row: number,
  section: string,
  fallbackField: string,
  action: () => Promise<unknown>,
) => {
  try {
    await action()
  } catch (error) {
    throw new RowSaveError(buildApiFieldError(error, { row, section, fallbackField }))
  }
}

export const saveEmployeeEducationAndSchedules = async (
  employeeId: number,
  formData: EmployeeFormData,
  initialFormData: EmployeeFormData,
  mutations: Pick<
    EmployeeEditMutations,
    'createEducation' | 'updateEducation' | 'createSchedule' | 'updateSchedule'
  >,
) => {
  for (const [index, edu] of (formData.educations ?? []).entries()) {
    const row = index + 1
    const eduPayload: CreateEducationRequest = {
      user_id: employeeId,
      institution: edu.institution,
      degree: edu.degree,
      specialization: edu.specialization,
      started_at: edu.started_at,
      ended_at: edu.ended_at,
    }

    if (edu.id) {
      const initial = (initialFormData.educations ?? []).find((x) => x.id === edu.id)
      if (!initial || !isSame(normalizeEducation(edu), normalizeEducation(initial))) {
        await wrapRowSave(row, 'education', 'institution', () =>
          mutations.updateEducation({ education_id: edu.id!, data: eduPayload }),
        )
      }
    } else {
      await wrapRowSave(row, 'education', 'institution', () => mutations.createEducation(eduPayload))
    }
  }

  for (const [index, sch] of (formData.schedules ?? []).entries()) {
    const row = index + 1
    const data: CreateScheduleRequest = {
      user_id: employeeId,
      days_per_week: sch.days_per_week,
      hours_per_day: sch.hours_per_day,
      started_at: sch.started_at,
      ended_at: sch.ended_at,
      details: sch.details,
    }

    if (sch.id) {
      const initial = (initialFormData.schedules ?? []).find((x) => x.id === sch.id)
      if (!initial || !isSame(normalizeSchedule(sch), normalizeSchedule(initial))) {
        await wrapRowSave(row, 'schedule', 'started_at', () =>
          mutations.updateSchedule({ schedule_id: sch.id!, data }),
        )
      }
    } else {
      await wrapRowSave(row, 'schedule', 'started_at', () => mutations.createSchedule(data))
    }
  }
}

export const saveEmployeeSalaryWorkContractsDocs = async (
  employeeId: number,
  formData: EmployeeFormData,
  initialFormData: EmployeeFormData,
  mutations: Pick<
    EmployeeEditMutations,
    | 'createSalary'
    | 'updateSalary'
    | 'createWorkExperience'
    | 'updateWorkExperience'
    | 'createContract'
    | 'updateContract'
    | 'createDocument'
  >,
) => {
  for (const [index, sal] of (formData.salaries ?? []).entries()) {
    const row = index + 1
    const data: CreateSalaryRequest = {
      user_id: employeeId,
      amount: sal.amount,
      currency: sal.currency,
      prepaid_percent: sal.prepaid_percent,
      started_at: sal.started_at,
      ended_at: sal.ended_at,
    }

    if (sal.id) {
      const initial = (initialFormData.salaries ?? []).find((x) => x.id === sal.id)
      if (!initial || !isSame(normalizeSalary(sal), normalizeSalary(initial))) {
        await wrapRowSave(row, 'salary', 'amount', () =>
          mutations.updateSalary({ salary_id: sal.id!, data }),
        )
      }
    } else {
      await wrapRowSave(row, 'salary', 'amount', () => mutations.createSalary(data))
    }
  }

  for (const [index, we] of (formData.work_experiences ?? []).entries()) {
    const row = index + 1
    const data: CreateWorkExperienceRequest = {
      user_id: employeeId,
      company: we.company,
      position: we.position,
      description: we.description,
      started_at: we.started_at,
      ended_at: we.ended_at,
    }

    if (we.id) {
      const initial = (initialFormData.work_experiences ?? []).find((x) => x.id === we.id)
      if (!initial || !isSame(normalizeWorkExperience(we), normalizeWorkExperience(initial))) {
        await wrapRowSave(row, 'work', 'company', () =>
          mutations.updateWorkExperience({ work_experience_id: we.id!, data }),
        )
      }
    } else {
      await wrapRowSave(row, 'work', 'company', () => mutations.createWorkExperience(data))
    }
  }

  for (const [index, c] of (formData.contracts ?? []).entries()) {
    const row = index + 1
    const data: CreateContractRequest = {
      user_id: employeeId,
      type: c.type,
      started_at: c.started_at,
      ended_at: c.ended_at,
      details: c.details,
    }

    if (c.id) {
      const initial = (initialFormData.contracts ?? []).find((x) => x.id === c.id)
      if (!initial || !isSame(normalizeContract(c), normalizeContract(initial))) {
        await wrapRowSave(row, 'contract', 'type', () =>
          mutations.updateContract({ contract_id: c.id!, data }),
        )
      }
    } else {
      await wrapRowSave(row, 'contract', 'type', () => mutations.createContract(data))
    }
  }

  for (const [index, doc] of ((formData.documents ?? []) as FormDocument[]).entries()) {
    if (doc._serverId) continue
    if (!doc.file_base64) continue

    const row = index + 1
    const data: CreateDocumentRequest = {
      user_id: employeeId,
      title: doc.title,
      type: doc.type,
      ...(doc.document_type_id != null ? { document_type_id: doc.document_type_id } : {}),
      filename: doc.filename,
      file_base64: doc.file_base64,
      params: doc.params,
    }

    await wrapRowSave(row, 'document', 'title', () => mutations.createDocument(data))
  }
}
