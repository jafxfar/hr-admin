import type {
  ResumeCourseItem,
  ResumeEducationItem,
  ResumeWorkExperienceItem,
} from '@/types/vacancyApplications'

export type ResumeFormState = {
  vacancyId: string
  statusCode: string
  lastName: string
  firstName: string
  middleName: string
  birthDate: string
  gender: string
  phone: string
  email: string
  address: string
  maritalStatus: string
  childrenCount: string
  hasMilitaryId: string
  city: string
  telegram: string
  inn: string
  photoBase64: string | null
  photoFilename: string | null
  photoPreviewUrl: string | null
  educations: ResumeEducationItem[]
  pcSkills: string[]
  otherSkills: string[]
  languages: string[]
  driverLicenseCategory: string
  carModel: string
  courses: ResumeCourseItem[]
  workExperiences: ResumeWorkExperienceItem[]
  about: string
  criminalRecord: string
  hobbies: string
  probationAgreed: string
  salaryExpectation: string
  recommendations: string[]
}

export const createEmptyResumeForm = (): ResumeFormState => ({
  vacancyId: '',
  statusCode: '',
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  maritalStatus: '',
  childrenCount: '',
  hasMilitaryId: '',
  city: '',
  telegram: '',
  inn: '',
  photoBase64: null,
  photoFilename: null,
  photoPreviewUrl: null,
  educations: [],
  pcSkills: [],
  otherSkills: [],
  languages: [],
  driverLicenseCategory: '',
  carModel: '',
  courses: [],
  workExperiences: [],
  about: '',
  criminalRecord: '',
  hobbies: '',
  probationAgreed: '',
  salaryExpectation: '',
  recommendations: [],
})
