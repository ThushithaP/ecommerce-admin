export interface PermissionAction {
  value: string;
  name: string;
}

export type PermissionFormValues = CreatePermissionDto | UpdatePermissionDto

export interface Permission {
  id: string;
  module: string;
  code: string;
  actions: string[];
  action: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePermissionDto {
  module: string;
  actions: string[];
}
export interface UpdatePermissionDto {
  module: string;
  action: string;
}

export interface PermissionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}