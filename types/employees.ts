import { Education } from "./education";
import { WorkExperience } from "./workExperience";
import { Salary } from "./salary";
import { Positions } from "./positions";
import { Contract } from "./contracts";
import { Document, EmployeeDocument } from "./documents";
import { Schedule } from "./schedule";
import { Paginated } from "./pagination";

export interface Contacts {
    id?: number;
    name: string;
    phone: string;
    relative: string;
    source?: string;
    is_active?: boolean;
}

export interface EmployeeAddress {
    type: string;
    country?: string;
    city?: string;
    address?: string;
}

/** Филиал из JOIN branches (как в ответах API при включённой фиче) */
export interface BranchSummary {
    id: number;
    name: string;
    description?: string | null;
    code?: string | null;
    location?: string | null;
    parent_id?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    is_active?: boolean;
}

export interface PositionHistoryEntry {
    id: number;
    position_id: number;
    department_id: number;
    branch_id?: number | null;
    branch?: BranchSummary | null;
    manager_id?: number;
    started_at: string | null;
    ended_at?: string | null;
    /** Дата занесения записи назначения в систему (user_positions) */
    assigned_at?: string | null;
    is_current: boolean;
    title: string;
    description?: string | null;
    position_is_active: boolean;
}

export interface EmployeePositionChangeHistoryEntry {
    id: number;
    user_id: number;
    user_position_id?: number | null;
    from_position_id?: number | null;
    from_position_title?: string | null;
    to_position_id?: number | null;
    to_position_title?: string | null;
    from_department_id?: number | null;
    from_department_name?: string | null;
    to_department_id?: number | null;
    to_department_name?: string | null;
    reason_text?: string | null;
    basis_type?: string | null;
    basis_file_path?: string | null;
    basis_file_url?: string | null;
    changed_by_user_id?: number | null;
    changed_by_user_email?: string | null;
    changed_at?: string | null;
}

/** Категория типа документа из справочника (совпадает с API `document_types.category`) */
export type EmployeeDocumentTypeCategory = 'main' | 'contracts'

/** Элемент чеклиста документов из `GET /employees/employee/:id` */
export interface EmployeeDocumentChecklistItem {
    document_type: {
        id: number
        code: string
        title: string
        category: EmployeeDocumentTypeCategory
        sort_order?: number
        auto_complete_on_file_upload?: boolean
        allow_received_without_file?: boolean
    }
    received: boolean
    manually_received: boolean
    uploaded_documents: EmployeeDocument[]
}

export interface EmployeeDocumentChecklist {
    items: EmployeeDocumentChecklistItem[]
}

export type PaginatedEmployees = Paginated<Employee>;

export type EmploymentStatus = 'active' | 'terminated' | 'deleted'

export interface EmployeeTermination {
    termination_date?: string | null
    reason?: string | null
    decided_by_user_id?: number | null
    decided_by_full_name?: string | null
    created_by_user_id?: number | null
    basis_file_url?: string | null
    created_at?: string | null
    updated_at?: string | null
}

export interface EmployeeTerminateRequest {
    termination_date: string
    reason: string
    decided_by_user_id: number
}

/** Системная роль из `roles` (GET me / employee by id) */
export type EmployeeSystemRole = {
    id: number;
    name: string;
    description?: string | null;
    created_at?: string | null;
};

export type PositionDepartmentPosition =
    | string
    | {
          id?: number | null;
          title?: string | null;
          description?: string | null;
          /** Справочник должностей */
          created_at?: string | null;
          /** Период и даты из user_positions (текущее назначение) */
          started_at?: string | null;
          ended_at?: string | null;
          assigned_at?: string | null;
          manager?: {
              id?: number | null;
              full_name?: string | null;
              profile_photo_url?: string | null;
          } | null;
      };

