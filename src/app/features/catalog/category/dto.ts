export interface CategoryFormValues {
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface Categories {
    id: number;
    name: string;
    position: number;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    is_active?: boolean;
}
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface CategoryListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}