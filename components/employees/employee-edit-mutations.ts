import type { CreateContractRequest } from '@/types/contracts'
import type { CreateDocumentRequest } from '@/types/documents'
import type { CreateEducationRequest } from '@/types/education'
import type { CreateSalaryRequest } from '@/types/salary'
import type { CreateScheduleRequest } from '@/types/schedule'
import type { CreateWorkExperienceRequest } from '@/types/workExperience'
import type { UpdateEmployeeRequest } from '@/types/employees'

export type EmployeeEditMutations = {
  updateEmployee: (payload: UpdateEmployeeRequest) => Promise<unknown>
  createEducation: (data: CreateEducationRequest) => Promise<unknown>
  updateEducation: (args: { education_id: number; data: CreateEducationRequest }) => Promise<unknown>
  createSchedule: (data: CreateScheduleRequest) => Promise<unknown>
  updateSchedule: (args: { schedule_id: number; data: CreateScheduleRequest }) => Promise<unknown>
  createSalary: (data: CreateSalaryRequest) => Promise<unknown>
  updateSalary: (args: { salary_id: number; data: CreateSalaryRequest }) => Promise<unknown>
  createContract: (data: CreateContractRequest) => Promise<unknown>
  updateContract: (args: { contract_id: number; data: CreateContractRequest }) => Promise<unknown>
  createWorkExperience: (data: CreateWorkExperienceRequest) => Promise<unknown>
  updateWorkExperience: (args: { work_experience_id: number; data: CreateWorkExperienceRequest }) => Promise<unknown>
  createDocument: (data: CreateDocumentRequest) => Promise<unknown>
}
