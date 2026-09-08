
export interface RolesPermissionFormValues {
  role: string;
  permissions: string;
}

export interface RolesPermission {
  id: string;
  role: string;
  permissions: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRolesPermissionDto {
  role: string | null;
  permissions: string[];
}
export interface ReadRolesPermission {
  role: string;
  permission_ids: string[];
}


export type UpdateRolesPermissionDto = Partial<CreateRolesPermissionDto>;

export interface RolesPermissionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}


export interface Permission {
  id: string;
  module: string;
  module_name: string;
  action: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionModule {
  id: string;
  name: string;
  code: string;
  permissions: Permission[];
}