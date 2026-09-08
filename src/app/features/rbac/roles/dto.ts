export interface RoleFormValues {
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateRoleDto {
    name: string;
    description?: string;
    is_active?: boolean;
}
export type UpdateRoleDto = Partial<CreateRoleDto>;

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}