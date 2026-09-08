export interface ModuleFormValues {
    name: string;
    code: string;
    description?: string;
    is_active?: boolean;
}

export interface Module {
    id: string;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateModuleDto {
    name: string;
    code: string;
    description?: string;
    is_active?: boolean;
}
export type UpdateModuleDto = Partial<CreateModuleDto>;

export interface ModuleListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}