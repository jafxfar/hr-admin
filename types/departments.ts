
export interface CreateDepartmentDTO {
    name: string;
    parent_id: number | null;
    description: string;
    head_user_id: number;
    branch_id?: number | null;
    allowed_position_ids?: number[];
    icon?: string | null;
}

export interface UpdateDepartmentDTO {
    name?: string;
    description?: string;
    parent_id?: number | null;
    head_user_id?: number;
    branch_id?: number | null;
    allowed_position_ids?: number[];
    icon?: string | null;
}

export interface DepartmentHeadUser {
    id: number;
    phone?: string;
    telegram?: string;
    full_name?: string;
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    profile_photo_url?: string | null;
    exists?: boolean;
}

// Ответ /departments/all
export interface Department {
    id: number;
    name: string;
    department_name?: string;   // поле из /departments/tree (алиас name)
    description?: string;
    branch_id?: number | null;
    parent_id: number | null;   // 0 или null = корневой отдел
    created_at?: string;
    head_user?: DepartmentHeadUser | null;
    allowed_positions?: { id: number; title: string; description?: string | null }[];
    children?: Department[];    // вложенные отделы из /departments/tree
    // поля из /departments/tree (могут отсутствовать в /all)
    level?: number;
    path?: string;
    /** Имя Lucide-иконки (PascalCase) или CSS-цвет карточки в оргструктуре */
    icon?: string | null;
}
