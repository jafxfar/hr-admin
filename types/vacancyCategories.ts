import { Paginated } from "./pagination";

export interface VacancyCategory {
    id: number;
    name: string;
    description: string;
}

export type PaginatedVacancyCategories = Paginated<VacancyCategory>;

export interface CreateVacancyCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateVacancyCategoryRequest {
    name?: string;
    description?: string;
}