export interface Employee {
    id: number;
    email: string;
    created_at: string;
    /**
     * Current position and department (list endpoint shape)
     * Example:
     * position: { id, title, description }
     * department: { id, name, description }
     */
    position?: {
        id: number | null;
        title: string | null;
        description: string | null;
    } | null;
    department?: {
        id: number | null;
        name: string | null;
        description: string | null;
    } | null;
    role?: string | EmployeeSystemRole | null;
    can_access_admin_ui?: boolean;
    personnel_number?: string;
    is_official_employment?: boolean;
    business_role?: unknown;
    properties: {
        city?: string;
        phone?: string;
        gender?: string;
        telegram?: string;
        inn?: string;
        hikvision_id?: string;
        last_name?: string;
        birth_date?: string;
        first_name?: string;
        middle_name?: string;
        actual_address?: string;
        marital_status?: string;
        registered_address?: string;
        profile_photo_url?: string;
    } | null;
    salaries?: Salary[];
    salary?: Salary[];
    /** Первый контакт (как в ответе профиля API) */
    contact?: Contacts | null;
    contacts?: Contacts[];
    addresses?: EmployeeAddress[];
    positions?: Positions[];
    /** Текущий филиал (список сотрудников) при `features.branches_enabled` */
    branch?: BranchSummary | null;
    /** Current position + department returned by the API */
    position_department?: {
        position: PositionDepartmentPosition;
        department:
            | string
            | {
                  id?: number | null;
                  name?: string | null;
                  head_user?: { id: number | null; full_name: string; profile_photo_url?: string | null } | null;
                  created_at?: string | null;
                  description?: string | null;
                  employees_count?: number;
              };
        branch?: BranchSummary | null;
    } | null;
    /** Full position history — first entry with is_current=true is the active one */
    position_history?: PositionHistoryEntry[];
    education?: Education[];
    educations?: Education[];
    work_experience?: WorkExperience[];
    work_experiences?: WorkExperience[];
    contracts?: Contract[];
    schedules?: Schedule[];
    documents?: EmployeeDocument[];
    document_checklist?: EmployeeDocumentChecklist;
    rewards?: unknown[];
    is_active?: boolean;
    employment_status?: EmploymentStatus;
    termination?: EmployeeTermination | null;
}

export interface UpdateEmployeeRequest {
    email?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone?: string;
    telegram?: string;
    inn?: string;
    hikvision_id?: string;
    birth_date?: string;
    gender?: string;
    city?: string;
    registered_address?: string;
    actual_address?: string;
    marital_status?: string;
    role_name?: string;
    business_role_id?: number;
    profile_photo_base64?: string;
    profile_photo_filename?: string;
    contracts?: Contract[];
    contacts?: Contacts[];
    position_id?: number;
    department_id?: number;
    branch_id?: number;
    manager_id?: number;
    position_change_reason_text?: string;
    position_change_basis_file_base64?: string;
    position_change_basis_filename?: string;
    position_change_basis_type?: string;
}

export interface CreateEmployeeRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;
    telegram?: string;
    inn?: string;
    hikvision_id?: string;
    birth_date?: string;
    gender?: string;
    city?: string;
    registered_address?: string;
    actual_address?: string;
    marital_status?: string;
    role_name?: string; // technical role name from /permissions/roles-admin/all
    business_role_id?: number;
    profile_photo_base64?: string;
    profile_photo_filename?: string;
    education?: Omit<Education, never>;
    work_experience?: Omit<WorkExperience, never>;
    salary?: Omit<Salary, never>;
    position_id?: number;
    department_id?: number;
    branch_id?: number;
    manager_id?: number;
    contacts?: Omit<Contacts[], never>;
    contracts?: Omit<Contract, never>[];
    documents?: Omit<Document, never>[];
    schedules?: Omit<Schedule, never>[];
}

export interface PublicProfilePosition {
    id?: number | null
    title?: string | null
    description?: string | null
    created_at?: string | null
    started_at?: string | null
    ended_at?: string | null
    assigned_at?: string | null
}

export interface PublicProfileDepartmentHead {
    id?: number | null
    full_name?: string | null
    profile_photo_url?: string | null
}

export interface PublicProfileDepartment {
    id?: number | null
    name?: string | null
    head_user?: PublicProfileDepartmentHead | null
}

export interface PublicProfileEducation {
    id?: number
    institution?: string | null
    degree?: string | null
    specialization?: string | null
    started_at?: string | null
    ended_at?: string | null
}

export interface PublicProfileWorkExperience {
    id?: number
    company?: string | null
    position?: string | null
    description?: string | null
    started_at?: string | null
    ended_at?: string | null
}

export interface PublicProfileReward {
    assignment_id?: number
    assigned_at?: string | null
    reward: {
        id: number
        title: string
        description?: string | null
        image_url?: string | null
        created_at?: string | null
    }
}

export interface PublicProfileSchedule {
    id?: number
    days_per_week?: number | null
    hours_per_day?: number | null
    started_at?: string | null
    ended_at?: string | null
    details?: Record<string, unknown> | null
}

/** View model for read-only employee profile page (platform colleagues layout) */
export interface EmployeeProfileViewModel {
    id: number
    email: string
    full_name?: string | null
    first_name?: string | null
    last_name?: string | null
    middle_name?: string | null
    profile_photo_url?: string | null
    branch?: BranchSummary | null
    position: PublicProfilePosition
    department: PublicProfileDepartment
    educations: PublicProfileEducation[]
    work_experiences: PublicProfileWorkExperience[]
    rewards: PublicProfileReward[]
    schedules: PublicProfileSchedule[]
    position_history?: PositionHistoryEntry[]
    document_checklist?: EmployeeDocumentChecklist
    is_active?: boolean
}